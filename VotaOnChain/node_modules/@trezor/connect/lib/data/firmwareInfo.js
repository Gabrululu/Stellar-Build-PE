"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getFirmwareLocation = exports.getFirmwareStatus = exports.getFirmwareReleaseConfigInfo = exports.getReleaseInfo = exports.getCurrentVersion = exports.getLanguage = exports.initializeFirmwareConfig = exports.createRemoteFirmwareConfig = exports.createLocalFirmwareConfig = exports.getReleaseByVersion = exports.getReleaseConfig = exports.getOnlineReleaseByVersion = exports.getBundledRelease = exports.getOnlineFirmwareBaseUrl = void 0;
const device_utils_1 = require("@trezor/device-utils");
const utils_1 = require("@trezor/utils");
const DataManager_1 = require("./DataManager");
const assetUtils_1 = require("../utils/assetUtils");
const assets_1 = require("../utils/assets");
const firmwareUtils_1 = require("../utils/firmwareUtils");
const RELEASES_URL_REMOTE_BASE = {
  BASE_URL: 'https://data.trezor.io',
  MIDDLE_PATH: 'firmware'
};
const UNSIGNED_URL_REMOTE_BASE = {
  BASE_URL: 'https://data.trezor.io',
  MIDDLE_PATH: 'dev/firmware/releases/unsigned'
};
const UNSIGNED_STABLE_URL_REMOTE_BASE = {
  BASE_URL: 'https://data.trezor.io',
  MIDDLE_PATH: 'dev/firmware/releases/unsigned-stable'
};
const SIGNED_URL_REMOTE_BASE = {
  BASE_URL: 'https://suite.corp.sldev.cz',
  MIDDLE_PATH: 'firmware/signed'
};
const SIGNED_LOCALHOST = {
  BASE_URL: 'http://localhost:3000',
  MIDDLE_PATH: 'firmware/signed'
};
const UNSIGNED_LOCALHOST = {
  BASE_URL: 'http://localhost:3000',
  MIDDLE_PATH: 'firmware/unsigned'
};
const FIRMWARE_REMOTE_BASE_URLS = {
  production: RELEASES_URL_REMOTE_BASE,
  'test-unsigned': UNSIGNED_URL_REMOTE_BASE,
  'test-unsigned-stable': UNSIGNED_STABLE_URL_REMOTE_BASE,
  'test-signed': SIGNED_URL_REMOTE_BASE,
  'localhost-unsigned': UNSIGNED_LOCALHOST,
  'localhost-signed': SIGNED_LOCALHOST
};
const getOnlineFirmwareBaseUrl = () => {
  const firmwareUpdateSource = DataManager_1.DataManager.getSettings('firmwareUpdateSource');
  if (!firmwareUpdateSource) {
    return {
      ...FIRMWARE_REMOTE_BASE_URLS['production'],
      env: 'production'
    };
  }
  return {
    ...FIRMWARE_REMOTE_BASE_URLS[firmwareUpdateSource],
    env: firmwareUpdateSource
  };
};
exports.getOnlineFirmwareBaseUrl = getOnlineFirmwareBaseUrl;
const getBundledFirmwareVersion = (deviceModel, firmwareType) => {
  const localFirmwareReleaseConfig = DataManager_1.DataManager.getLocalFirmwareReleaseConfig();
  const modelReleases = localFirmwareReleaseConfig.releases[deviceModel];
  const bundledRelease = modelReleases?.[firmwareType];
  if (!bundledRelease) {
    return;
  }
  const bundledVersion = bundledRelease.releasePath.match(/(\d+\.\d+\.\d+)/);
  if (!bundledVersion) {
    throw new Error('Fimrware bundled version was not found.');
  }
  return bundledVersion[0];
};
const getBundledRelease = (deviceModel, firmwareType) => {
  const version = getBundledFirmwareVersion(deviceModel, firmwareType);
  if (!version) {
    return;
  }
  const versionArray = utils_1.versionUtils.tryParse(version);
  if (!versionArray) {
    throw new Error('There was error parsing bundled release.');
  }
  return (0, assetUtils_1.getReleaseAsset)(deviceModel, versionArray, firmwareType);
};
exports.getBundledRelease = getBundledRelease;
const getOnlineReleaseByPath = async releasePath => {
  const onlineFirmwareBaseUrl = (0, exports.getOnlineFirmwareBaseUrl)();
  const url = `${onlineFirmwareBaseUrl.BASE_URL}/${releasePath}`;
  const response = await (0, assets_1.httpRequest)(url, 'json', {
    signal: AbortSignal.timeout(10000),
    skipLocalForceDownload: true
  });
  return response;
};
const getOnlineReleasePath = (deviceModel, firmwareVersion, firmwareType) => {
  const onlineFirmwareBaseUrl = (0, exports.getOnlineFirmwareBaseUrl)();
  const firmwareTypeFileString = firmwareType === device_utils_1.FirmwareType.BitcoinOnly ? 'bitcoinonly' : 'universal';
  const relaseJsonFilename = `${deviceModel.toLowerCase()}-${firmwareVersion.join('.')}-${firmwareTypeFileString}.json`;
  const origin = `${onlineFirmwareBaseUrl.MIDDLE_PATH}/${deviceModel.toLowerCase()}/${firmwareTypeFileString}`;
  const releasePath = `${origin}/${relaseJsonFilename}`;
  return releasePath;
};
const getOnlineReleaseByVersion = async (deviceModel, firmwareVersion, firmwareType) => {
  const releasePath = getOnlineReleasePath(deviceModel, firmwareVersion, firmwareType);
  const onlineRelease = await getOnlineReleaseByPath(releasePath);
  if (!onlineRelease || !utils_1.versionUtils.isEqual(onlineRelease.version, firmwareVersion)) {
    return;
  }
  return onlineRelease;
};
exports.getOnlineReleaseByVersion = getOnlineReleaseByVersion;
const getReleaseConfig = (features, firmwareType) => {
  const {
    internal_model
  } = features;
  if (internal_model === device_utils_1.DeviceModelInternal.UNKNOWN) {
    return undefined;
  }
  const firmwareReleaseConfig = DataManager_1.DataManager.getFirmwareReleaseConfig();
  if (!firmwareReleaseConfig) {
    throw new Error('Firmware release config not loaded.');
  }
  const deviceMessageRelease = firmwareReleaseConfig[internal_model];
  if (!deviceMessageRelease) {
    return;
  }
  return deviceMessageRelease[firmwareType];
};
exports.getReleaseConfig = getReleaseConfig;
const getReleaseByVersion = async (features, firmwareVersion, firmwareType) => {
  const deviceModel = features.internal_model;
  const tryGetRelease = async getter => {
    try {
      return await getter();
    } catch {
      return;
    }
  };
  const releaseFromConfig = (0, exports.getReleaseConfig)(features, firmwareType)?.release;
  if (releaseFromConfig && utils_1.versionUtils.isEqual(firmwareVersion, releaseFromConfig.version)) {
    return releaseFromConfig;
  }
  const releaseName = (0, firmwareUtils_1.buildLocalReleaseName)(firmwareType, deviceModel, firmwareVersion);
  const {
    firmwareDir,
    firmwareList
  } = DataManager_1.DataManager.getLocalFirmwares();
  if ((0, firmwareUtils_1.isFirmwareCacheUsedForSelectedSource)() && firmwareList.includes(releaseName)) {
    const localReleasePath = `${firmwareDir}${releaseName}`;
    const localReleaseBuffer = await (0, assets_1.httpRequest)(localReleasePath, 'json');
    return JSON.parse(localReleaseBuffer.toString());
  }
  const release = (await tryGetRelease(() => (0, assetUtils_1.getReleaseAsset)(deviceModel, firmwareVersion, firmwareType))) || (await tryGetRelease(() => (0, exports.getOnlineReleaseByVersion)(deviceModel, firmwareVersion, firmwareType)));
  if (release && utils_1.versionUtils.isEqual(release.version, firmwareVersion)) {
    return release;
  }
  return;
};
exports.getReleaseByVersion = getReleaseByVersion;
const createLocalFirmwareConfig = baseConfig => {
  const releaseEntries = Object.entries(baseConfig.releases).map(([deviceModel, modelReleases]) => {
    const modelKey = deviceModel;
    if (modelKey === device_utils_1.DeviceModelInternal.UNKNOWN) return null;
    const {
      'bitcoin-only': bitcoinOnlyConfig,
      universal: universalConfig
    } = modelReleases ?? {};
    if (!bitcoinOnlyConfig?.releasePath || !universalConfig?.releasePath) return null;
    const btcOnlyRelease = (0, exports.getBundledRelease)(modelKey, device_utils_1.FirmwareType.BitcoinOnly);
    const universalRelease = (0, exports.getBundledRelease)(modelKey, device_utils_1.FirmwareType.Universal);
    if (!btcOnlyRelease || !universalRelease) return null;
    const releases = {
      [device_utils_1.FirmwareType.BitcoinOnly]: {
        ...bitcoinOnlyConfig,
        release: btcOnlyRelease
      },
      [device_utils_1.FirmwareType.Universal]: {
        ...universalConfig,
        release: universalRelease
      }
    };
    return [modelKey, releases];
  }).filter(entry => entry !== null);
  return Object.fromEntries(releaseEntries);
};
exports.createLocalFirmwareConfig = createLocalFirmwareConfig;
const createRemoteFirmwareConfig = async config => {
  const releaseEntryPromises = Object.entries(config.releases).map(async ([deviceModel, modelReleases]) => {
    const modelKey = deviceModel;
    if (modelKey === device_utils_1.DeviceModelInternal.UNKNOWN) return null;
    const {
      'bitcoin-only': bitcoinOnlyConfig,
      universal: universalConfig
    } = modelReleases ?? {};
    if (!bitcoinOnlyConfig?.releasePath || !universalConfig?.releasePath) return null;
    const [bitcoinOnlyRelease, universalRelease] = await Promise.all([getOnlineReleaseByPath(bitcoinOnlyConfig.releasePath), getOnlineReleaseByPath(universalConfig.releasePath)]);
    if (!universalRelease || !bitcoinOnlyRelease) return null;
    const releases = {
      [device_utils_1.FirmwareType.BitcoinOnly]: {
        ...bitcoinOnlyConfig,
        release: bitcoinOnlyRelease
      },
      [device_utils_1.FirmwareType.Universal]: {
        ...universalConfig,
        release: universalRelease
      }
    };
    return [modelKey, releases];
  });
  const validEntries = (await Promise.all(releaseEntryPromises)).filter(entry => entry !== null);
  return Object.fromEntries(validEntries);
};
exports.createRemoteFirmwareConfig = createRemoteFirmwareConfig;
const initializeFirmwareConfig = async (config, isRemote) => {
  if (isRemote) {
    try {
      const remoteReleases = await (0, exports.createRemoteFirmwareConfig)(config);
      return {
        releases: remoteReleases,
        intermediaries: config.intermediaries
      };
    } catch {}
  }
  const localFirmwareReleaseConfig = DataManager_1.DataManager.getLocalFirmwareReleaseConfig();
  const localReleases = (0, exports.createLocalFirmwareConfig)(localFirmwareReleaseConfig);
  return {
    releases: localReleases,
    intermediaries: localFirmwareReleaseConfig.intermediaries
  };
};
exports.initializeFirmwareConfig = initializeFirmwareConfig;
const getLanguage = languageBinPath => {
  const baseUrl = (0, exports.getOnlineFirmwareBaseUrl)();
  const url = `${baseUrl.BASE_URL}/${languageBinPath}`;
  return (0, assets_1.httpRequest)(url, 'binary');
};
exports.getLanguage = getLanguage;
const getCurrentVersion = features => {
  if (!(0, firmwareUtils_1.isStrictFeatures)(features)) {
    throw new Error('Features of unexpected shape provided.');
  }
  const {
    bootloader_mode,
    major_version,
    minor_version,
    patch_version,
    fw_major,
    fw_minor,
    fw_patch
  } = features;
  const fw_version = [fw_major, fw_minor, fw_patch];
  const version = [major_version, minor_version, patch_version];
  const bootloaderVersion = bootloader_mode ? version : null;
  const fwVersion = bootloader_mode ? fw_version : version;
  return {
    bootloaderVersion,
    firmwareVersion: fwVersion.includes(null) ? null : fwVersion
  };
};
exports.getCurrentVersion = getCurrentVersion;
const getIntermediaryMessageRelease = features => {
  const config = DataManager_1.DataManager.getFirmwareIntermediaryReleaseConfig();
  if (!config) {
    throw new Error('Firmware release config not loaded.');
  }
  const deviceIntermediaryReleases = config[features.internal_model];
  if (!deviceIntermediaryReleases || deviceIntermediaryReleases.length === 0) {
    return;
  }
  const {
    bootloaderVersion,
    firmwareVersion
  } = (0, exports.getCurrentVersion)(features);
  const currentVersion = features.bootloader_mode ? bootloaderVersion : firmwareVersion;
  const minVersionKey = features.bootloader_mode ? 'min_bootloader_version' : 'min_firmware_version';
  if (!currentVersion) {
    return undefined;
  }
  return deviceIntermediaryReleases.find(release => utils_1.versionUtils.isNewer(release[minVersionKey], currentVersion));
};
const getIsBitcoinOnlyAvailable = features => {
  const {
    internal_model
  } = features;
  if (internal_model === device_utils_1.DeviceModelInternal.UNKNOWN) {
    return false;
  }
  const firmwareReleaseConfig = DataManager_1.DataManager.getFirmwareReleaseConfig();
  if (!firmwareReleaseConfig) {
    throw new Error('Firmware release config not loaded.');
  }
  const deviceMessageRelease = firmwareReleaseConfig[internal_model];
  return !!deviceMessageRelease && !!deviceMessageRelease[device_utils_1.FirmwareType.BitcoinOnly];
};
const isValidConditionalRelease = release => !!(release.version && release.min_firmware_version && release.min_bootloader_version);
const calculateShouldOfferRelease = (rolloutProbability, deviceId) => {
  if (rolloutProbability < 0 || rolloutProbability > 100) {
    throw new Error('Probability must be between 0 and 100.');
  }
  if (deviceId === null) {
    return rolloutProbability > 0;
  } else {
    const deterministicValueToCompare = (0, utils_1.getIntegerInRangeFromString)(deviceId, 101);
    return deterministicValueToCompare < rolloutProbability;
  }
};
const getChangelog = (releases, features) => {
  if (features.bootloader_mode) {
    if (features.firmware_present && features.major_version === 1) {
      return null;
    }
    if (features.firmware_present && features.major_version === 2) {
      return releases.filter(r => utils_1.versionUtils.isNewer(r.version, [features.fw_major, features.fw_minor, features.fw_patch]));
    }
    return releases;
  }
  return releases.filter(r => utils_1.versionUtils.isNewer(r.version, [features.major_version, features.minor_version, features.patch_version]));
};
const isRequired = changelog => {
  if (!changelog || !changelog.length) return null;
  return changelog.some(item => item.required);
};
const getReleaseInfo = ({
  features,
  release,
  conditions,
  intermediary,
  firmwareType,
  isBitcoinOnlyAvailable,
  releasesOfDevice
}) => {
  if (!(0, firmwareUtils_1.isStrictFeatures)(features)) {
    throw new Error('Features of unexpected shape provided.');
  }
  if (!isValidConditionalRelease(release)) {
    throw new Error(`Release object in unexpected shape.`);
  }
  const {
    min_firmware_version,
    min_bootloader_version
  } = release;
  const changelog = getChangelog(releasesOfDevice, features);
  let isNewer = false;
  let requiresIntermediary = false;
  if (features.bootloader_mode && release.bootloader_version) {
    const {
      bootloaderVersion,
      firmwareVersion
    } = (0, exports.getCurrentVersion)(features);
    if (utils_1.versionUtils.isVersionArray(firmwareVersion)) {
      isNewer = utils_1.versionUtils.isNewer(release.version, firmwareVersion);
      requiresIntermediary = utils_1.versionUtils.isNewer(min_firmware_version, firmwareVersion);
    } else if (utils_1.versionUtils.isVersionArray(bootloaderVersion)) {
      isNewer = utils_1.versionUtils.isNewer(release.bootloader_version, bootloaderVersion);
      requiresIntermediary = utils_1.versionUtils.isNewer(min_bootloader_version, bootloaderVersion);
    } else {
      throw new Error('Version is not version array.');
    }
  } else {
    const {
      firmwareVersion
    } = (0, exports.getCurrentVersion)(features);
    if (!utils_1.versionUtils.isVersionArray(firmwareVersion)) {
      throw new Error('Firmware version is not version array.');
    }
    isNewer = utils_1.versionUtils.isNewer(release.version, firmwareVersion);
    requiresIntermediary = utils_1.versionUtils.isNewer(min_firmware_version, firmwareVersion);
  }
  const {
    rollout_probability
  } = conditions;
  const shouldBeOffered = calculateShouldOfferRelease(rollout_probability, features.device_id);
  if (requiresIntermediary && intermediary) {
    isNewer = true;
  }
  return {
    firmwareType,
    isBitcoinOnlyAvailable,
    releaseConditions: {
      ...conditions,
      shouldBeOffered
    },
    release,
    intermediary: requiresIntermediary ? intermediary : undefined,
    isRequired: isRequired(changelog),
    isNewer,
    translations: release.translations
  };
};
exports.getReleaseInfo = getReleaseInfo;
const getFirmwareReleaseConfigInfo = (features, firmwareType) => {
  const deviceMessageRelease = (0, exports.getReleaseConfig)(features, firmwareType);
  if (!deviceMessageRelease?.release) {
    return;
  }
  const {
    release,
    conditions,
    firmware_type
  } = deviceMessageRelease;
  const currentVersion = (0, exports.getCurrentVersion)(features);
  const inBootloaderMode = features.bootloader_mode && !!currentVersion.bootloaderVersion;
  const versionContext = inBootloaderMode ? {
    version: currentVersion.bootloaderVersion,
    minVersionKey: 'min_bootloader_version'
  } : {
    version: currentVersion.firmwareVersion,
    minVersionKey: 'min_firmware_version'
  };
  const isCompatible = versionContext.version && utils_1.versionUtils.isNewerOrEqual(versionContext.version, release[versionContext.minVersionKey]);
  const releasesOfDevice = (0, assetUtils_1.getReleasesAssetByDeviceModelAndFirmwareType)(features.internal_model, firmwareType);
  let suitableRelease = release;
  if (!isCompatible) {
    const alternativeRelease = (0, firmwareUtils_1.findBestCompatibleRelease)(releasesOfDevice, currentVersion, versionContext.minVersionKey);
    if (alternativeRelease) {
      suitableRelease = alternativeRelease;
    }
  }
  const intermediary = getIntermediaryMessageRelease(features);
  const finalTargetRelease = intermediary ? release : suitableRelease;
  return (0, exports.getReleaseInfo)({
    isBitcoinOnlyAvailable: getIsBitcoinOnlyAvailable(features),
    features,
    release: finalTargetRelease,
    conditions,
    intermediary,
    firmwareType: firmware_type,
    releasesOfDevice
  });
};
exports.getFirmwareReleaseConfigInfo = getFirmwareReleaseConfigInfo;
const getFirmwareStatus = (features, firmwareType) => {
  if (features.firmware_present === false) {
    return 'none';
  }
  if (features.major_version === 1 && features.bootloader_mode) {
    return 'unknown';
  }
  const releaseInfo = (0, exports.getFirmwareReleaseConfigInfo)(features, firmwareType);
  if (!releaseInfo) return 'custom';
  if (releaseInfo.isRequired) return 'required';
  if (releaseInfo.isNewer) return 'outdated';
  return 'valid';
};
exports.getFirmwareStatus = getFirmwareStatus;
const getFirmwareLocation = ({
  firmwareVersion,
  remotePath,
  deviceModel,
  firmwareType,
  intermediaryVersion
}) => {
  const firmwareName = intermediaryVersion ? (0, firmwareUtils_1.buildIntermediaryFirmwareFileName)(deviceModel, intermediaryVersion) : (0, firmwareUtils_1.buildLocalFirmwareFileName)(firmwareType, deviceModel, firmwareVersion);
  const versionString = firmwareVersion.join('.');
  const bundledBaseUrl = (0, utils_1.removeTrailingSlashes)(DataManager_1.DataManager.getSettings('binFilesBaseUrl'));
  const isRealBundled = !bundledBaseUrl.includes('data.trezor.io');
  const bundledVersion = getBundledFirmwareVersion(deviceModel, firmwareType);
  const isIntermediary = bundledBaseUrl && intermediaryVersion;
  const isMatchingBundledVersion = bundledBaseUrl && isRealBundled && bundledVersion === versionString;
  if (isIntermediary || isMatchingBundledVersion) {
    return {
      baseUrl: bundledBaseUrl,
      path: `firmware/${deviceModel.toLowerCase()}/${firmwareName}`
    };
  }
  const {
    firmwareDir,
    firmwareList
  } = DataManager_1.DataManager.getLocalFirmwares();
  if ((0, firmwareUtils_1.isFirmwareCacheUsedForSelectedSource)() && firmwareList.includes(firmwareName)) {
    return {
      baseUrl: firmwareDir,
      path: firmwareName
    };
  }
  const onlineBaseUrl = (0, exports.getOnlineFirmwareBaseUrl)();
  return {
    baseUrl: onlineBaseUrl.BASE_URL,
    path: remotePath
  };
};
exports.getFirmwareLocation = getFirmwareLocation;
//# sourceMappingURL=firmwareInfo.js.map