"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFirmwareHashWithRetries = void 0;
const utils_1 = require("@trezor/utils");
const constants_1 = require("../../constants");
const checkFirmwareHash_1 = require("./checkFirmwareHash");
const PROBE_CHECK_TIME_RETRIES = 4;
const probeCheckTime = async context => {
  for (let i = 0; i < PROBE_CHECK_TIME_RETRIES; i++) {
    const result = await (0, checkFirmwareHash_1.checkFirmwareHash)(context);
    if (result !== null && (result.success || result.error !== 'takes-too-long')) {
      context.device.setAuthenticityChecks(result);
      return;
    }
  }
};
const checkFirmwareHashWithRetries = async context => {
  const lastResult = context.device.getAuthenticityChecks().firmwareHash;
  const notDoneYet = lastResult === null;
  const attemptsDone = lastResult?.attemptCount ?? 0;
  if (attemptsDone >= constants_1.FIRMWARE.HASH_CHECK_MAX_ATTEMPTS) return;
  const wasError = lastResult !== null && !lastResult.success;
  const wasErrorRetriable = wasError && (0, utils_1.isArrayMember)(lastResult.error, constants_1.FIRMWARE.HASH_CHECK_RETRIABLE_ERRORS);
  const lastErrorPayload = wasError ? lastResult?.errorPayload : null;
  if (notDoneYet || wasErrorRetriable) {
    const result = await (0, checkFirmwareHash_1.checkFirmwareHash)(context);
    context.device.setAuthenticityChecks(result);
    if (result === null) return;
    result.attemptCount = attemptsDone + 1;
    if (!result.success && result.error === 'takes-too-long') {
      await probeCheckTime(context);
    }
    if (result.success && lastErrorPayload) {
      result.warningPayload = {
        lastErrorPayload
      };
    }
  }
};
exports.checkFirmwareHashWithRetries = checkFirmwareHashWithRetries;
//# sourceMappingURL=checkFirmwareHashWithRetries.js.map