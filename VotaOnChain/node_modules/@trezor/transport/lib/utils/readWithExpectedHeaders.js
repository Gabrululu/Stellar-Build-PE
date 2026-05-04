"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readWithExpectedHeaders = readWithExpectedHeaders;
const protocol_1 = require("@trezor/protocol");
const utils_1 = require("@trezor/utils");
const result_1 = require("./result");
const ATTEMPT_ERROR = 'Unexpected chunk';
async function readAndAssert(receiver, thpState, {
  signal,
  logger
} = {}) {
  logger?.debug('readAndAssert start');
  const chunk = await receiver(signal);
  if (!chunk.success) {
    return chunk;
  }
  const expectedHeaders = thpState ? protocol_1.thp.getExpectedHeaders(thpState) : [];
  if (expectedHeaders.length === 0) {
    logger?.debug('readAndAssert skip');
    return chunk;
  }
  const bytes = chunk.payload;
  const expected = expectedHeaders.find(header => header.length <= bytes.length && bytes.subarray(0, header.length).compare(header) === 0);
  if (expected) {
    logger?.debug('readAndAssert done');
    return (0, result_1.success)(chunk.payload);
  }
  logger?.warn(`readAndAssert unexpected header`);
  throw new Error(ATTEMPT_ERROR);
}
function readWithExpectedHeaders(receiver, options = {}) {
  return (thpState, signal) => (0, utils_1.scheduleAction)(attemptSignal => readAndAssert(receiver, thpState, {
    ...options,
    signal: attemptSignal
  }), {
    signal: signal ?? options?.signal,
    graceful: options?.graceful,
    attempts: options?.attempts || Infinity,
    timeout: options?.timeout,
    attemptFailureHandler: error => {
      if (error.message !== ATTEMPT_ERROR) {
        options.logger?.debug(`readAndAssert attempt error ${error.message}`);
        return error;
      }
    }
  });
}
//# sourceMappingURL=readWithExpectedHeaders.js.map