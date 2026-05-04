"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDeviceMessage = exports.DEVICE = exports.DEVICE_EVENT = exports.TrezorPushNotificationType = exports.TrezorPushNotificationMode = void 0;
var protocol_tpn_1 = require("@trezor/protocol/lib/protocol-tpn");
Object.defineProperty(exports, "TrezorPushNotificationMode", {
  enumerable: true,
  get: function () {
    return protocol_tpn_1.TrezorPushNotificationMode;
  }
});
Object.defineProperty(exports, "TrezorPushNotificationType", {
  enumerable: true,
  get: function () {
    return protocol_tpn_1.TrezorPushNotificationType;
  }
});
exports.DEVICE_EVENT = 'DEVICE_EVENT';
exports.DEVICE = {
  CONNECT: 'device-connect',
  CONNECT_UNACQUIRED: 'device-connect_unacquired',
  DISCONNECT: 'device-disconnect',
  CHANGED: 'device-changed',
  FIRMWARE_VERSION_CHANGED: 'device-firmware_version_changed',
  TREZOR_PUSH_NOTIFICATION: 'device-trezor_push_notification',
  THP_CREDENTIALS_CHANGED: 'device-thp_credentials_changed',
  BUTTON: 'button',
  PIN: 'pin',
  PASSPHRASE: 'passphrase',
  PASSPHRASE_ON_DEVICE: 'passphrase_on_device',
  WORD: 'word',
  THP_PAIRING: 'thp_pairing'
};
const createDeviceMessage = (type, payload) => ({
  event: exports.DEVICE_EVENT,
  type,
  payload
});
exports.createDeviceMessage = createDeviceMessage;
//# sourceMappingURL=device.js.map