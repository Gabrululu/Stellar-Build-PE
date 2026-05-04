"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.err = void 0;
exports.ok = ok;
function ok(value = undefined) {
  return {
    ok: true,
    value: value
  };
}
const err = error => ({
  ok: false,
  error
});
exports.err = err;
//# sourceMappingURL=result.js.map