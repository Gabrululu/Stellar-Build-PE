"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeviceAuthenticityBlacklistConfig = void 0;
const schema_utils_1 = require("@trezor/schema-utils");
const CertPubKeysBlacklist = schema_utils_1.Type.Object({
  blacklistedCaPubKeys: schema_utils_1.Type.Array(schema_utils_1.Type.String())
});
exports.DeviceAuthenticityBlacklistConfig = schema_utils_1.Type.Intersect([CertPubKeysBlacklist, schema_utils_1.Type.Object({
  version: schema_utils_1.Type.Number(),
  debug: schema_utils_1.Type.Optional(CertPubKeysBlacklist)
})]);
//# sourceMappingURL=deviceAuthenticityBlacklistConfigTypes.js.map