"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateNfcTag = exports.validateQrCodeTag = exports.validateCodeEntryTag = exports.getSharedSecret = exports.getCpaceHostKeys = exports.handleHandshakeInit = exports.getTrezorState = exports.findKnownPairingCredentials = exports.getHandshakeHash = void 0;
const crypto_1 = require("crypto");
const aesgcm_1 = require("./aesgcm");
const curve25519_1 = require("./curve25519");
const tools_1 = require("./tools");
const messages_1 = require("../messages");
const getProtocolName = () => Buffer.concat([Buffer.from('Noise_XX_25519_AESGCM_SHA256'), Buffer.alloc(4).fill(0)]);
const getHandshakeHash = deviceProperties => (0, tools_1.hashOfTwo)(getProtocolName(), deviceProperties);
exports.getHandshakeHash = getHandshakeHash;
const findKnownPairingCredentials = (knownCredentials, trezorMaskedStaticPubkey, trezorEphemeralPubkey) => knownCredentials.filter(c => {
  try {
    const trezorStaticPubkey = Buffer.from(c.trezor_static_public_key, 'hex');
    const h = (0, tools_1.hashOfTwo)(trezorStaticPubkey, trezorEphemeralPubkey);
    return trezorMaskedStaticPubkey.compare((0, curve25519_1.curve25519)(h, trezorStaticPubkey)) === 0;
  } catch {}
});
exports.findKnownPairingCredentials = findKnownPairingCredentials;
const getTrezorState = (credentials, payload) => {
  const aes = (0, aesgcm_1.aesgcm)(credentials.trezorKey, Buffer.alloc(12));
  aes.auth(Buffer.alloc(0));
  const trezorState = aes.decrypt(payload.subarray(0, 1), payload.subarray(1, 17));
  return trezorState.readUint8();
};
exports.getTrezorState = getTrezorState;
const handleHandshakeInit = ({
  handshakeInitResponse,
  thpState,
  knownCredentials,
  hostStaticKeys,
  hostEphemeralKeys,
  tryToUnlock,
  protobufEncoder
}) => {
  if (!thpState.handshakeCredentials) {
    throw new Error('ThpStateMissing');
  }
  const {
    trezorEphemeralPubkey,
    trezorEncryptedStaticPubkey,
    tag
  } = handshakeInitResponse;
  const {
    sendNonce,
    recvNonce
  } = thpState;
  const {
    handshakeHash
  } = thpState.handshakeCredentials;
  const iv0 = (0, tools_1.getIvFromNonce)(sendNonce);
  const iv1 = (0, tools_1.getIvFromNonce)(recvNonce);
  let h, point, aes;
  h = handshakeHash;
  h = (0, tools_1.hashOfTwo)(h, hostEphemeralKeys.publicKey);
  h = (0, tools_1.hashOfTwo)(h, Buffer.from([tryToUnlock]));
  h = (0, tools_1.hashOfTwo)(h, trezorEphemeralPubkey);
  point = (0, curve25519_1.curve25519)(hostEphemeralKeys.privateKey, trezorEphemeralPubkey);
  let [ck, k] = (0, tools_1.hkdf)(getProtocolName(), point);
  aes = (0, aesgcm_1.aesgcm)(k, iv0);
  aes.auth(h);
  const trezorStaticPubkey = trezorEncryptedStaticPubkey.subarray(0, 32);
  const trezorStaticPubkeyTag = trezorEncryptedStaticPubkey.subarray(32, 32 + 16);
  const trezorMaskedStaticPubkey = aes.decrypt(trezorStaticPubkey, trezorStaticPubkeyTag);
  h = (0, tools_1.hashOfTwo)(h, trezorEncryptedStaticPubkey);
  point = (0, curve25519_1.curve25519)(hostEphemeralKeys.privateKey, trezorMaskedStaticPubkey);
  [ck, k] = (0, tools_1.hkdf)(ck, point);
  aes = (0, aesgcm_1.aesgcm)(k, iv0);
  aes.auth(h);
  aes.decrypt(Buffer.alloc(0), tag);
  h = (0, tools_1.hashOfTwo)(h, tag);
  const allCredentials = (0, exports.findKnownPairingCredentials)(knownCredentials, trezorMaskedStaticPubkey, trezorEphemeralPubkey);
  const credentials = allCredentials.length ? allCredentials[0] : undefined;
  aes = (0, aesgcm_1.aesgcm)(k, iv1);
  aes.auth(h);
  const hostEncryptedStaticPubkey = Buffer.concat([aes.encrypt(hostStaticKeys.publicKey), aes.finish()]);
  h = (0, tools_1.hashOfTwo)(h, hostEncryptedStaticPubkey);
  point = (0, curve25519_1.curve25519)(hostStaticKeys.privateKey, trezorEphemeralPubkey);
  [ck, k] = (0, tools_1.hkdf)(ck, point);
  const {
    message
  } = protobufEncoder('ThpHandshakeCompletionReqNoisePayload', {
    host_pairing_credential: credentials?.credential
  });
  aes = (0, aesgcm_1.aesgcm)(k, iv0);
  aes.auth(h);
  const encryptedPayload = Buffer.concat([aes.encrypt(message), aes.finish()]);
  h = (0, tools_1.hashOfTwo)(h, encryptedPayload);
  const [hostKey, trezorKey] = (0, tools_1.hkdf)(ck, Buffer.alloc(0));
  return {
    trezorMaskedStaticPubkey,
    trezorEncryptedStaticPubkey,
    hostEncryptedStaticPubkey,
    hostKey,
    trezorKey,
    handshakeHash: h,
    credentials,
    allCredentials,
    encryptedPayload
  };
};
exports.handleHandshakeInit = handleHandshakeInit;
const getCpaceHostKeys = (code, handshakeHash) => {
  const shaCtx = (0, crypto_1.createHash)('sha512');
  shaCtx.update(Buffer.from([0x08, 0x43, 0x50, 0x61, 0x63, 0x65, 0x32, 0x35, 0x35, 0x06]));
  shaCtx.update(code);
  shaCtx.update(Buffer.concat([Buffer.from([0x6f]), Buffer.alloc(111).fill(0), Buffer.from([0x20])]));
  shaCtx.update(handshakeHash);
  shaCtx.update(Buffer.from([0x00]));
  const sha = shaCtx.digest().subarray(0, 32);
  const generator = (0, curve25519_1.elligator2)(sha);
  const privateKey = (0, crypto_1.randomBytes)(32);
  const publicKey = (0, curve25519_1.curve25519)(privateKey, generator);
  return {
    privateKey,
    publicKey
  };
};
exports.getCpaceHostKeys = getCpaceHostKeys;
const getSharedSecret = (publicKey, privateKey) => {
  const sharedSecret = (0, curve25519_1.curve25519)(privateKey, publicKey);
  return (0, tools_1.sha256)(Buffer.from(sharedSecret));
};
exports.getSharedSecret = getSharedSecret;
const validateCodeEntryTag = (credentials, value, secret) => {
  const sha = (0, crypto_1.createHash)('sha256').update(Buffer.from(secret, 'hex')).digest();
  const {
    handshakeHash,
    handshakeCommitment,
    codeEntryChallenge
  } = credentials;
  if (sha.compare(handshakeCommitment) !== 0) {
    throw new Error(`HP5: commitment mismatch ${handshakeCommitment.toString('hex')} != ${sha.toString('hex')}`);
  }
  const shaCtx = (0, crypto_1.createHash)('sha256');
  shaCtx.update(Buffer.from([messages_1.ThpPairingMethod.CodeEntry]));
  shaCtx.update(handshakeHash);
  shaCtx.update(Buffer.from(secret, 'hex'));
  shaCtx.update(codeEntryChallenge);
  const calculatedValue = (0, tools_1.bigEndianBytesToBigInt)(shaCtx.digest()) % 1000000n;
  if (calculatedValue !== BigInt(value)) {
    throw new Error(`HP5: code mismatch ${value} != ${calculatedValue.toString()}`);
  }
};
exports.validateCodeEntryTag = validateCodeEntryTag;
const validateQrCodeTag = ({
  handshakeHash
}, value, secret) => {
  const shaCtx = (0, crypto_1.createHash)('sha256');
  shaCtx.update(Buffer.from([messages_1.ThpPairingMethod.QrCode]));
  shaCtx.update(handshakeHash);
  shaCtx.update(Buffer.from(secret, 'hex'));
  const calculatedValue = shaCtx.digest().subarray(0, 16);
  const expectedValue = Buffer.from(value, 'hex').subarray(0, 16);
  if (calculatedValue.compare(expectedValue) !== 0) {
    throw new Error(`HP6: code mismatch ${calculatedValue.toString('hex')} != ${expectedValue.toString('hex')}`);
  }
};
exports.validateQrCodeTag = validateQrCodeTag;
const validateNfcTag = ({
  handshakeHash
}, value, secret) => {
  const shaCtx = (0, crypto_1.createHash)('sha256');
  shaCtx.update(Buffer.from([messages_1.ThpPairingMethod.NFC]));
  shaCtx.update(handshakeHash);
  shaCtx.update(secret);
  const calculatedValue = shaCtx.digest().subarray(0, 16);
  const expectedValue = Buffer.from(value, 'hex').subarray(0, 16);
  if (calculatedValue.compare(expectedValue) !== 0) {
    throw new Error(`HP7: code mismatch ${calculatedValue.toString('hex')} != ${expectedValue.toString('hex')}`);
  }
};
exports.validateNfcTag = validateNfcTag;
//# sourceMappingURL=pairing.js.map