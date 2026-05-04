"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.safeBigIntStringify = void 0;
const safeBigIntStringify = v => JSON.stringify(v, (_k, val) => typeof val === 'bigint' ? val.toString() : val);
exports.safeBigIntStringify = safeBigIntStringify;
//# sourceMappingURL=safeBigIntStringify.js.map