import { Static } from '@trezor/schema-utils';
export type DeviceAuthenticityBlacklistConfig = Static<typeof DeviceAuthenticityBlacklistConfig>;
export declare const DeviceAuthenticityBlacklistConfig: import("@sinclair/typebox").TIntersect<[import("@sinclair/typebox").TObject<{
    blacklistedCaPubKeys: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
}>, import("@sinclair/typebox").TObject<{
    version: import("@sinclair/typebox").TNumber;
    debug: import("@sinclair/typebox").TOptional<import("@sinclair/typebox").TObject<{
        blacklistedCaPubKeys: import("@sinclair/typebox").TArray<import("@sinclair/typebox").TString>;
    }>>;
}>]>;
//# sourceMappingURL=deviceAuthenticityBlacklistConfigTypes.d.ts.map