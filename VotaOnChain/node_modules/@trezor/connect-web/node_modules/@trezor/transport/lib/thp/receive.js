"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseThpMessage = exports.receiveThpMessage = void 0;
const protobuf_1 = require("@trezor/protobuf");
const protocol_1 = require("@trezor/protocol");
const readWithExpectedHeaders_1 = require("../utils/readWithExpectedHeaders");
const receive_1 = require("../utils/receive");
const result_1 = require("../utils/result");
const receiveThpMessage = async ({
  thpState,
  skipAck,
  apiRead,
  apiWrite,
  signal,
  graceful,
  logger
}) => {
  if (!thpState) {
    return (0, result_1.error)({
      error: 'ThpStateMissing'
    });
  }
  logger?.debug(`receiveThpMessage start ${thpState.expectedResponses}`);
  try {
    const apiReadWithExpectedHeaders = (0, readWithExpectedHeaders_1.readWithExpectedHeaders)(apiRead, {
      signal,
      graceful,
      logger
    });
    const message = await (0, receive_1.receive)(() => apiReadWithExpectedHeaders(thpState), protocol_1.v2);
    if (!message.success) {
      return message;
    }
    const isAckExpected = protocol_1.thp.isAckExpected(thpState.expectedResponses || []);
    if (!skipAck && isAckExpected) {
      const chunk = protocol_1.thp.encodeAck(thpState);
      logger?.debug(`receiveThpMessage send ThpAck`);
      const ackResult = await apiWrite(chunk, signal);
      if (!ackResult.success) {
        return ackResult;
      }
    }
    logger?.debug(`receiveThpMessage done`);
    return message;
  } catch (err) {
    logger?.error(`receiveThpMessage error ${err.message}`);
    return (0, result_1.error)({
      error: err.code,
      message: err.message
    });
  }
};
exports.receiveThpMessage = receiveThpMessage;
const parseThpMessage = ({
  decoded,
  messages,
  thpState
}) => {
  const message = protocol_1.thp.decode(decoded, (messageType, data) => (0, protobuf_1.decodeMessage)(messages, messageType, data), thpState);
  return message;
};
exports.parseThpMessage = parseThpMessage;
//# sourceMappingURL=receive.js.map