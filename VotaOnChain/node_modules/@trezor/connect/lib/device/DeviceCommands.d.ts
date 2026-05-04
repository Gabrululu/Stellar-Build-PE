import { MessagesSchema as Messages } from '@trezor/protobuf';
import type { TypedCallProvider } from '../device/DeviceCurrentSession';
import type { BitcoinNetworkInfo, CoinInfo } from '../types/coinInfo';
type TypedCall = Messages.TypedCall;
export type { TypedCall };
export type AccountDescriptor = {
    descriptor: string;
    legacyXpub?: string;
    address_n: number[];
    descriptorChecksum?: string;
};
export declare const DeviceCommands: (deviceTypedCall: TypedCallProvider) => {
    unlockPath: (params?: Messages.UnlockPath) => Promise<{
        type: "UnlockedPathRequest";
        message: {
            mac: string;
        };
    }>;
    getPublicKey: (params: Messages.GetPublicKey, unlock?: Messages.UnlockPath) => Promise<{
        root_fingerprint?: number | undefined;
        descriptor?: string | undefined;
        node: {
            private_key?: string | undefined;
            depth: number;
            fingerprint: number;
            child_num: number;
            chain_code: string;
            public_key: string;
        };
        xpub: string;
    }>;
    getAddress: ({ address_n, show_display, multisig, script_type, chunkify }: Messages.GetAddress, coinInfo: BitcoinNetworkInfo) => Promise<{
        mac?: string | undefined;
        address: string;
    }>;
    ethereumGetPublicKey: ({ address_n, show_display, }: Messages.EthereumGetPublicKey) => Promise<{
        node: {
            private_key?: string | undefined;
            depth: number;
            fingerprint: number;
            child_num: number;
            chain_code: string;
            public_key: string;
        };
        xpub: string;
    }>;
    ethereumGetAddress: (params: Messages.EthereumGetAddress) => Promise<{
        mac?: string | undefined;
        _old_address?: string | undefined;
        address: string;
    }>;
    getHDNode: (params: Messages.GetPublicKey, options: {
        coinInfo: BitcoinNetworkInfo;
        validation?: boolean;
        unlockPath?: Messages.UnlockPath;
    }) => Promise<{
        path: number[];
        publicKey: string;
        serializedPath: string;
    } & {
        descriptor?: string | undefined;
        xpubSegwit?: string | undefined;
        descriptorChecksum?: string | undefined;
        depth: number;
        fingerprint: number;
        xpub: string;
        childNum: number;
        chainCode: string;
    }>;
    preauthorize: (throwError: boolean) => Promise<boolean>;
    getAccountDescriptor: (coinInfo: CoinInfo, address_n: number[], derivationType?: Messages.CardanoDerivationType) => Promise<AccountDescriptor>;
    typedCall: Messages.TypedCall;
};
//# sourceMappingURL=DeviceCommands.d.ts.map