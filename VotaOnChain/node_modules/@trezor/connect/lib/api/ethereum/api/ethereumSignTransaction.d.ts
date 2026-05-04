import { MessagesSchema } from '@trezor/protobuf';
import { AbstractMethod } from '../../../core/AbstractMethod';
import { EthereumNetworkInfoDefinitionValues, TokenInfo } from '../../../types';
import type { EthereumTransaction, EthereumTransactionEIP1559 } from '../../../types/api/ethereum';
type Params = {
    path: number[];
    network?: EthereumNetworkInfoDefinitionValues;
    definitions?: MessagesSchema.EthereumDefinitions;
    chunkify: boolean;
} & ({
    type: 'legacy';
    tx: EthereumTransaction;
} | {
    type: 'eip1559';
    tx: EthereumTransactionEIP1559;
});
export default class EthereumSignTransaction extends AbstractMethod<'ethereumSignTransaction', Params> {
    init(): void;
    initAsync(): Promise<void>;
    get info(): string;
    payloadToPrecomposed(): Promise<{
        type: "final";
        inputs: never[];
        outputsPermutation: number[];
        outputs: {
            address: string;
            amount: string;
            script_type: "PAYTOADDRESS";
        }[];
        totalSpent: string;
        fee: string;
        feePerByte: string;
        maxFeePerGas: string | undefined;
        maxPriorityFeePerGas: string | undefined;
        feeLimit: string;
        bytes: number;
        max: undefined;
        isTokenKnown: boolean;
        token: TokenInfo | undefined;
        nativeToken: {
            type: string;
            standard: string;
            contract: string;
            name: string;
            symbol: string;
            decimals: number;
        } | undefined;
        network: ({
            blockchainLink?: {
                type: string;
                url: string[];
            } | undefined;
            label: string;
            name: string;
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
        }) | undefined;
    } | undefined>;
    run(): Promise<{
        serializedTx: string;
        v: `0x${string}`;
        r: `0x${string}`;
        s: `0x${string}`;
    }>;
}
export {};
//# sourceMappingURL=ethereumSignTransaction.d.ts.map