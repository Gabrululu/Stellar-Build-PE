"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.onCallFirmwareUpdate = void 0;
const utils_1 = require("@trezor/utils");
const versionUtils_1 = require("@trezor/utils/lib/versionUtils");
const firmware_1 = require("../api/firmware");
const constants_1 = require("../constants");
const firmwareInfo_1 = require("../data/firmwareInfo");
const events_1 = require("../events");
const types_1 = require("../types");
const firmwareUtils_1 = require("../utils/firmwareUtils");
const waitForReconnectedDevice = async ({
  bootloader,
  method,
  intermediary
}, {
  deviceList,
  device,
  registerEvents,
  postMessage,
  log,
  abortSignal,
  uiPromises
}) => {
  const target = intermediary || !bootloader ? 'normal' : 'bootloader';
  let i = 0;
  if (method !== 'auto') {
    log.debug('onCallFirmwareUpdate', 'waiting for device to disconnect');
    postMessage((0, events_1.createUiMessage)(events_1.UI.FIRMWARE_RECONNECT, {
      device: device.toMessageObject(),
      disconnected: false,
      method,
      target,
      i
    }));
    await new Promise(resolve => {
      deviceList.once('device-disconnect', resolve);
    });
  }
  log.debug('onCallFirmwareUpdate', `waiting for device to reconnect in ${bootloader ? 'bootloader' : 'normal'} mode`);
  let reconnectedDevice;
  let thpPairingError = false;
  do {
    postMessage((0, events_1.createUiMessage)(events_1.UI.FIRMWARE_RECONNECT, {
      device: device.toMessageObject(),
      disconnected: true,
      method,
      target,
      i
    }));
    await (0, utils_1.resolveAfter)(2000);
    try {
      reconnectedDevice = deviceList.getOnlyDevice();
    } catch {}
    if (reconnectedDevice && !reconnectedDevice.features) {
      log.debug('onCallFirmwareUpdate', 'we were unable to read device.features on the first interaction after seeing it, retrying...');
      let runFn;
      if (reconnectedDevice.getThpState()?.properties) {
        const uiPromise = uiPromises.create(events_1.UI.RECEIVE_CONFIRMATION, reconnectedDevice);
        postMessage((0, events_1.createUiMessage)(events_1.UI.REQUEST_CONFIRMATION, {
          view: thpPairingError ? 'thp-pairing-failed' : 'thp-pairing-start'
        }));
        const uiResp = await uiPromise.promise;
        if (!uiResp.payload) {
          throw constants_1.ERRORS.TypedError('Method_PermissionsNotGranted');
        }
        runFn = () => Promise.resolve();
      }
      try {
        registerEvents(reconnectedDevice);
        await reconnectedDevice.run(runFn, {
          skipFirmwareChecks: true,
          skipLanguageChecks: true
        });
      } catch (error) {
        uiPromises.rejectAll(error);
        if (error.code === 'Device_ThpPairingTagInvalid') {
          thpPairingError = true;
        }
      }
    }
    i++;
    log.debug('onCallFirmwareUpdate', '...still waiting for device to reconnect', i);
  } while (!abortSignal.aborted && (!reconnectedDevice?.features || bootloader === !reconnectedDevice.features.bootloader_mode || intermediary && !(0, versionUtils_1.isNewer)([reconnectedDevice.features.major_version, reconnectedDevice.features.minor_version, reconnectedDevice.features.patch_version], [device.features.major_version, device.features.minor_version, device.features.patch_version])));
  if (!reconnectedDevice) {
    throw constants_1.ERRORS.TypedError('Method_Interrupted');
  }
  registerEvents(reconnectedDevice);
  await reconnectedDevice.currentRun;
  if (!reconnectedDevice.isUsedHere()) {
    await reconnectedDevice.acquire();
  }
  return reconnectedDevice;
};
const waitForBluetoothReboot = ({
  device,
  target,
  postMessage
}) => new Promise(resolve => {
  postMessage((0, events_1.createUiMessage)(events_1.UI.FIRMWARE_RECONNECT, {
    device: device.toMessageObject(),
    disconnected: false,
    method: 'auto',
    target,
    i: 0
  }));
  const handler = () => {
    const deviceIsReady = target === 'bootloader' && device.features?.bootloader_mode || target === 'normal' && device.getThpState()?.properties;
    if (deviceIsReady) {
      device.lifecycle.off('device-changed', handler);
      resolve();
    }
  };
  device.lifecycle.on('device-changed', handler);
});
const getInstallationParams = (device, params) => {
  const btcOnly = params.btcOnly ?? device.firmwareType === types_1.FirmwareType.BitcoinOnly;
  if (!device.features.bootloader_mode) {
    const version = params.binary ? (0, firmware_1.parseFirmwareHeaders)(Buffer.from(params.binary)).version : undefined;
    const isUpdatingToNewerVersion = !version ? device.firmwareReleaseConfigInfo?.isNewer : (0, versionUtils_1.isNewer)(version, [device.features.major_version, device.features.minor_version, device.features.patch_version]);
    const isUpdatingToEqualFirmwareType = device.firmwareType === types_1.FirmwareType.BitcoinOnly === btcOnly;
    const upgrade = device.atLeast('2.6.3') && isUpdatingToNewerVersion && isUpdatingToEqualFirmwareType;
    const manual = !device.atLeast(['1.10.0', '2.6.0']) && !upgrade;
    const getUpdateFlowType = () => {
      if (manual) return 'manual';
      return upgrade ? 'reboot_and_upgrade' : 'reboot_and_wait';
    };
    return {
      manual,
      upgrade,
      updateFlowType: getUpdateFlowType(),
      btcOnly
    };
  } else {
    return {
      manual: false,
      upgrade: false,
      updateFlowType: 'unknown_flow',
      btcOnly
    };
  }
};
const getFwHeader = binary => Buffer.from(binary.slice(0, 6000)).toString('hex');
const getBinaryHelper = async ({
  device,
  params,
  firmwareType,
  isIntermediary,
  log
}) => {
  if (params.binary) {
    return Promise.resolve({
      binary: params.binary,
      binaryVersion: (0, firmware_1.parseFirmwareHeaders)(Buffer.from(params.binary)).version,
      release: undefined
    });
  }
  if (!device.firmwareReleaseConfigInfo) {
    throw constants_1.ERRORS.TypedError('Runtime', 'device.firmwareReleaseConfigInfo is not set');
  }
  const deviceModel = device.features?.internal_model;
  const {
    release: {
      version
    },
    intermediary
  } = device.firmwareReleaseConfigInfo;
  log.debug('onCallFirmwareUpdate loading binary', 'isIntermediary', isIntermediary, 'version', version, 'firmwareType', firmwareType, 'deviceModel', deviceModel);
  const release = await (0, firmwareInfo_1.getReleaseByVersion)(device.features, version, firmwareType);
  if (!release) {
    throw new Error('Missing Firmware release for device');
  }
  const {
    baseUrl,
    path
  } = (0, firmwareInfo_1.getFirmwareLocation)({
    firmwareVersion: version,
    remotePath: release.url,
    deviceModel,
    firmwareType,
    intermediaryVersion: isIntermediary && intermediary ? intermediary.version : undefined
  });
  return (0, firmware_1.getBinary)({
    baseUrl,
    path,
    release
  });
};
const onCallFirmwareUpdate = async ({
  params,
  context
}) => {
  const {
    deviceList,
    registerEvents,
    postMessage,
    initDevice,
    log
  } = context;
  log.debug('onCallFirmwareUpdate with params: ', params);
  const firmwareType = params.btcOnly ? types_1.FirmwareType.BitcoinOnly : types_1.FirmwareType.Universal;
  const device = await initDevice(params?.device?.path);
  if (!device.features) {
    throw constants_1.ERRORS.TypedError('Device_NotFound', 'Device missing features');
  }
  if (deviceList.getDeviceCount() > 1) {
    throw constants_1.ERRORS.TypedError('Device_MultipleNotSupported', 'Firmware update allowed with only 1 device connected');
  }
  log.debug('onCallFirmwareUpdate', 'device', device);
  registerEvents(device);
  const {
    manual,
    upgrade,
    updateFlowType,
    btcOnly
  } = getInstallationParams(device, params);
  log.debug('onCallFirmwareUpdate', 'installation params', {
    manual,
    upgrade,
    updateFlowType,
    btcOnly
  });
  const intermediary = !params.binary && device?.firmwareReleaseConfigInfo?.intermediary;
  postMessage((0, events_1.createUiMessage)(events_1.UI.FIRMWARE_PROGRESS, {
    device: device.toMessageObject(),
    operation: 'downloading',
    progress: 0
  }));
  let intermediaryBinaryInfo;
  let finalBinaryInfo;
  const fwFetchPromises = [];
  if (intermediary) {
    fwFetchPromises.push(getBinaryHelper({
      device,
      params,
      firmwareType,
      isIntermediary: true,
      log
    }));
  }
  fwFetchPromises.push(getBinaryHelper({
    device,
    params,
    firmwareType,
    isIntermediary: false,
    log
  }));
  const [firstResult, finalResult] = await Promise.all(fwFetchPromises);
  if (intermediary) {
    intermediaryBinaryInfo = firstResult;
    finalBinaryInfo = finalResult;
  } else {
    finalBinaryInfo = firstResult;
  }
  const firstBinaryInfo = intermediary ? intermediaryBinaryInfo : finalBinaryInfo;
  if (!firstBinaryInfo) {
    throw new Error('Missing binary, something went wrong.');
  }
  postMessage((0, events_1.createUiMessage)(events_1.UI.FIRMWARE_PROGRESS, {
    device: device.toMessageObject(),
    operation: 'downloading',
    progress: 100
  }));
  if ((0, firmwareUtils_1.isFirmwareCacheUsedForSelectedSource)() && finalBinaryInfo.release) {
    const message = (0, events_1.createUiMessage)(events_1.UI.FIRMWARE_DOWNLOADED, {
      binary: finalBinaryInfo.binary,
      binaryVersion: finalBinaryInfo.binaryVersion,
      releaseVersion: finalBinaryInfo.release?.version,
      firmwareType,
      release: finalBinaryInfo.release,
      internalModel: device.features.internal_model
    });
    postMessage(message);
  }
  const deviceInitiallyConnectedInBootloader = device.features.bootloader_mode;
  let reconnectedDevice = device;
  if (deviceInitiallyConnectedInBootloader) {
    log.warn('onCallFirmwareUpdate', 'device is already in bootloader mode.');
    await device.acquire();
  } else if (manual) {
    reconnectedDevice = await waitForReconnectedDevice({
      bootloader: true,
      method: 'manual'
    }, {
      ...context,
      device
    });
  } else {
    const rebootParams = upgrade ? {
      boot_command: constants_1.PROTO.BootCommand.INSTALL_UPGRADE,
      firmware_header: getFwHeader(firstBinaryInfo.binary)
    } : {};
    await device.acquire();
    const disconnectedPromise = new Promise(resolve => {
      deviceList.once('device-disconnect', resolve);
    });
    await device.getCommands().typedCall('RebootToBootloader', 'Success', rebootParams);
    log.info('onCallFirmwareUpdate', 'waiting for disconnected event after rebootToBootloader...');
    if (device.descriptor.apiType === 'bluetooth') {
      await device.release();
      await waitForBluetoothReboot({
        device,
        target: 'bootloader',
        postMessage
      });
    } else {
      await disconnectedPromise;
      if (device.features.major_version === 1) {
        await (0, utils_1.resolveAfter)(2000);
      }
    }
    reconnectedDevice = await waitForReconnectedDevice({
      bootloader: true,
      method: 'auto'
    }, {
      ...context,
      device
    });
  }
  const bootloaderVersion = reconnectedDevice.getVersion();
  await reconnectedDevice.initialize(false);
  let stripped = (0, firmware_1.stripFwHeaders)(firstBinaryInfo.binary);
  const payload = !intermediary && (0, firmware_1.shouldStripFwHeaders)(device.features) ? stripped : firstBinaryInfo.binary;
  await (0, firmware_1.uploadFirmware)({
    typedCall: reconnectedDevice.getCommands().typedCall,
    postMessage,
    device: reconnectedDevice,
    firmwareUploadRequest: {
      payload
    },
    updateFlowType
  });
  log.info('onCallFirmwareUpdate', 'firmware uploaded');
  if (intermediary) {
    log.info('onCallFirmwareUpdate', '...but it was the intermediary firmware, so one more go');
    reconnectedDevice = await waitForReconnectedDevice({
      bootloader: true,
      method: 'manual',
      intermediary: true
    }, {
      ...context,
      device: reconnectedDevice
    });
    stripped = (0, firmware_1.stripFwHeaders)(finalBinaryInfo.binary);
    await reconnectedDevice.initialize(false);
    await (0, firmware_1.uploadFirmware)({
      typedCall: reconnectedDevice.getCommands().typedCall,
      postMessage,
      device: reconnectedDevice,
      firmwareUploadRequest: {
        payload: stripped
      },
      updateFlowType
    });
  }
  let method = 'wait';
  if (device.descriptor.apiType === 'bluetooth') {
    await waitForBluetoothReboot({
      device,
      target: 'normal',
      postMessage
    });
    method = 'auto';
  }
  reconnectedDevice = await waitForReconnectedDevice({
    bootloader: false,
    method
  }, {
    ...context,
    device: reconnectedDevice
  });
  const installedVersion = reconnectedDevice.getVersion();
  if (!bootloaderVersion || !installedVersion) {
    throw constants_1.ERRORS.TypedError('Runtime', 'reconnectedDevice.installedVersion is not set');
  }
  const {
    binaryVersion,
    release
  } = finalBinaryInfo;
  const assertBinaryVersion = (0, versionUtils_1.isEqual)(installedVersion, binaryVersion);
  const assertReleaseVersion = release?.version ? (0, versionUtils_1.isEqual)(installedVersion, release?.version) : true;
  await reconnectedDevice.release();
  log.info('onCallFirmwareUpdate', `firmware updated to version ${installedVersion}`);
  return {
    versionCheck: assertBinaryVersion && assertReleaseVersion,
    bootloaderVersion,
    installedVersion,
    binaryVersion,
    releaseVersion: release?.version
  };
};
exports.onCallFirmwareUpdate = onCallFirmwareUpdate;
//# sourceMappingURL=onCallFirmwareUpdate.js.map