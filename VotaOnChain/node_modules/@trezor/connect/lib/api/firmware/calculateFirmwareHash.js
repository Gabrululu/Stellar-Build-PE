"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateFirmwareHash = void 0;
const blakejs_1 = require("blakejs");
const device_utils_1 = require("@trezor/device-utils");
const utils_1 = require("@trezor/utils");
const SIZE_T1B1 = (7 * 128 + 64) * 1024;
const SIZE_T2T1 = 13 * 128 * 1024;
const SIZE_T2B1 = 13 * 128 * 1024;
const SIZE_T3B1 = 208 * 8 * 1024;
const SIZE_T3T1 = 208 * 8 * 1024;
const SIZE_T3W1 = 417 * 8 * 1024;
const firmwareSizeMap = {
  [device_utils_1.DeviceModelInternal.T1B1]: SIZE_T1B1,
  [device_utils_1.DeviceModelInternal.T2T1]: SIZE_T2T1,
  [device_utils_1.DeviceModelInternal.T2B1]: SIZE_T2B1,
  [device_utils_1.DeviceModelInternal.T3B1]: SIZE_T3B1,
  [device_utils_1.DeviceModelInternal.T3T1]: SIZE_T3T1,
  [device_utils_1.DeviceModelInternal.T3W1]: SIZE_T3W1
};
const getSizeForModel = ({
  internal_model,
  firmwareVersion
}) => {
  const size = firmwareSizeMap[internal_model] ?? SIZE_T1B1;
  if (firmwareVersion !== undefined && internal_model === device_utils_1.DeviceModelInternal.T3W1 && utils_1.versionUtils.isEqual(firmwareVersion, [2, 9, 3])) {
    return size - 16 * 1024;
  }
  return size;
};
const calculateFirmwareHash = ({
  internal_model,
  firmwareVersion,
  fw,
  key
}) => {
  const size = getSizeForModel({
    internal_model,
    firmwareVersion
  });
  const padding = size - fw.byteLength;
  if (padding < 0) {
    throw new Error('Firmware too big');
  }
  const data = new Uint8Array(new ArrayBuffer(size));
  data.set(new Uint8Array(fw));
  if (padding > 0) {
    const zeroBytes = Buffer.alloc(padding);
    zeroBytes.fill(Buffer.from('ff', 'hex'));
    data.set(zeroBytes, fw.byteLength);
  }
  return {
    hash: key && key.length > 0 ? (0, blakejs_1.blake2sHex)(data, key) : (0, blakejs_1.blake2sHex)(data),
    challenge: key ? key.toString('hex') : ''
  };
};
exports.calculateFirmwareHash = calculateFirmwareHash;
//# sourceMappingURL=calculateFirmwareHash.js.map