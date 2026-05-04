"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDeviceColorVariant = exports.normalizeDeviceColorVariant = void 0;
const normalizeDeviceColorVariant = colorVariant => colorVariant || 1;
exports.normalizeDeviceColorVariant = normalizeDeviceColorVariant;
const getDeviceColorVariant = device => (0, exports.normalizeDeviceColorVariant)(device?.features?.unit_color ?? device?.thp?.properties?.model_variant);
exports.getDeviceColorVariant = getDeviceColorVariant;
//# sourceMappingURL=deviceColorUtils.js.map