"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.trezorPushNotificationHandler = void 0;
const protocol_1 = require("@trezor/protocol");
const utils_1 = require("@trezor/utils");
const device_1 = require("../../events/device");
const thp_1 = require("../thp");
const setupDeviceMode = async (device, mode) => {
  if (mode === protocol_1.TrezorPushNotificationMode.BootloaderMode && !device.features) {
    device.setBusy('rebooting');
    await device.acquire();
    await device.getFeatures();
    await device.release();
  }
  if (mode === protocol_1.TrezorPushNotificationMode.NormalMode && (!device.features || !device.getThpState())) {
    device.setBusy('rebooting');
    await device.setupThp();
    await device.acquire();
    await (0, utils_1.resolveAfter)(1000);
    await (0, thp_1.getThpChannel)(device, false);
    if (device.getThpState()?.phase === 'paired') {
      await device.getFeatures();
    } else {
      device.setBusy('thp-locked');
      device.lifecycle.emit(device_1.DEVICE.CHANGED);
    }
    await device.release();
  }
};
const trezorPushNotificationHandler = async ({
  device,
  message
}) => {
  const decodedResult = protocol_1.tpn.decode(message);
  if (!decodedResult.success) return;
  const decoded = decodedResult.payload;
  device.lifecycle.emit(device_1.DEVICE.TREZOR_PUSH_NOTIFICATION, decoded);
  const {
    type,
    mode
  } = decoded;
  const modeChanged = mode === protocol_1.TrezorPushNotificationMode.BootloaderMode && (device.getThpState()?.properties || device.features && !device.features.bootloader_mode) || mode === protocol_1.TrezorPushNotificationMode.NormalMode && device.features?.bootloader_mode;
  if (modeChanged) {
    device.reset();
    device.setBusy(mode === protocol_1.TrezorPushNotificationMode.BootloaderMode ? 'bootloader-locked' : 'rebooting');
    device.lifecycle.emit(device_1.DEVICE.CHANGED);
  }
  switch (type) {
    case protocol_1.TrezorPushNotificationType.SETTING_CHANGE:
    case protocol_1.TrezorPushNotificationType.PIN_CHANGE:
    case protocol_1.TrezorPushNotificationType.NOTIFY_POWER_STATUS_CHANGE:
      if (!device.isUsed()) {
        await device.acquire();
        await device.getFeatures();
        await device.release();
      }
      break;
    case protocol_1.TrezorPushNotificationType.LOCK:
      device.setBusy(mode === protocol_1.TrezorPushNotificationMode.BootloaderMode ? 'bootloader-locked' : 'hard-locked');
      device.lifecycle.emit(device_1.DEVICE.CHANGED);
      break;
    case protocol_1.TrezorPushNotificationType.UNLOCK:
      await setupDeviceMode(device, decoded.mode);
      break;
    case protocol_1.TrezorPushNotificationType.SOFTLOCK:
      device.setBusy('pin-locked');
      device.lifecycle.emit(device_1.DEVICE.CHANGED);
      break;
    case protocol_1.TrezorPushNotificationType.SOFTUNLOCK:
      device.setBusy(device.features ? undefined : 'thp-locked');
      device.lifecycle.emit(device_1.DEVICE.CHANGED);
      break;
    default:
      break;
  }
};
exports.trezorPushNotificationHandler = trezorPushNotificationHandler;
//# sourceMappingURL=trezorPushNotification.js.map