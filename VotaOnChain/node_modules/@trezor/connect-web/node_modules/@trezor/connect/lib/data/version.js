"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEEPLINK_VERSION = exports.CONTENT_SCRIPT_VERSION = exports.DEFAULT_DOMAIN = exports.DEFAULT_DOMAIN_MAJOR_VER = exports.VERSION = void 0;
exports.VERSION = '9.7.2';
const versionN = exports.VERSION.split('.').map(s => parseInt(s, 10));
const isBeta = exports.VERSION.includes('beta');
exports.DEFAULT_DOMAIN_MAJOR_VER = `https://connect.trezor.io/${versionN[0]}/`;
exports.DEFAULT_DOMAIN = isBeta ? `https://connect.trezor.io/${exports.VERSION}/` : exports.DEFAULT_DOMAIN_MAJOR_VER;
exports.CONTENT_SCRIPT_VERSION = 1;
exports.DEEPLINK_VERSION = 1;
//# sourceMappingURL=version.js.map