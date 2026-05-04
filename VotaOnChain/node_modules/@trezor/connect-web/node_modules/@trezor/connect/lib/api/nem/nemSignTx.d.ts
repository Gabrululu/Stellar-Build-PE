import { PROTO } from '../../constants';
import * as $T from '../../types/api/nem';
export declare const createTx: (tx: $T.NEMTransaction, address_n: number[], chunkify?: boolean) => {
    chunkify?: boolean | undefined;
    multisig?: {
        network?: number | undefined;
        address_n?: number[] | undefined;
        signer?: string | undefined;
        fee: string | number;
        timestamp: number;
        deadline: number;
    } | undefined;
    transfer?: {
        payload?: string | undefined;
        public_key?: string | undefined;
        mosaics?: {
            quantity: number;
            namespace: string;
            mosaic: string;
        }[] | undefined;
        amount: string | number;
        recipient: string;
    } | undefined;
    cosigning?: boolean | undefined;
    provision_namespace?: {
        parent?: string | undefined;
        fee: string | number;
        namespace: string;
        sink: string;
    } | undefined;
    mosaic_creation?: {
        fee: string | number;
        sink: string;
        definition: {
            name?: string | undefined;
            fee?: string | number | undefined;
            ticker?: string | undefined;
            divisibility?: number | undefined;
            levy?: PROTO.NEMMosaicLevy | undefined;
            levy_address?: string | undefined;
            levy_namespace?: string | undefined;
            levy_mosaic?: string | undefined;
            supply?: number | undefined;
            mutable_supply?: boolean | undefined;
            transferable?: boolean | undefined;
            networks?: number[] | undefined;
            description: string;
            namespace: string;
            mosaic: string;
        };
    } | undefined;
    supply_change?: {
        type: PROTO.NEMSupplyChangeType;
        namespace: string;
        mosaic: string;
        delta: number;
    } | undefined;
    aggregate_modification?: {
        modifications?: {
            type: PROTO.NEMModificationType;
            public_key: string;
        }[] | undefined;
        relative_change?: number | undefined;
    } | undefined;
    importance_transfer?: {
        public_key: string;
        mode: PROTO.NEMImportanceTransferMode;
    } | undefined;
    transaction: {
        network?: number | undefined;
        address_n?: number[] | undefined;
        signer?: string | undefined;
        fee: string | number;
        timestamp: number;
        deadline: number;
    };
};
//# sourceMappingURL=nemSignTx.d.ts.map