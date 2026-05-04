"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticateDeviceParams = void 0;
const device_authenticity_1 = require("@trezor/device-authenticity");
const schema_utils_1 = require("@trezor/schema-utils");
exports.AuthenticateDeviceParams = schema_utils_1.Type.Object({
  config: schema_utils_1.Type.Optional(device_authenticity_1.DeviceAuthenticityConfig),
  blacklistConfig: schema_utils_1.Type.Optional(device_authenticity_1.DeviceAuthenticityBlacklistConfig),
  allowDebugKeys: schema_utils_1.Type.Optional(schema_utils_1.Type.Boolean())
});
//# sourceMappingURL=authenticateDevice.js.map