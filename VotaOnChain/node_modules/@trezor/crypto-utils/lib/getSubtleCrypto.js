"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getSubtleCrypto = void 0;
const getSubtleCrypto = () => {
  const subtleCrypto = typeof window !== 'undefined' ? window.crypto.subtle : crypto.subtle;
  if (!subtleCrypto) {
    throw new Error('SubtleCrypto not supported');
  }
  return subtleCrypto;
};
exports.getSubtleCrypto = getSubtleCrypto;
//# sourceMappingURL=getSubtleCrypto.js.map