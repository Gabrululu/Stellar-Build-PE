"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.moneroSignTransaction = exports.moneroKeyImageSync = exports.moneroGetWatchKey = exports.moneroGetAddress = void 0;
const tslib_1 = require("tslib");
var moneroGetAddress_1 = require("./moneroGetAddress");
Object.defineProperty(exports, "moneroGetAddress", {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(moneroGetAddress_1).default;
  }
});
var moneroGetWatchKey_1 = require("./moneroGetWatchKey");
Object.defineProperty(exports, "moneroGetWatchKey", {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(moneroGetWatchKey_1).default;
  }
});
var moneroKeyImageSync_1 = require("./moneroKeyImageSync");
Object.defineProperty(exports, "moneroKeyImageSync", {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(moneroKeyImageSync_1).default;
  }
});
var moneroSignTransaction_1 = require("./moneroSignTransaction");
Object.defineProperty(exports, "moneroSignTransaction", {
  enumerable: true,
  get: function () {
    return tslib_1.__importDefault(moneroSignTransaction_1).default;
  }
});
//# sourceMappingURL=index.js.map