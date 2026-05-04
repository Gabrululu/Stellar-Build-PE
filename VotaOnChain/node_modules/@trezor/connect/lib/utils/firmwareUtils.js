"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isFirmwareCacheUsedForSelectedSource = exports.getFirmwareType = exports.getFirmwareMode = exports.buildIntermediaryFirmwareFileName = exports.buildLocalFirmwareFileName = exports.buildLocalReleaseName = exports.findBestCompatibleRelease = exports.isStrictFeatures = void 0;
const device_utils_1 = require("@trezor/device-utils");
const utils_1 = require("@trezor/utils");
const DataManager_1 = require("../data/DataManager");
const isStrictFeatures = extFeatures => [1, 2].includes(extFeatures.major_version) && (extFeatures.firmware_present === false || extFeatures.bootloader_mode == null || extFeatures.bootloader_mode === true);
exports.isStrictFeatures = isStrictFeatures;
const findBestCompatibleRelease = (availableFirmwares, currentVesion, checkProperty) => {
  if (!availableFirmwares || availableFirmwares.length === 0) {
    return;
  }
  const currentFirmwareVersion = currentVesion.firmwareVersion;
  const currentBootloaderVersion = currentVesion.bootloaderVersion;
  let versionToCompare = currentFirmwareVersion;
  if (checkProperty === 'min_bootloader_version' && currentBootloaderVersion) {
    versionToCompare = currentBootloaderVersion;
  } else if (checkProperty === 'min_bootloader_version' && currentFirmwareVersion) {
    const currentRelease = availableFirmwares.find(fw => utils_1.versionUtils.isEqual(currentFirmwareVersion, fw.version));
    if (!currentRelease?.bootloader_version) {
      return;
    }
  }
  if (!versionToCompare) {
    return;
  }
  const sortedFirmwares = availableFirmwares.sort((a, b) => utils_1.versionUtils.isNewer(b.version, a.version) ? 1 : -1);
  const compatibleFirmware = sortedFirmwares.find(fw => utils_1.versionUtils.isNewerOrEqual(versionToCompare, fw[checkProperty]));
  return compatibleFirmware;
};
exports.findBestCompatibleRelease = findBestCompatibleRelease;
const buildLocalFileBaseName = (firmwareType, deviceModel, version) => {
  const firmwareSuffix = firmwareType === device_utils_1.FirmwareType.BitcoinOnly ? '-bitcoinonly' : '';
  const model = deviceModel.toLowerCase();
  const versionString = version.join('.');
  return `trezor-${model}-${versionString}${firmwareSuffix}`;
};
const buildLocalReleaseName = (firmwareType, deviceModel, version) => `${buildLocalFileBaseName(firmwareType, deviceModel, version)}.json`;
exports.buildLocalReleaseName = buildLocalReleaseName;
const buildLocalFirmwareFileName = (firmwareType, deviceModel, version) => `${buildLocalFileBaseName(firmwareType, deviceModel, version)}.bin`;
exports.buildLocalFirmwareFileName = buildLocalFirmwareFileName;
const buildIntermediaryFirmwareFileName = (internalModel, version) => `trezor-${internalModel.toLowerCase()}-inter-v${version}.bin`;
exports.buildIntermediaryFirmwareFileName = buildIntermediaryFirmwareFileName;
const getFirmwareMode = features => {
  if (features.bootloader_mode) return 'bootloader';
  if (!features.initialized) return 'initialize';
  if (features.no_backup) return 'seedless';
  return 'normal';
};
exports.getFirmwareMode = getFirmwareMode;
const getFirmwareType = features => {
  let type = device_utils_1.FirmwareType.Universal;
  if (features.fw_vendor === 'Trezor Bitcoin-only') {
    type = device_utils_1.FirmwareType.BitcoinOnly;
  } else if (features.fw_vendor === 'Trezor') {
    type = device_utils_1.FirmwareType.Universal;
  } else if ((0, exports.getFirmwareMode)(features) !== 'bootloader') {
    type = features.capabilities && features.capabilities.length > 0 && !features.capabilities.includes('Capability_Bitcoin_like') ? device_utils_1.FirmwareType.BitcoinOnly : device_utils_1.FirmwareType.Universal;
  } else if ((0, exports.getFirmwareMode)(features) === 'bootloader' && features.unit_btconly) {
    type = device_utils_1.FirmwareType.BitcoinOnly;
  }
  return type;
};
exports.getFirmwareType = getFirmwareType;
const isFirmwareCacheUsedForSelectedSource = () => DataManager_1.DataManager.getSettings('firmwareUpdateSource') === 'production';
exports.isFirmwareCacheUsedForSelectedSource = isFirmwareCacheUsedForSelectedSource;
//# sourceMappingURL=firmwareUtils.js.map