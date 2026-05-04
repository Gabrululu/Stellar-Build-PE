import { Static } from '@trezor/schema-utils';
import type { Params, Response } from '../params';
export type LoginChallenge = Static<typeof LoginChallenge>;
export declare const LoginChallenge: import("@trezor/schema-utils").TObject<{
    challengeHidden: import("@trezor/schema-utils").TString;
    challengeVisual: import("@trezor/schema-utils").TString;
    origin: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    asyncChallenge: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    callback: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
}>;
export type RequestLoginSchema = Static<typeof RequestLoginSchema>;
export declare const RequestLoginSchema: import("@trezor/schema-utils").TObject<{
    challengeHidden: import("@trezor/schema-utils").TString;
    challengeVisual: import("@trezor/schema-utils").TString;
    origin: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    asyncChallenge: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    callback: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
}>;
export interface Login {
    address: string;
    publicKey: string;
    signature: string;
}
export declare function requestLogin(params: Params<RequestLoginSchema>): Response<Login>;
//# sourceMappingURL=requestLogin.d.ts.map