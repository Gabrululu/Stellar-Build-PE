import { AbstractMethod } from '../core/AbstractMethod';
import { CoinInfo } from '../types';
type Params = {
    coinInfo: CoinInfo;
};
export default class GetCoinInfo extends AbstractMethod<'getCoinInfo', Params> {
    init(): void;
    run(): Promise<({
        blockchainLink?: {
            type: string;
            url: string[];
        } | undefined;
        label: string;
        name: string;
        blockTime: number;
        minFee: number;
        maxFee: number;
        minPriorityFee: number;
        defaultFees: {
            feePerTx?: string | undefined;
            feeLimit?: string | undefined;
            baseFeePerGas?: string | undefined;
            maxFeePerGas?: string | undefined;
            maxPriorityFeePerGas?: string | undefined;
            label: "normal" | "custom" | "high" | "economy" | "low";
            blocks: number;
            feePerUnit: string;
        }[];
        shortcut: string;
        slip44: number;
        support: {
            T1B1: string | false;
            T2T1: string | false;
            T2B1: string | false;
            T3B1: string | false;
            T3T1: string | false;
            T3W1: string | false;
            UNKNOWN: string | false;
            connect: boolean;
        };
        decimals: number;
    } & {
        taproot?: boolean | undefined;
        cashAddrPrefix?: string | undefined;
        xPubMagicSegwitNative?: number | undefined;
        xPubMagicSegwit?: number | undefined;
        type: "bitcoin";
        dustLimit: number;
        curveName: string;
        forceBip143: boolean;
        hashGenesisBlock: string;
        maxAddressLength: number;
        maxFeeSatoshiKb: number;
        minAddressLength: number;
        minFeeSatoshiKb: number;
        segwit: boolean;
        xPubMagic: number;
        network: {
            forkId?: number | undefined;
            messagePrefix: string;
            bech32: string;
            bip32: {
                public: number;
                private: number;
            };
            pubKeyHash: number;
            scriptHash: number;
            wif: number;
        };
        isBitcoin: boolean;
    }) | ({
        blockchainLink?: {
            type: string;
            url: string[];
        } | undefined;
        label: string;
        name: string;
        blockTime: number;
        minFee: number;
        maxFee: number;
        minPriorityFee: number;
        defaultFees: {
            feePerTx?: string | undefined;
            feeLimit?: string | undefined;
            baseFeePerGas?: string | undefined;
            maxFeePerGas?: string | undefined;
            maxPriorityFeePerGas?: string | undefined;
            label: "normal" | "custom" | "high" | "economy" | "low";
            blocks: number;
            feePerUnit: string;
        }[];
        shortcut: string;
        slip44: number;
        support: {
            T1B1: string | false;
            T2T1: string | false;
            T2B1: string | false;
            T3B1: string | false;
            T3T1: string | false;
            T3W1: string | false;
            UNKNOWN: string | false;
            connect: boolean;
        };
        decimals: number;
    } & {
        network?: undefined;
        type: "ethereum";
        chainId: number;
    }) | ({
        blockchainLink?: {
            type: string;
            url: string[];
        } | undefined;
        label: string;
        name: string;
        blockTime: number;
        minFee: number;
        maxFee: number;
        minPriorityFee: number;
        defaultFees: {
            feePerTx?: string | undefined;
            feeLimit?: string | undefined;
            baseFeePerGas?: string | undefined;
            maxFeePerGas?: string | undefined;
            maxPriorityFeePerGas?: string | undefined;
            label: "normal" | "custom" | "high" | "economy" | "low";
            blocks: number;
            feePerUnit: string;
        }[];
        shortcut: string;
        slip44: number;
        support: {
            T1B1: string | false;
            T2T1: string | false;
            T2B1: string | false;
            T3B1: string | false;
            T3T1: string | false;
            T3W1: string | false;
            UNKNOWN: string | false;
            connect: boolean;
        };
        decimals: number;
    } & {
        network?: undefined;
        type: "nem" | "misc";
        curve: string;
    })>;
}
export {};
//# sourceMappingURL=getCoinInfo.d.ts.map