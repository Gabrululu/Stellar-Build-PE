import { MessagesSchema as PROTO } from '@trezor/protobuf';
import type { DeviceAuthenticityBlacklistConfig } from './config/deviceAuthenticityBlacklistConfigTypes';
import type { DeviceAuthenticityConfig } from './config/deviceAuthenticityConfigTypes';
export declare const getRandomChallenge: () => Buffer<ArrayBufferLike>;
type GetRootPubKeyBlacklistParams = {
    blacklistConfig: DeviceAuthenticityBlacklistConfig;
    allowDebugKeys?: boolean;
};
export declare const getRootPubKeyBlacklist: ({ blacklistConfig, allowDebugKeys, }: GetRootPubKeyBlacklistParams) => string[];
type GetRootPubKeysParams = {
    config: DeviceAuthenticityConfig;
    deviceModel: keyof typeof PROTO.DeviceModelInternal;
    allowDebugKeys?: boolean;
};
export declare const getRootPubKeys: ({ config, deviceModel, allowDebugKeys, }: GetRootPubKeysParams) => string[];
export {};
//# sourceMappingURL=utils.d.ts.map