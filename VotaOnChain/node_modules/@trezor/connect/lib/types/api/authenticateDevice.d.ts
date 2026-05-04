import { VerifyAuthenticityProofResult } from '@trezor/device-authenticity';
import { Static } from '@trezor/schema-utils';
import type { Params, Response } from '../params';
export type AuthenticateDeviceParams = Static<typeof AuthenticateDeviceParams>;
export declare const AuthenticateDeviceParams: import("@trezor/schema-utils").TObject<{
    config: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
        T2B1: import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
            rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
            rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
        }>, import("@trezor/schema-utils").TObject<{
            debug: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
                rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
            }>>;
        }>]>;
        T3B1: import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
            rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
            rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
        }>, import("@trezor/schema-utils").TObject<{
            debug: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
                rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
            }>>;
        }>]>;
        T3T1: import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
            rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
            rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
        }>, import("@trezor/schema-utils").TObject<{
            debug: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
                rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
            }>>;
        }>]>;
        T3W1: import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
            rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
            rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
        }>, import("@trezor/schema-utils").TObject<{
            debug: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                rootPubKeysOptiga: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
                rootPubKeysTropic: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
            }>>;
        }>]>;
    }>, import("@trezor/schema-utils").TObject<{
        T1B1: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
        T2T1: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
        UNKNOWN: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    }>]>, import("@trezor/schema-utils").TObject<{
        version: import("@trezor/schema-utils").TNumber;
    }>]>>;
    blacklistConfig: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TIntersect<[import("@trezor/schema-utils").TObject<{
        blacklistedCaPubKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    }>, import("@trezor/schema-utils").TObject<{
        version: import("@trezor/schema-utils").TNumber;
        debug: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
            blacklistedCaPubKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
        }>>;
    }>]>>;
    allowDebugKeys: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export type AuthenticateDeviceResult = {
    optigaResult: VerifyAuthenticityProofResult;
    tropicResult: VerifyAuthenticityProofResult | null;
};
export declare function authenticateDevice(params: Params<AuthenticateDeviceParams>): Response<AuthenticateDeviceResult>;
//# sourceMappingURL=authenticateDevice.d.ts.map