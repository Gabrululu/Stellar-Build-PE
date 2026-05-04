"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.thpHandshake = exports.createThpChannel = void 0;
const crypto_1 = require("crypto");
const protobuf_1 = require("@trezor/protobuf");
const protocol_1 = require("@trezor/protocol");
const thpCall_1 = require("./thpCall");
const constants_1 = require("../../constants");
const DataManager_1 = require("../../data/DataManager");
const getPairingMethods = (deviceMethods, settingsMethods) => deviceMethods?.flatMap(dm => {
  const value = protocol_1.thp.getThpPairingMethod(dm);
  const isRequested = settingsMethods && settingsMethods.find(sm => value === protocol_1.thp.getThpPairingMethod(sm));
  return isRequested ? value : [];
});
const createThpChannel = async device => {
  const thpState = device.getThpState();
  if (!thpState) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  thpState.setChannel(protocol_1.thp.constants.THP_DEFAULT_CHANNEL);
  const nonce = (0, crypto_1.randomBytes)(8);
  const createChannel = await (0, thpCall_1.thpCall)(device, 'ThpCreateChannelRequest', {
    nonce
  });
  const {
    properties,
    ...resp
  } = createChannel.message;
  if (nonce.compare(resp.nonce) !== 0) {
    throw new Error('Nonce not meet' + nonce.toString('hex') + ' ' + resp.nonce.toString('hex'));
  }
  const settings = DataManager_1.DataManager.getSettings('thp');
  const pairingMethods = getPairingMethods(properties.pairing_methods, settings?.pairingMethods);
  if (!pairingMethods?.length) {
    throw constants_1.ERRORS.TypedError('Device_ThpPairingMethodsException');
  }
  thpState.setThpProperties(properties);
  thpState.setChannel(resp.channel);
  thpState.updateHandshakeCredentials({
    pairingMethods,
    handshakeHash: resp.handshakeHash
  });
};
exports.createThpChannel = createThpChannel;
const thpHandshake = async (device, unlockPin = false) => {
  const thpState = device.getThpState();
  if (!thpState?.handshakeCredentials) {
    throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
  }
  const settings = DataManager_1.DataManager.getSettings('thp');
  const staticKey = settings?.staticKey ? Buffer.from(settings.staticKey, 'hex') : (0, crypto_1.randomBytes)(32);
  const hostStaticKeys = protocol_1.thp.getCurve25519KeyPair(staticKey);
  const knownCredentials = (settings?.knownCredentials || []).sort(cre => cre.autoconnect ? -1 : 1);
  const tryToUnlock = unlockPin ? 1 : 0;
  const hostEphemeralKeys = protocol_1.thp.getCurve25519KeyPair((0, crypto_1.randomBytes)(32));
  const handshakeInit = await (0, thpCall_1.thpCall)(device, 'ThpHandshakeInitRequest', {
    key: hostEphemeralKeys.publicKey,
    tryToUnlock
  });
  const {
    trezorEncryptedStaticPubkey
  } = handshakeInit.message;
  const handshakeCredentials = protocol_1.thp.handleHandshakeInit({
    handshakeInitResponse: handshakeInit.message,
    thpState,
    hostStaticKeys,
    hostEphemeralKeys,
    knownCredentials,
    tryToUnlock,
    protobufEncoder: (name, data) => (0, protobuf_1.encodeMessage)(device.transport.getMessages(), name, data)
  });
  const {
    hostKey,
    trezorKey,
    hostEncryptedStaticPubkey
  } = handshakeCredentials;
  thpState.updateHandshakeCredentials({
    trezorEncryptedStaticPubkey,
    hostEncryptedStaticPubkey,
    handshakeHash: handshakeCredentials.handshakeHash,
    trezorKey,
    hostKey,
    staticKey,
    hostStaticPublicKey: hostStaticKeys.publicKey
  });
  thpState.setPairingCredentials(handshakeCredentials.allCredentials);
  const handshakeCompletion = await (0, thpCall_1.thpCall)(device, 'ThpHandshakeCompletionRequest', {
    hostPubkey: hostEncryptedStaticPubkey,
    encryptedPayload: handshakeCredentials.encryptedPayload
  });
  if (!handshakeCompletion.message.state && handshakeCredentials.credentials) {
    thpState.removePairingCredential(handshakeCredentials.credentials);
    const {
      credential
    } = handshakeCredentials.credentials;
    const index = settings?.knownCredentials?.findIndex(c => c.credential === credential) ?? -1;
    if (index >= 0) {
      settings?.knownCredentials?.splice(index, 1);
    }
  }
  thpState.setIsPaired(handshakeCompletion.message.state !== 0);
  thpState.setPhase('pairing');
  if (thpState.isAutoconnectPaired || handshakeCompletion.message.state === 2) {
    await (0, thpCall_1.thpCall)(device, 'ThpEndRequest', {});
    thpState.setPhase('paired');
  }
};
exports.thpHandshake = thpHandshake;
//# sourceMappingURL=handshake.js.map