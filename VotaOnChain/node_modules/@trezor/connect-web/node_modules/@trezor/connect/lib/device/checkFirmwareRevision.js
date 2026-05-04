"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFirmwareRevision = void 0;
const utils_1 = require("@trezor/utils");
const calculateRevisionForDevice_1 = require("./calculateRevisionForDevice");
const firmwareInfo_1 = require("../data/firmwareInfo");
const assetUtils_1 = require("../utils/assetUtils");
const isNotFoundError = e => e instanceof assetUtils_1.HttpRequestError && e.response.status === 404;
const isNodeJSOfflineError = e => ['FetchError', 'AbortError'].includes(e.name);
const isReactNativeOfflineError = e => e.name === 'TypeError' && e.message.includes('Network request failed');
const isAbortControllerTimeout = e => e.message.includes('Aborted') || e.name === 'AbortError' || e.name === 'TimeoutError' && e.message.includes('signal timed out');
const isOfflineError = e => {
  if (!(e instanceof Error)) return false;
  return isNodeJSOfflineError(e) || isReactNativeOfflineError(e) || isAbortControllerTimeout(e);
};
const failFirmwareRevisionCheck = (error, errorPayload) => ({
  success: false,
  error,
  ...(errorPayload ? {
    errorPayload
  } : null)
});
const doRevisionsMatch = ({
  deviceRevision,
  expectedCommitRevision,
  firmwareVersion
}) => {
  if (deviceRevision === null) {
    return false;
  }
  const adjustedExpected = (0, calculateRevisionForDevice_1.calculateRevisionForDevice)({
    commitRevision: expectedCommitRevision,
    version: firmwareVersion
  });
  return adjustedExpected === deviceRevision;
};
const checkFirmwareRevision = async ({
  firmwareVersion,
  internalModel,
  deviceRevision,
  expectedRevision,
  firmwareType
}) => {
  if (expectedRevision === undefined) {
    if (!utils_1.versionUtils.isVersionArray(firmwareVersion)) {
      return failFirmwareRevisionCheck('firmware-version-unknown');
    }
    try {
      const onlineRelease = await (0, firmwareInfo_1.getOnlineReleaseByVersion)(internalModel, firmwareVersion, firmwareType);
      if (onlineRelease?.firmware_revision === undefined) {
        return failFirmwareRevisionCheck('firmware-version-unknown');
      }
      if (!doRevisionsMatch({
        deviceRevision,
        expectedCommitRevision: onlineRelease.firmware_revision,
        firmwareVersion
      })) {
        return failFirmwareRevisionCheck('revision-mismatch');
      }
      return {
        success: true
      };
    } catch (e) {
      if (isNotFoundError(e)) return failFirmwareRevisionCheck('firmware-version-unknown');
      return isOfflineError(e) ? failFirmwareRevisionCheck('cannot-perform-check-offline') : failFirmwareRevisionCheck('other-error', (0, utils_1.serializeError)(e));
    }
  }
  if (!doRevisionsMatch({
    deviceRevision,
    expectedCommitRevision: expectedRevision,
    firmwareVersion
  })) {
    return failFirmwareRevisionCheck('revision-mismatch');
  }
  return {
    success: true
  };
};
exports.checkFirmwareRevision = checkFirmwareRevision;
//# sourceMappingURL=checkFirmwareRevision.js.map