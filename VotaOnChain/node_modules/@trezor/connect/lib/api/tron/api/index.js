"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tronSignTransaction = exports.tronGetAddress = void 0;
const tslib_1 = require("tslib");
var tronGetAddress_1 = require("./tronGetAddress");
Object.defineProperty(exports, "tronGetAddress", {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(tronGetAddress_1).default;
  }
});
var tronSignTransaction_1 = require("./tronSignTransaction");
Object.defineProperty(exports, "tronSignTransaction", {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(tronSignTransaction_1).default;
  }
});
//# sourceMappingURL=index.js.map