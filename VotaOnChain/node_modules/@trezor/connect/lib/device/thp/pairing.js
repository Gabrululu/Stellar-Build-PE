"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thpPairing = exports.thpPairingEnd = exports.getThpCredentials = void 0;
const crypto_1 = require("crypto");
const protocol_1 = require("@trezor/protocol");
const utils_1 = require("@trezor/utils");
const constants_1 = require("../../constants");
const DataManager_1 = require("../../data/DataManager");
const events_1 = require("../../events");
const thpCall_1 = require("./thpCall");
const processQrCodeTag = async (device, value) => {
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  const tagSha = (0, crypto_1.createHash)('sha256').update(thpState.handshakeCredentials.handshakeHash).update(Buffer.from(value, 'hex')).digest('hex');
  const qrCodeSecret = await (0, thpCall_1.thpCall)(device, 'ThpQrCodeTag', {
    tag: tagSha
  });
  protocol_1.thp.validateQrCodeTag(thpState.handshakeCredentials, value, qrCodeSecret.message.secret);
  return qrCodeSecret;
};
const processNfcTag = async (device, value) => {
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  if (!thpState?.nfcSecret) {
    throw new Error('missing nfcSecret');
  }
  const tagSha = (0, crypto_1.createHash)('sha256').update(Buffer.from([protocol_1.thp.ThpPairingMethod.NFC])).update(thpState.handshakeCredentials.handshakeHash).update(Buffer.from(value, 'hex')).digest('hex');
  const nfcTagTrezor = await (0, thpCall_1.thpCall)(device, 'ThpNfcTagHost', {
    tag: tagSha
  });
  protocol_1.thp.validateNfcTag(thpState.handshakeCredentials, nfcTagTrezor.message.tag, thpState.nfcSecret);
  return nfcTagTrezor;
};
const processCodeEntry = async (device, value) => {
  if (value.length !== 6) {
    throw constants_1.ERRORS.TypedError('Device_ThpPairingTagInvalid');
  }
  const codeValue = Buffer.from(value, 'ascii');
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  const hostKeys = protocol_1.thp.getCpaceHostKeys(codeValue, thpState.handshakeCredentials.handshakeHash);
  const tag = protocol_1.thp.getSharedSecret(thpState.handshakeCredentials.trezorCpacePublicKey, hostKeys.privateKey).toString('hex');
  const codeEntrySecret = await (0, thpCall_1.thpCall)(device, 'ThpCodeEntryCpaceHostTag', {
    tag,
    cpace_host_public_key: hostKeys.publicKey.toString('hex')
  });
  protocol_1.thp.validateCodeEntryTag(thpState.handshakeCredentials, value, codeEntrySecret.message.secret);
  return codeEntrySecret;
};
const processThpPairingResponse = (device, payload) => {
  if ('selectedMethod' in payload) {
    const selectedMethod = protocol_1.thp.getThpPairingMethod(payload.selectedMethod);
    device.getThpState()?.setPairingMethod(selectedMethod);
    return (0, thpCall_1.thpCall)(device, 'ThpSelectMethod', {
      selected_pairing_method: selectedMethod
    });
  }
  const selectedMethod = device.getThpState()?.pairingMethod;
  if (selectedMethod === protocol_1.ThpPairingMethod.QrCode) {
    return processQrCodeTag(device, payload.tag);
  }
  if (selectedMethod === protocol_1.ThpPairingMethod.NFC) {
    return processNfcTag(device, payload.tag);
  }
  if (selectedMethod === protocol_1.ThpPairingMethod.CodeEntry) {
    return processCodeEntry(device, payload.tag);
  }
  throw constants_1.ERRORS.TypedError('Device_ThpPairingMethodsException');
};
const waitForPairingCancel = device => {
  const readAbort = new AbortController();
  device.getThpState()?.setExpectedResponses([0x04]);
  const readCancel = device.getCurrentSession().receive({
    signal: readAbort.signal
  });
  return {
    readAbort,
    readCancel
  };
};
const waitForPairingTag = async device => {
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  if (thpState.pairingMethod === undefined) {
    throw constants_1.ERRORS.TypedError('Device_ThpPairingMethodsException');
  }
  const dfd = (0, utils_1.createDeferred)();
  const {
    readAbort,
    readCancel
  } = waitForPairingCancel(device);
  const cancelResult = readCancel.then(readResult => {
    if (readResult.success) {
      let error;
      if (readResult.payload.type === 'Failure' && readResult.payload.message.message) {
        error = readResult.payload.message.message;
      } else {
        error = `Pairing tag cancelled (${readResult.payload.type})`;
      }
      dfd.resolve({
        error
      });
    }
  }).catch(() => {});
  thpState.setPairingTagPromise({
    abort: async () => {
      readAbort.abort();
      await cancelResult;
    }
  });
  const payload = {
    availableMethods: thpState.handshakeCredentials.pairingMethods,
    selectedMethod: thpState.pairingMethod,
    nfcData: thpState.nfcData?.toString('hex')
  };
  device.prompt(events_1.DEVICE.THP_PAIRING, {
    payload
  }).then(response => {
    if (response.success) {
      dfd.resolve(response.payload);
    } else {
      (0, thpCall_1.abortThpWorkflow)(device).then(() => {
        dfd.resolve({
          error: response.error.message
        });
      });
    }
  });
  const pairingResponse = await dfd.promise;
  readAbort.abort();
  await readCancel;
  thpState.setPairingTagPromise(undefined);
  if ('error' in pairingResponse) {
    throw new Error(pairingResponse.error);
  }
  await new Promise(resolve => setTimeout(resolve, 500));
  return processThpPairingResponse(device, pairingResponse).catch(e => {
    if (e.code === 'Failure_FirmwareError') {
      throw constants_1.ERRORS.TypedError('Device_ThpPairingTagInvalid', e.message);
    }
    throw constants_1.ERRORS.TypedError(e.code, e.message);
  });
};
const getThpCredentials = async (device, autoconnect = false) => {
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  const credentials = await (0, thpCall_1.thpCall)(device, 'ThpCredentialRequest', {
    autoconnect,
    host_static_public_key: thpState.handshakeCredentials.hostStaticPublicKey.toString('hex'),
    credential: thpState.pairingCredentials[0]?.credential
  });
  return {
    ...credentials.message,
    autoconnect
  };
};
exports.getThpCredentials = getThpCredentials;
const thpPairingEnd = device => {
  device.getThpState()?.setPhase('paired');
  return (0, thpCall_1.thpCall)(device, 'ThpEndRequest', {});
};
exports.thpPairingEnd = thpPairingEnd;
const thpPairing = async device => {
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  if (thpState.isPaired && thpState.pairingMethod !== protocol_1.thp.ThpPairingMethod.SkipPairing) {
    if (!thpState.isAutoconnectPaired) {
      await (0, exports.getThpCredentials)(device, false);
    }
    return (0, exports.thpPairingEnd)(device);
  }
  const [selected_pairing_method] = thpState.handshakeCredentials.pairingMethods;
  thpState.setPairingMethod(selected_pairing_method);
  const settings = DataManager_1.DataManager.getSettings('thp');
  await (0, thpCall_1.thpCall)(device, 'ThpPairingRequest', {
    host_name: settings?.hostName || 'Unknown hostName',
    app_name: settings?.appName || 'Unknown appName'
  });
  const selectMethod = await (0, thpCall_1.thpCall)(device, 'ThpSelectMethod', {
    selected_pairing_method
  });
  if (selectMethod.type === 'ThpEndResponse') {
    thpState.setIsPaired(true);
    device.getThpState()?.setPhase('paired');
    return;
  }
  if (selectMethod.type === 'ThpCodeEntryCommitment') {
    const codeEntryChallenge = (0, crypto_1.randomBytes)(32);
    const handshakeCommitment = Buffer.from(selectMethod.message.commitment, 'hex');
    thpState.updateHandshakeCredentials({
      handshakeCommitment,
      codeEntryChallenge
    });
    const codeEntryCpace = await (0, thpCall_1.thpCall)(device, 'ThpCodeEntryChallenge', {
      challenge: codeEntryChallenge.toString('hex')
    });
    thpState.updateHandshakeCredentials({
      trezorCpacePublicKey: Buffer.from(codeEntryCpace.message.cpace_trezor_public_key, 'hex')
    });
    await waitForPairingTag(device);
  }
  if (selectMethod.type === 'ThpPairingPreparationsFinished') {
    if (thpState.pairingMethod === protocol_1.thp.ThpPairingMethod.NFC) {
      thpState.setNfcSecret((0, crypto_1.randomBytes)(16));
    }
    await waitForPairingTag(device);
  }
  const credentials = await (0, exports.getThpCredentials)(device, false);
  device.emit(events_1.DEVICE.THP_CREDENTIALS_CHANGED, {
    credentials,
    staticKey: thpState.handshakeCredentials.staticKey.toString('hex')
  });
  const settings1 = DataManager_1.DataManager.getSettings('thp');
  if (settings1) {
    settings1.knownCredentials?.push(credentials);
    settings1.staticKey = thpState.handshakeCredentials.staticKey.toString('hex');
  }
  thpState.setPairingCredentials([credentials]);
  thpState.setIsPaired(true);
  await (0, exports.thpPairingEnd)(device);
};
exports.thpPairing = thpPairing;
//# sourceMappingURL=pairing.js.map