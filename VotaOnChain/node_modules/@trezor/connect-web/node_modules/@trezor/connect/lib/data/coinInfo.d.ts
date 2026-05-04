import type { BitcoinNetworkInfo } from '../types/coinInfo';
import type { DerivationPath } from '../types/params';
export declare const getBitcoinNetwork: (pathOrName: DerivationPath) => Readonly<{
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
}>;
export declare const getEthereumNetwork: (pathOrNetworkSymbol: DerivationPath) => Readonly<{
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
}>;
export declare const getMiscNetwork: (pathOrName: DerivationPath) => Readonly<{
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
}>;
export declare const getSegwitNetwork: (coin: BitcoinNetworkInfo) => {
    bip32: {
        public: number;
        private: number;
    };
    forkId?: number | undefined;
    messagePrefix: string;
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
} | null;
export declare const getBech32Network: (coin: BitcoinNetworkInfo) => {
    bip32: {
        public: number;
        private: number;
    };
    forkId?: number | undefined;
    messagePrefix: string;
    bech32: string;
    pubKeyHash: number;
    scriptHash: number;
    wif: number;
} | null;
export declare const fixCoinInfoNetwork: (ci: BitcoinNetworkInfo, path: number[]) => {
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
};
export declare const getCoinInfo: (currency: string) => Readonly<{
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
}>;
export declare const getCoinName: (path: number[]) => string;
export declare const ethereumNetworkInfoBase: {
    type: "ethereum";
    decimals: number;
};
export declare const parseCoinsJson: (json: any) => void;
export declare const getUniqueNetworks: <T extends {
    shortcut: string;
}>(networks: (T | undefined)[]) => T[];
export declare const getAllNetworks: () => (({
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
}))[];
//# sourceMappingURL=coinInfo.d.ts.map