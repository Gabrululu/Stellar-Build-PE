"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = exports.decodeSendAck = void 0;
const constants_1 = require("./constants");
const crypto_1 = require("./crypto");
const crc32_1 = require("./crypto/crc32");
const pairing_1 = require("./crypto/pairing");
const tools_1 = require("./crypto/tools");
const utils_1 = require("./utils");
const decipherMessage = (key, recvNonce, payload, tag) => {
  const aes = (0, crypto_1.aesgcm)(key, (0, tools_1.getIvFromNonce)(recvNonce));
  aes.auth(Buffer.alloc(0));
  const trezorMaskedStaticPubkey = aes.decrypt(payload, tag);
  return trezorMaskedStaticPubkey.subarray(1);
};
const createChannelResponse = ({
  payload
}, protobufDecoder) => {
  const nonce = payload.subarray(0, 8);
  const channel = payload.subarray(8, 10);
  const props = payload.subarray(10, payload.length - constants_1.CRC_LENGTH);
  const properties = protobufDecoder('ThpDeviceProperties', props).message;
  const handshakeHash = (0, pairing_1.getHandshakeHash)(props);
  return {
    type: 'ThpCreateChannelResponse',
    message: {
      nonce,
      channel,
      properties,
      handshakeHash
    }
  };
};
const readHandshakeInitResponse = ({
  payload
}) => {
  const trezorEphemeralPubkey = payload.subarray(0, 32);
  const trezorEncryptedStaticPubkey = payload.subarray(32, 32 + 48);
  const tag = payload.subarray(32 + 48, 32 + 48 + constants_1.TAG_LENGTH);
  return {
    type: 'ThpHandshakeInitResponse',
    message: {
      trezorEphemeralPubkey,
      trezorEncryptedStaticPubkey,
      tag
    }
  };
};
const readHandshakeCompletionResponse = ({
  payload,
  thpState
}) => {
  const state = (0, pairing_1.getTrezorState)(thpState.handshakeCredentials, payload);
  return {
    type: 'ThpHandshakeCompletionResponse',
    message: {
      state
    }
  };
};
const readProtobufMessage = ({
  payload,
  thpState
}, protobufDecoder) => {
  const tagPos = payload.length - constants_1.TAG_LENGTH - constants_1.CRC_LENGTH;
  const cipheredMessage = payload.subarray(0, tagPos);
  const tag = payload.subarray(tagPos, payload.length - constants_1.CRC_LENGTH);
  const decipheredMessage = decipherMessage(thpState.handshakeCredentials.trezorKey, thpState.recvNonce, cipheredMessage, tag);
  const messageType = decipheredMessage.readUInt16BE(0);
  const messagePayload = decipheredMessage.subarray(2);
  return protobufDecoder(messageType, messagePayload);
};
const decodeReadAck = () => ({
  type: 'ThpAck',
  message: {}
});
const decodeThpError = payload => {
  const [errorType] = payload;
  const error = (() => {
    switch (errorType) {
      case 0x01:
        return 'ThpTransportBusy';
      case 0x02:
        return 'ThpUnallocatedChannel';
      case 0x03:
        return 'ThpDecryptionFailed';
      case 0x05:
        return 'ThpDeviceLocked';
      default:
        return 'ThpUnknownError';
    }
  })();
  const message = {
    code: error,
    message: error ?? `Unknown ThpError ${errorType}`
  };
  return {
    type: 'ThpError',
    message
  };
};
const validateCrc = decodedMessage => {
  const payloadLen = decodedMessage.length - constants_1.CRC_LENGTH;
  const length = Buffer.alloc(2);
  length.writeUInt16BE(decodedMessage.length);
  const expectedCrc = (0, crc32_1.crc32)(Buffer.concat([decodedMessage.header, length, decodedMessage.payload.subarray(0, payloadLen)]));
  const crc = decodedMessage.payload.subarray(payloadLen, decodedMessage.length);
  if (expectedCrc.compare(crc) !== 0) {
    throw new Error(`Invalid CRC. expected: ${expectedCrc.toString('hex')} received: ${crc.toString('hex')}`);
  }
};
const decodeSendAck = decodedMessage => {
  validateCrc(decodedMessage);
  const {
    magic
  } = (0, utils_1.readThpHeader)(decodedMessage.header);
  if (magic === constants_1.THP_ERROR_HEADER_BYTE) {
    return decodeThpError(decodedMessage.payload);
  }
  if (magic === constants_1.THP_READ_ACK_HEADER_BYTE) {
    return decodeReadAck();
  }
};
exports.decodeSendAck = decodeSendAck;
const decode = (decodedMessage, protobufDecoder, thpState) => {
  if (!thpState) {
    throw new Error('ThpStateMissing');
  }
  validateCrc(decodedMessage);
  const header = (0, utils_1.readThpHeader)(decodedMessage.header);
  const message = {
    ...decodedMessage,
    ...header,
    thpState
  };
  const {
    magic
  } = header;
  if (magic === constants_1.THP_ERROR_HEADER_BYTE) {
    return decodeThpError(message.payload);
  }
  if (magic === constants_1.THP_READ_ACK_HEADER_BYTE) {
    return decodeReadAck();
  }
  if (magic === constants_1.THP_CREATE_CHANNEL_RESPONSE) {
    return createChannelResponse(message, protobufDecoder);
  }
  if (magic === constants_1.THP_HANDSHAKE_INIT_RESPONSE) {
    return readHandshakeInitResponse(message);
  }
  if (magic === constants_1.THP_HANDSHAKE_COMPLETION_RESPONSE) {
    return readHandshakeCompletionResponse(message);
  }
  if (magic === constants_1.THP_CONTROL_BYTE_ENCRYPTED) {
    return readProtobufMessage(message, protobufDecoder);
  }
  if (magic === constants_1.THP_CONTROL_BYTE_DECRYPTED) {
    return readProtobufMessage(message, protobufDecoder);
  }
  throw new Error('Unknown message type: ' + magic);
};
exports.decode = decode;
//# sourceMappingURL=decode.js.map