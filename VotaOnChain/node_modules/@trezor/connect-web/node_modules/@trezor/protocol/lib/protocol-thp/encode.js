"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.encode = exports.encodeAck = exports.encodeProtobufMessage = exports.encodePayload = void 0;
const constants_1 = require("./constants");
const crypto_1 = require("./crypto");
const tools_1 = require("./crypto/tools");
const utils_1 = require("./utils");
const cipherMessage = (key, sendNonce, handshakeHash, payload) => {
  const aes = (0, crypto_1.aesgcm)(key, (0, tools_1.getIvFromNonce)(sendNonce));
  aes.auth(handshakeHash);
  const encryptedPayload = aes.encrypt(payload);
  const encryptedPayloadTag = aes.finish();
  return Buffer.concat([encryptedPayload, encryptedPayloadTag]);
};
const getBytesFromField = (data, fieldName) => {
  const value = data[fieldName];
  if (typeof value === 'string') {
    return Buffer.from(value, 'hex');
  }
  if (typeof value === 'number') {
    return Buffer.from([value]);
  }
  if (Buffer.isBuffer(value)) {
    return value;
  }
};
const createChannelRequestPayload = data => {
  const nonce = getBytesFromField(data, 'nonce');
  if (!nonce) {
    throw new Error('Missing nonce field');
  }
  return nonce;
};
const handshakeInitRequestPayload = (data, _thpState) => {
  const key = getBytesFromField(data, 'key');
  if (!key) {
    throw new Error('ThpHandshakeInitRequest missing key field');
  }
  const tryToUnlock = getBytesFromField(data, 'tryToUnlock') ?? Buffer.from([0]);
  return Buffer.concat([key, tryToUnlock]);
};
const handshakeCompletionRequestPayload = data => {
  const hostPubkey = getBytesFromField(data, 'hostPubkey');
  if (!hostPubkey) {
    throw new Error('ThpHandshakeCompletionRequest missing hostPubkey field');
  }
  const encryptedPayload = getBytesFromField(data, 'encryptedPayload');
  if (!encryptedPayload) {
    throw new Error('ThpHandshakeCompletionRequest missing encryptedPayload field');
  }
  return Buffer.concat([hostPubkey, encryptedPayload]);
};
const encodePayload = (name, data, thpState) => {
  if (name === 'ThpCreateChannelRequest') {
    return createChannelRequestPayload(data);
  }
  if (name === 'ThpHandshakeInitRequest') {
    return handshakeInitRequestPayload(data, thpState);
  }
  if (name === 'ThpHandshakeCompletionRequest') {
    return handshakeCompletionRequestPayload(data);
  }
  return Buffer.alloc(0);
};
exports.encodePayload = encodePayload;
const createChannelRequest = (data, channel) => {
  const length = Buffer.alloc(2);
  length.writeUInt16BE(data.length + constants_1.CRC_LENGTH);
  const magic = Buffer.from([constants_1.THP_CREATE_CHANNEL_REQUEST]);
  const message = Buffer.concat([magic, channel, length, data]);
  const crc = (0, crypto_1.crc32)(message);
  return Buffer.concat([message, crc]);
};
const handshakeInitRequest = (data, channel) => {
  const length = Buffer.alloc(2);
  length.writeUInt16BE(data.length + constants_1.CRC_LENGTH);
  const magic = Buffer.from([constants_1.THP_HANDSHAKE_INIT_REQUEST]);
  const message = Buffer.concat([magic, channel, length, data]);
  const crc = (0, crypto_1.crc32)(message);
  return Buffer.concat([message, crc]);
};
const handshakeCompletionRequest = (data, channel, sendBit) => {
  const length = Buffer.alloc(2);
  length.writeUInt16BE(data.length + constants_1.CRC_LENGTH);
  const magic = (0, utils_1.addSequenceBit)(constants_1.THP_HANDSHAKE_COMPLETION_REQUEST, sendBit);
  const message = Buffer.concat([magic, channel, length, data]);
  const crc = (0, crypto_1.crc32)(message);
  return Buffer.concat([message, crc]);
};
const encodeThpMessage = (messageType, data, channel, thpState) => {
  if (messageType === 'ThpCreateChannelRequest') {
    return createChannelRequest(data, channel);
  }
  if (messageType === 'ThpHandshakeInitRequest') {
    return handshakeInitRequest(data, channel);
  }
  if (messageType === 'ThpHandshakeCompletionRequest') {
    return handshakeCompletionRequest(data, channel, thpState.sendBit || 0);
  }
  throw new Error(`Unknown Thp message type ${messageType}`);
};
const encodeProtobufMessage = (messageType, data, channel, thpState) => {
  if (!thpState) {
    throw new Error('ThpStateMissing');
  }
  const length = Buffer.alloc(2);
  length.writeUInt16BE(1 + 2 + data.length + constants_1.TAG_LENGTH + constants_1.CRC_LENGTH);
  const magic = (0, utils_1.addSequenceBit)(constants_1.THP_CONTROL_BYTE_ENCRYPTED, thpState.sendBit);
  const header = Buffer.concat([magic, channel]);
  const messageTypeBytes = Buffer.alloc(2);
  messageTypeBytes.writeUInt16BE(messageType);
  const cipheredMessage = cipherMessage(thpState.handshakeCredentials.hostKey, thpState.sendNonce, Buffer.alloc(0), Buffer.concat([thpState.sessionId, messageTypeBytes, data]));
  const message = Buffer.concat([header, length, cipheredMessage]);
  const crc = (0, crypto_1.crc32)(message);
  return Buffer.concat([message, crc]);
};
exports.encodeProtobufMessage = encodeProtobufMessage;
const encodeAck = state => {
  const length = Buffer.alloc(2);
  length.writeUInt16BE(constants_1.CRC_LENGTH);
  const magic = (0, utils_1.addAckBit)(constants_1.THP_READ_ACK_HEADER_BYTE, state.recvAckBit);
  const message = Buffer.concat([magic, state.channel, length]);
  const crc = (0, crypto_1.crc32)(message);
  return Buffer.concat([message, crc]);
};
exports.encodeAck = encodeAck;
const encode = options => {
  if (!options.thpState) {
    throw new Error('ThpStateMissing');
  }
  const channel = options.thpState.channel || constants_1.THP_DEFAULT_CHANNEL;
  const {
    messageName,
    data,
    protobufEncoder,
    thpState
  } = options;
  let result;
  if ((0, utils_1.isThpMessageName)(messageName)) {
    const payload = (0, exports.encodePayload)(messageName, data, thpState);
    result = encodeThpMessage(messageName, payload, channel, options.thpState);
  } else {
    const {
      messageType,
      message
    } = protobufEncoder(messageName, data);
    result = (0, exports.encodeProtobufMessage)(messageType, message, channel, thpState);
  }
  return result;
};
exports.encode = encode;
//# sourceMappingURL=encode.js.map