"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ping = void 0;
const applyBridgeApiCallHeaders_1 = require("../utils/applyBridgeApiCallHeaders");
const ping = url => fetch(url, {
  method: 'POST',
  headers: (0, applyBridgeApiCallHeaders_1.applyBridgeApiCallHeaders)({
    headers: {},
    contentType: 'text/plain',
    skipContentTypeHeader: true
  })
}).then(res => res.json()).then(res => typeof res?.version === 'string').catch(() => false);
exports.ping = ping;
//# sourceMappingURL=pingCommon.js.map