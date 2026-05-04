"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tryLocalAssetRequire = exports.firmwareReleaseConfigAssets = exports.getReleaseAsset = exports.getReleasesAssetByDeviceModelAndFirmwareType = exports.HttpRequestError = void 0;
const connect_common_1 = require("@trezor/connect-common");
const device_utils_1 = require("@trezor/device-utils");
const utils_1 = require("@trezor/utils");
class HttpRequestError extends Error {
  response;
  constructor(response) {
    const message = `${response.status} while fetching ${response.url}`;
    super(message);
    this.response = response;
  }
}
exports.HttpRequestError = HttpRequestError;
const getReleasesAssetByDeviceModelAndFirmwareType = (deviceModel, firmwareType) => {
  const firmwareTypeInFileName = firmwareType === device_utils_1.FirmwareType.BitcoinOnly ? 'bitcoinonly' : 'universal';
  const availableReleasesRecord = connect_common_1.firmwareAssets?.[deviceModel.toLowerCase()]?.[firmwareTypeInFileName] ?? {};
  return Object.values(availableReleasesRecord).sort((a, b) => utils_1.versionUtils.isNewer(b.version, a.version) ? 1 : -1);
};
exports.getReleasesAssetByDeviceModelAndFirmwareType = getReleasesAssetByDeviceModelAndFirmwareType;
const getReleaseAsset = (deviceModel, version, firmwareType) => {
  const firmwareTypeInFileName = firmwareType === device_utils_1.FirmwareType.BitcoinOnly ? 'bitcoinonly' : 'universal';
  const fileName = `${deviceModel.toLowerCase()}-${version.join('.')}-${firmwareTypeInFileName}`;
  const deviceModelLower = deviceModel.toLowerCase();
  const asset = connect_common_1.firmwareAssets?.[deviceModelLower]?.[firmwareTypeInFileName]?.[fileName];
  return asset;
};
exports.getReleaseAsset = getReleaseAsset;
exports.firmwareReleaseConfigAssets = require('@trezor/connect-common/files/firmware/release/releases.v1.json');
const tryLocalAssetRequire = url => {
  const fileUrl = url.split('?')[0];
  switch (fileUrl) {
    case './data/coins.json':
      return require('@trezor/connect-common/files/coins.json');
    case './data/coins-eth.json':
      return require('@trezor/connect-common/files/coins-eth.json');
    case './data/messages/messages.json':
      return require('@trezor/protobuf/messages.json');
  }
  return null;
};
exports.tryLocalAssetRequire = tryLocalAssetRequire;
//# sourceMappingURL=assetUtils.js.map