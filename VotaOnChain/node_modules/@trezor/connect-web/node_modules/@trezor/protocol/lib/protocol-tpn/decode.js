"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.decode = exports.TrezorPushNotificationMode = exports.TrezorPushNotificationType = exports.Version = void 0;
const errors_1 = require("../errors");
const constants_1 = require("./constants");
var Version;
(function (Version) {
  Version[Version["v1"] = 1] = "v1";
})(Version || (exports.Version = Version = {}));
var TrezorPushNotificationType;
(function (TrezorPushNotificationType) {
  TrezorPushNotificationType[TrezorPushNotificationType["BOOT"] = 0] = "BOOT";
  TrezorPushNotificationType[TrezorPushNotificationType["UNLOCK"] = 1] = "UNLOCK";
  TrezorPushNotificationType[TrezorPushNotificationType["LOCK"] = 2] = "LOCK";
  TrezorPushNotificationType[TrezorPushNotificationType["DISCONNECT"] = 3] = "DISCONNECT";
  TrezorPushNotificationType[TrezorPushNotificationType["SETTING_CHANGE"] = 4] = "SETTING_CHANGE";
  TrezorPushNotificationType[TrezorPushNotificationType["SOFTLOCK"] = 5] = "SOFTLOCK";
  TrezorPushNotificationType[TrezorPushNotificationType["SOFTUNLOCK"] = 6] = "SOFTUNLOCK";
  TrezorPushNotificationType[TrezorPushNotificationType["PIN_CHANGE"] = 7] = "PIN_CHANGE";
  TrezorPushNotificationType[TrezorPushNotificationType["WIPE"] = 8] = "WIPE";
  TrezorPushNotificationType[TrezorPushNotificationType["UNPAIR"] = 9] = "UNPAIR";
  TrezorPushNotificationType[TrezorPushNotificationType["NOTIFY_POWER_STATUS_CHANGE"] = 10] = "NOTIFY_POWER_STATUS_CHANGE";
})(TrezorPushNotificationType || (exports.TrezorPushNotificationType = TrezorPushNotificationType = {}));
var TrezorPushNotificationMode;
(function (TrezorPushNotificationMode) {
  TrezorPushNotificationMode[TrezorPushNotificationMode["NormalMode"] = 0] = "NormalMode";
  TrezorPushNotificationMode[TrezorPushNotificationMode["BootloaderMode"] = 1] = "BootloaderMode";
})(TrezorPushNotificationMode || (exports.TrezorPushNotificationMode = TrezorPushNotificationMode = {}));
const decode = message => {
  const [version, type, mode] = message;
  if (!version || version !== constants_1.TPN_VERSION) {
    return {
      success: false,
      error: errors_1.PROTOCOL_MISSMATCH_VERSION
    };
  }
  if (message.length < constants_1.MESSAGE_LENGTH || !Object.values(Version).includes(version) || !Object.values(TrezorPushNotificationType).includes(type) || !Object.values(TrezorPushNotificationMode).includes(mode)) {
    return {
      success: false,
      error: errors_1.PROTOCOL_MALFORMED
    };
  }
  return {
    success: true,
    payload: {
      type,
      mode
    }
  };
};
exports.decode = decode;
//# sourceMappingURL=decode.js.map