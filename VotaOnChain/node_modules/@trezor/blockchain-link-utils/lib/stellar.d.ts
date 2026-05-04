import { Horizon, Memo, Operation, Transaction as StellarTransaction } from '@stellar/stellar-sdk';
import type { TokenDetailByMint, Transaction } from '@trezor/blockchain-link-types';
import type { StellarAsset } from '@trezor/protobuf/lib/messages';
export declare const STELLAR_DECIMALS = 7;
export declare const toStroops: (value: string) => globalThis.BigNumber;
export declare const BASE_INFO: {
    BASE_RESERVE: globalThis.BigNumber;
    MINIMUM_RESERVE: globalThis.BigNumber;
};
export declare const transformTransaction: (rawTx: Horizon.ServerApi.TransactionRecord, descriptor: string, tokenDetailByMint: TokenDetailByMint) => Transaction;
type CreateTransactionBuilderParams = {
    descriptor: string;
    sequence: string;
    fee: string;
    isTestnet?: boolean;
};
type BuildTrustlineTransactionParams = CreateTransactionBuilderParams & {
    asset: StellarAsset;
    limit?: string;
};
type BuildSendTransactionParams = CreateTransactionBuilderParams & {
    destinationActivated: boolean;
    destination: string;
    amount: string;
    asset: StellarAsset;
    destinationTag?: string;
};
export declare const buildSendTransaction: ({ descriptor, sequence, fee, destinationActivated, destination, amount, asset, destinationTag, isTestnet, }: BuildSendTransactionParams) => StellarTransaction<Memo<import("@stellar/stellar-base").MemoType>, Operation[]>;
type BuildTrustlineParams = Omit<BuildTrustlineTransactionParams, 'limit'>;
export declare const buildAddTrustlineTransaction: ({ descriptor, sequence, fee, asset, isTestnet, }: BuildTrustlineParams) => StellarTransaction<Memo<import("@stellar/stellar-base").MemoType>, Operation[]>;
export declare const buildRemoveTrustlineTransaction: ({ descriptor, sequence, fee, asset, isTestnet, }: BuildTrustlineParams) => StellarTransaction<Memo<import("@stellar/stellar-base").MemoType>, Operation[]>;
export declare const getTokenMetadata: () => Promise<TokenDetailByMint>;
export declare const isValidAssetCode: (code: string) => boolean;
export declare const isValidAddress: (address: string) => boolean;
export {};
//# sourceMappingURL=stellar.d.ts.map