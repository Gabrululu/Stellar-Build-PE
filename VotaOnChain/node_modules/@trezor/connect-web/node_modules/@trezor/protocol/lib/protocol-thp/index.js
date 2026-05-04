"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.name = exports.getThpPairingMethod = exports.getCurve25519KeyPair = exports.ThpState = exports.validateNfcTag = exports.validateQrCodeTag = exports.validateCodeEntryTag = exports.handleHandshakeInit = exports.getHandshakeHash = exports.getSharedSecret = exports.getCpaceHostKeys = exports.constants = void 0;
const tslib_1 = require("tslib");
tslib_1.__exportStar(require("./decode"), exports);
tslib_1.__exportStar(require("./encode"), exports);
tslib_1.__exportStar(require("./messages"), exports);
tslib_1.__exportStar(require("./utils"), exports);
exports.constants = tslib_1.__importStar(require("./constants"));
var pairing_1 = require("./crypto/pairing");
Object.defineProperty(exports, "getCpaceHostKeys", {
  enumerable: true,
  get: function () {
    return pairing_1.getCpaceHostKeys;
  }
});
Object.defineProperty(exports, "getSharedSecret", {
  enumerable: true,
  get: function () {
    return pairing_1.getSharedSecret;
  }
});
Object.defineProperty(exports, "getHandshakeHash", {
  enumerable: true,
  get: function () {
    return pairing_1.getHandshakeHash;
  }
});
Object.defineProperty(exports, "handleHandshakeInit", {
  enumerable: true,
  get: function () {
    return pairing_1.handleHandshakeInit;
  }
});
Object.defineProperty(exports, "validateCodeEntryTag", {
  enumerable: true,
  get: function () {
    return pairing_1.validateCodeEntryTag;
  }
});
Object.defineProperty(exports, "validateQrCodeTag", {
  enumerable: true,
  get: function () {
    return pairing_1.validateQrCodeTag;
  }
});
Object.defineProperty(exports, "validateNfcTag", {
  enumerable: true,
  get: function () {
    return pairing_1.validateNfcTag;
  }
});
var ThpState_1 = require("./ThpState");
Object.defineProperty(exports, "ThpState", {
  enumerable: true,
  get: function () {
    return ThpState_1.ThpState;
  }
});
var curve25519_1 = require("./crypto/curve25519");
Object.defineProperty(exports, "getCurve25519KeyPair", {
  enumerable: true,
  get: function () {
    return curve25519_1.getCurve25519KeyPair;
  }
});
var utils_1 = require("./utils");
Object.defineProperty(exports, "getThpPairingMethod", {
  enumerable: true,
  get: function () {
    return utils_1.getThpPairingMethod;
  }
});
exports.name = 'thp';
//# sourceMappingURL=index.js.map