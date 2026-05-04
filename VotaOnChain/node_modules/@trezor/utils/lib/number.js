"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.roundTo = roundTo;
function roundTo(value, precision = 2) {
  const x = 10 ** precision;
  return Math.round(value * x) / x;
}
//# sourceMappingURL=number.js.map