import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { Static } from '@trezor/schema-utils';
import type { Params, Response } from '../params';
export type CancelCoinjoinAuthorization = Static<typeof CancelCoinjoinAuthorization>;
export declare const CancelCoinjoinAuthorization: import("@trezor/schema-utils").TObject<{
    preauthorized: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export declare function cancelCoinjoinAuthorization(params: Params<CancelCoinjoinAuthorization>): Response<PROTO.Success>;
//# sourceMappingURL=cancelCoinjoinAuthorization.d.ts.map