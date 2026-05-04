import { Static } from '@trezor/schema-utils';
export type DeviceAuthenticityBlacklistConfig = Static<typeof DeviceAuthenticityBlacklistConfig>;
export declare const DeviceAuthenticityBlacklistConfig: import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
    blacklistedCaPubKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
}>, import("@trezor/schema-utils").TObject<{
    version: import("@trezor/schema-utils").TNumber;
    debug: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
        blacklistedCaPubKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    }>>;
}>]>;
//# sourceMappingURL=deviceAuthenticityBlacklistConfigTypes.d.ts.map