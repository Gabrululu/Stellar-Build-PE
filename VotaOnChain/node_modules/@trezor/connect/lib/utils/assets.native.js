"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.httpRequest = httpRequest;
const assetUtils_1 = require("./assetUtils");
function httpRequest(url, type, options) {
  const asset = options?.skipLocalForceDownload ? null : (0, assetUtils_1.tryLocalAssetRequire)(url);
  if (!asset) {
    return fetch(url, {
      ...options
    }).then(response => {
      if (!response.ok) {
        throw new assetUtils_1.HttpRequestError(response);
      }
      if (type === 'binary') {
        return response.arrayBuffer();
      }
      if (type === 'json') {
        return response.json();
      }
      return response.text();
    }).catch(error => {
      throw error;
    });
  }
  return asset;
}
//# sourceMappingURL=assets.native.js.map