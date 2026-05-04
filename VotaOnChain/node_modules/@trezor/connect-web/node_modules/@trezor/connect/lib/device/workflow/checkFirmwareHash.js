"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkFirmwareHash = void 0;
const crypto_1 = require("crypto");
const utils_1 = require("@trezor/utils");
const firmware_1 = require("../../api/firmware");
const DataManager_1 = require("../../data/DataManager");
const firmwareInfo_1 = require("../../data/firmwareInfo");
const firmwareUtils_1 = require("../../utils/firmwareUtils");
const createFailResult = (error, errorPayload) => ({
  success: false,
  error,
  errorPayload
});
const checkFirmwareHash = async ({
  device,
  logger
}) => {
  const enabled = DataManager_1.DataManager.getSettings('enableFirmwareHashCheck');
  if (!enabled) return createFailResult('check-skipped');
  const firmwareVersion = device.getVersion();
  if (firmwareVersion === undefined || !device.features || device.features.bootloader_mode) {
    return null;
  }
  const firmwareType = (0, firmwareUtils_1.getFirmwareType)(device.features);
  const release = await (0, firmwareInfo_1.getReleaseByVersion)(device.features, firmwareVersion, firmwareType);
  if (!release) return createFailResult('unknown-release');
  const firmwareLocation = (0, firmwareInfo_1.getFirmwareLocation)({
    firmwareVersion,
    remotePath: release.url,
    deviceModel: device.features.internal_model,
    firmwareType: (0, firmwareUtils_1.getFirmwareType)(device.features)
  });
  const {
    baseUrl,
    path
  } = firmwareLocation;
  const timeoutThresholdsPerModel = DataManager_1.DataManager.getSettings('firmwareHashCheckTimeouts');
  if (firmwareVersion === undefined || !device.features || device.features.bootloader_mode) {
    return null;
  }
  const checkSupported = !device.unavailableCapabilities.getFirmwareHash;
  if (!checkSupported) return createFailResult('check-unsupported');
  const firmwareBinary = await (0, firmware_1.getBinaryOptional)({
    baseUrl,
    path,
    release
  });
  if (firmwareBinary === null) {
    return createFailResult('check-unsupported');
  }
  if (firmwareBinary.binary.byteLength < 200) {
    logger.warn(`Firmware binary for hash check suspiciously small (< 200 b)`);
    return createFailResult('check-unsupported');
  }
  const strippedBinary = (0, firmware_1.stripFwHeaders)(firmwareBinary.binary);
  const {
    hash: expectedHash,
    challenge
  } = (0, firmware_1.calculateFirmwareHash)({
    internal_model: device.features.internal_model,
    firmwareVersion,
    fw: strippedBinary,
    key: (0, crypto_1.randomBytes)(32)
  });
  try {
    const ts = performance.now();
    const deviceResponse = await device.getCurrentSession().typedCall('GetFirmwareHash', 'FirmwareHash', {
      challenge
    });
    if (!deviceResponse?.message?.hash) {
      return createFailResult('other-error', 'Device response is missing hash');
    }
    if (deviceResponse.message.hash !== expectedHash) {
      return createFailResult('hash-mismatch');
    }
    const duration = performance.now() - ts;
    logger.debug('GetFirmwareHash time', duration);
    const timeoutThreshold = timeoutThresholdsPerModel?.[device.features.internal_model];
    if (timeoutThreshold !== undefined && duration > timeoutThreshold) {
      return createFailResult('takes-too-long');
    }
    return {
      success: true
    };
  } catch (errorPayload) {
    return createFailResult('other-error', (0, utils_1.serializeError)(errorPayload));
  }
};
exports.checkFirmwareHash = checkFirmwareHash;
//# sourceMappingURL=checkFirmwareHash.js.map