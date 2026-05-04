"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getBinaryOptional = exports.getBinary = void 0;
const utils_1 = require("@trezor/utils");
const parseFirmwareHeaders_1 = require("./parseFirmwareHeaders");
const constants_1 = require("../../constants");
const assets_1 = require("../../utils/assets");
const MIN_FIRMWARE_SIZE_BYTES = 200;
const getBinary = async ({
  baseUrl,
  path,
  release
}) => {
  const sanitizedBaseUrl = (0, utils_1.removeTrailingSlashes)(baseUrl);
  const url = `${sanitizedBaseUrl}/${path}`;
  const binaryArrayBuffer = await (0, assets_1.httpRequest)(url, 'binary');
  if (binaryArrayBuffer.byteLength < MIN_FIRMWARE_SIZE_BYTES) {
    throw constants_1.ERRORS.TypedError('Runtime', 'Firmware binary is too small');
  }
  const firmwareBuffer = Buffer.from(binaryArrayBuffer);
  const {
    version: binaryVersion
  } = (0, parseFirmwareHeaders_1.parseFirmwareHeaders)(firmwareBuffer);
  return {
    binary: binaryArrayBuffer,
    binaryVersion,
    release
  };
};
exports.getBinary = getBinary;
const getBinaryOptional = async params => {
  try {
    return await (0, exports.getBinary)(params);
  } catch {
    return null;
  }
};
exports.getBinaryOptional = getBinaryOptional;
//# sourceMappingURL=getBinary.js.map