import { Type } from "@trezor/schema-utils";
const CertPubKeysBlacklist = Type.Object({
  blacklistedCaPubKeys: Type.Array(Type.String())
});
export const DeviceAuthenticityBlacklistConfig = Type.Intersect([CertPubKeysBlacklist, Type.Object({
  version: Type.Number(),
  debug: Type.Optional(CertPubKeysBlacklist)
})]);
//# sourceMappingURL=deviceAuthenticityBlacklistConfigTypes.js.map