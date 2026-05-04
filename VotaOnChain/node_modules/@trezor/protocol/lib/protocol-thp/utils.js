"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThpPairingMethod = exports.isThpMessageName = exports.isExpectedResponse = exports.getExpectedHeaders = exports.getExpectedResponses = exports.isAckExpected = exports.readThpHeader = exports.getControlBit = exports.clearControlBit = exports.addSequenceBit = exports.addAckBit = void 0;
const constants_1 = require("./constants");
const messages_1 = require("./messages");
const addAckBit = (magic, ackBit) => {
  const result = Buffer.alloc(1);
  result.writeInt8(magic | ackBit << 3);
  return result;
};
exports.addAckBit = addAckBit;
const addSequenceBit = (magic, seqBit) => {
  const result = Buffer.alloc(1);
  result.writeInt8(magic | seqBit << 4);
  return result;
};
exports.addSequenceBit = addSequenceBit;
const clearControlBit = magic => magic & ~(1 << 3) & ~(1 << 4);
exports.clearControlBit = clearControlBit;
const getControlBit = magic => {
  const ackBit = (magic & 1 << 3) === 0 ? 0 : 1;
  const sequenceBit = (magic & 1 << 4) === 0 ? 0 : 1;
  return {
    ackBit,
    sequenceBit
  };
};
exports.getControlBit = getControlBit;
const readThpHeader = bytes => {
  const magic = bytes.readUInt8();
  const {
    ackBit,
    sequenceBit
  } = (0, exports.getControlBit)(magic);
  const channel = bytes.subarray(1, 3);
  return {
    magic: (0, exports.clearControlBit)(magic),
    ackBit,
    sequenceBit,
    channel
  };
};
exports.readThpHeader = readThpHeader;
const isAckExpected = bytesOrMagic => {
  const isCreateChannelMessage = magic => [constants_1.THP_CREATE_CHANNEL_REQUEST, constants_1.THP_CREATE_CHANNEL_RESPONSE].includes(magic);
  if (Array.isArray(bytesOrMagic)) {
    return !bytesOrMagic.find(n => isCreateChannelMessage(n));
  }
  return !isCreateChannelMessage(bytesOrMagic.readUInt8());
};
exports.isAckExpected = isAckExpected;
const getExpectedResponses = bytes => {
  const {
    magic
  } = (0, exports.readThpHeader)(bytes);
  if (magic === constants_1.THP_CREATE_CHANNEL_REQUEST) {
    return [constants_1.THP_CREATE_CHANNEL_RESPONSE];
  }
  if (magic === constants_1.THP_HANDSHAKE_INIT_REQUEST) {
    return [constants_1.THP_HANDSHAKE_INIT_RESPONSE, constants_1.THP_CONTINUATION_PACKET];
  }
  if (magic === constants_1.THP_HANDSHAKE_COMPLETION_REQUEST) {
    return [constants_1.THP_HANDSHAKE_COMPLETION_RESPONSE, constants_1.THP_CONTINUATION_PACKET];
  }
  if (magic === constants_1.THP_CONTROL_BYTE_ENCRYPTED) {
    return [constants_1.THP_CONTROL_BYTE_ENCRYPTED, constants_1.THP_CONTINUATION_PACKET];
  }
  if (magic === constants_1.THP_CONTROL_BYTE_DECRYPTED) {
    return [constants_1.THP_CONTROL_BYTE_DECRYPTED, constants_1.THP_CONTINUATION_PACKET];
  }
  return [];
};
exports.getExpectedResponses = getExpectedResponses;
const getExpectedHeaders = state => [...state.expectedResponses, constants_1.THP_ERROR_HEADER_BYTE].map(resp => {
  switch (resp) {
    case constants_1.THP_CONTINUATION_PACKET:
      return Buffer.from([resp]);
    case constants_1.THP_READ_ACK_HEADER_BYTE:
      return (0, exports.addAckBit)(resp, state.sendAckBit);
    default:
      return (0, exports.addSequenceBit)(resp, state.recvBit);
  }
}).map(magic => Buffer.concat([magic, state.channel]));
exports.getExpectedHeaders = getExpectedHeaders;
const isExpectedResponse = (bytes, state) => {
  if (bytes.length < 3) {
    return false;
  }
  const header = (0, exports.readThpHeader)(bytes);
  if (header.channel.compare(state.channel) !== 0) {
    return false;
  }
  const {
    magic
  } = header;
  if (magic === constants_1.THP_ERROR_HEADER_BYTE) {
    return true;
  }
  const {
    expectedResponses
  } = state;
  for (let i = 0; i < expectedResponses.length; i++) {
    if (magic === expectedResponses[i]) {
      if (magic !== constants_1.THP_CONTINUATION_PACKET && (header.sequenceBit !== state?.recvBit || header.ackBit !== state?.recvAckBit)) {
        console.warn('Unexpected control bit');
        return false;
      }
      return true;
    }
  }
  return false;
};
exports.isExpectedResponse = isExpectedResponse;
const isThpMessageName = name => ['ThpCreateChannelRequest', 'ThpHandshakeInitRequest', 'ThpHandshakeCompletionRequest', 'ThpReadAck'].includes(name);
exports.isThpMessageName = isThpMessageName;
const getThpPairingMethod = dm => typeof dm === 'string' ? messages_1.ThpPairingMethod[dm] : dm;
exports.getThpPairingMethod = getThpPairingMethod;
//# sourceMappingURL=utils.js.map