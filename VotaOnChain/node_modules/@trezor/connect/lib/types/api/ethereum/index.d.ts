import { Static } from '@trezor/schema-utils';
import { DerivationPath } from '../../params';
export type EthereumSignMessage = Static<typeof EthereumSignMessage>;
export declare const EthereumSignMessage: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    message: import("@trezor/schema-utils").TString;
    hex: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export type EthereumTransaction = Static<typeof EthereumTransaction>;
export declare const EthereumTransaction: import("@trezor/schema-utils").TObject<{
    to: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TNull]>;
    value: import("@trezor/schema-utils").TString;
    gasPrice: import("@trezor/schema-utils").TString;
    gasLimit: import("@trezor/schema-utils").TString;
    maxFeePerGas: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    maxPriorityFeePerGas: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    nonce: import("@trezor/schema-utils").TString;
    data: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    chainId: import("@trezor/schema-utils").TNumber;
    txType: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    payment_req: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
        nonce: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        recipient_name: import("@trezor/schema-utils").TString;
        memos: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
            text_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                text: import("@trezor/schema-utils").TString;
            }>>;
            refund_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                address: import("@trezor/schema-utils").TString;
                address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                mac: import("@trezor/schema-utils").TString;
            }>>;
            coin_purchase_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                coin_type: import("@trezor/schema-utils").TNumber;
                amount: import("@trezor/schema-utils").TString;
                address: import("@trezor/schema-utils").TString;
                address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                mac: import("@trezor/schema-utils").TString;
            }>>;
            text_details_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                title: import("@trezor/schema-utils").TString;
                text: import("@trezor/schema-utils").TString;
            }>>;
        }>>>;
        amount: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        signature: import("@trezor/schema-utils").TString;
    }>>;
}>;
export type EthereumAccessList = Static<typeof EthereumAccessList>;
export declare const EthereumAccessList: import("@trezor/schema-utils").TObject<{
    address: import("@trezor/schema-utils").TString;
    storageKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
}>;
export type EthereumTransactionEIP1559 = Static<typeof EthereumTransactionEIP1559>;
export declare const EthereumTransactionEIP1559: import("@trezor/schema-utils").TObject<{
    to: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TNull]>;
    value: import("@trezor/schema-utils").TString;
    gasLimit: import("@trezor/schema-utils").TString;
    gasPrice: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    nonce: import("@trezor/schema-utils").TString;
    data: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    chainId: import("@trezor/schema-utils").TNumber;
    maxFeePerGas: import("@trezor/schema-utils").TString;
    maxPriorityFeePerGas: import("@trezor/schema-utils").TString;
    accessList: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        address: import("@trezor/schema-utils").TString;
        storageKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    }>>>;
    payment_req: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
        nonce: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        recipient_name: import("@trezor/schema-utils").TString;
        memos: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
            text_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                text: import("@trezor/schema-utils").TString;
            }>>;
            refund_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                address: import("@trezor/schema-utils").TString;
                address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                mac: import("@trezor/schema-utils").TString;
            }>>;
            coin_purchase_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                coin_type: import("@trezor/schema-utils").TNumber;
                amount: import("@trezor/schema-utils").TString;
                address: import("@trezor/schema-utils").TString;
                address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                mac: import("@trezor/schema-utils").TString;
            }>>;
            text_details_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                title: import("@trezor/schema-utils").TString;
                text: import("@trezor/schema-utils").TString;
            }>>;
        }>>>;
        amount: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        signature: import("@trezor/schema-utils").TString;
    }>>;
}>;
export type EthereumSignTransaction = Static<typeof EthereumSignTransaction>;
export declare const EthereumSignTransaction: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    transaction: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TObject<{
        to: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TNull]>;
        value: import("@trezor/schema-utils").TString;
        gasPrice: import("@trezor/schema-utils").TString;
        gasLimit: import("@trezor/schema-utils").TString;
        maxFeePerGas: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
        maxPriorityFeePerGas: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
        nonce: import("@trezor/schema-utils").TString;
        data: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        chainId: import("@trezor/schema-utils").TNumber;
        txType: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
        payment_req: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
            nonce: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            recipient_name: import("@trezor/schema-utils").TString;
            memos: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
                text_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    text: import("@trezor/schema-utils").TString;
                }>>;
                refund_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    address: import("@trezor/schema-utils").TString;
                    address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                    mac: import("@trezor/schema-utils").TString;
                }>>;
                coin_purchase_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    coin_type: import("@trezor/schema-utils").TNumber;
                    amount: import("@trezor/schema-utils").TString;
                    address: import("@trezor/schema-utils").TString;
                    address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                    mac: import("@trezor/schema-utils").TString;
                }>>;
                text_details_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    title: import("@trezor/schema-utils").TString;
                    text: import("@trezor/schema-utils").TString;
                }>>;
            }>>>;
            amount: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            signature: import("@trezor/schema-utils").TString;
        }>>;
    }>, import("@trezor/schema-utils").TObject<{
        to: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TNull]>;
        value: import("@trezor/schema-utils").TString;
        gasLimit: import("@trezor/schema-utils").TString;
        gasPrice: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
        nonce: import("@trezor/schema-utils").TString;
        data: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        chainId: import("@trezor/schema-utils").TNumber;
        maxFeePerGas: import("@trezor/schema-utils").TString;
        maxPriorityFeePerGas: import("@trezor/schema-utils").TString;
        accessList: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
            address: import("@trezor/schema-utils").TString;
            storageKeys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
        }>>>;
        payment_req: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
            nonce: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            recipient_name: import("@trezor/schema-utils").TString;
            memos: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
                text_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    text: import("@trezor/schema-utils").TString;
                }>>;
                refund_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    address: import("@trezor/schema-utils").TString;
                    address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                    mac: import("@trezor/schema-utils").TString;
                }>>;
                coin_purchase_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    coin_type: import("@trezor/schema-utils").TNumber;
                    amount: import("@trezor/schema-utils").TString;
                    address: import("@trezor/schema-utils").TString;
                    address_n: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
                    mac: import("@trezor/schema-utils").TString;
                }>>;
                text_details_memo: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
                    title: import("@trezor/schema-utils").TString;
                    text: import("@trezor/schema-utils").TString;
                }>>;
            }>>>;
            amount: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            signature: import("@trezor/schema-utils").TString;
        }>>;
    }>]>;
    chunkify: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export type EthereumSignedTx = Static<typeof EthereumSignedTx>;
export declare const EthereumSignedTx: import("@trezor/schema-utils").TObject<{
    v: import("@trezor/schema-utils").TString;
    r: import("@trezor/schema-utils").TString;
    s: import("@trezor/schema-utils").TString;
    serializedTx: import("@trezor/schema-utils").TString;
}>;
type EthereumSignTypedDataTypeProperty = Static<typeof EthereumSignTypedDataTypeProperty>;
declare const EthereumSignTypedDataTypeProperty: import("@trezor/schema-utils").TObject<{
    name: import("@trezor/schema-utils").TString;
    type: import("@trezor/schema-utils").TString;
}>;
export interface EthereumSignTypedDataTypes {
    EIP712Domain: EthereumSignTypedDataTypeProperty[];
    [additionalProperties: string]: EthereumSignTypedDataTypeProperty[];
}
export declare const EthereumSignTypedDataTypes: import("@trezor/schema-utils").TObject<{
    EIP712Domain: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        name: import("@trezor/schema-utils").TString;
        type: import("@trezor/schema-utils").TString;
    }>>;
}>;
export interface EthereumSignTypedDataMessage<T extends EthereumSignTypedDataTypes> {
    types: T;
    primaryType: keyof T;
    domain: {
        name?: string;
        version?: string;
        chainId?: number | bigint | string;
        verifyingContract?: string;
        salt?: ArrayBuffer | string;
    };
    message: {
        [fieldName: string]: any;
    };
}
export declare const EthereumSignTypedDataMessage: import("@trezor/schema-utils").TObject<{
    types: import("@trezor/schema-utils").TObject<{
        EIP712Domain: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
            name: import("@trezor/schema-utils").TString;
            type: import("@trezor/schema-utils").TString;
        }>>;
    }>;
    primaryType: import("@trezor/schema-utils").TString;
    domain: import("@trezor/schema-utils").TObject<{
        name: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        version: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        chainId: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TNumber, import("@trezor/schema-utils").TBigInt, import("@trezor/schema-utils").TString]>>;
        verifyingContract: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        salt: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils/lib/custom-types/array-buffer").TArrayBuffer, import("@trezor/schema-utils").TString]>>;
    }>;
    message: import("@trezor/schema-utils").TObject<{}>;
}>;
export interface EthereumSignTypedData<T extends EthereumSignTypedDataTypes> {
    path: DerivationPath;
    data: EthereumSignTypedDataMessage<T>;
    metamask_v4_compat: boolean;
    domain_separator_hash?: undefined;
    message_hash?: undefined;
    show_message_hash?: boolean;
}
export declare const EthereumSignTypedData: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    data: import("@trezor/schema-utils").TObject<{
        types: import("@trezor/schema-utils").TObject<{
            EIP712Domain: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
                name: import("@trezor/schema-utils").TString;
                type: import("@trezor/schema-utils").TString;
            }>>;
        }>;
        primaryType: import("@trezor/schema-utils").TString;
        domain: import("@trezor/schema-utils").TObject<{
            name: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            version: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            chainId: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TNumber, import("@trezor/schema-utils").TBigInt, import("@trezor/schema-utils").TString]>>;
            verifyingContract: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            salt: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils/lib/custom-types/array-buffer").TArrayBuffer, import("@trezor/schema-utils").TString]>>;
        }>;
        message: import("@trezor/schema-utils").TObject<{}>;
    }>;
    metamask_v4_compat: import("@trezor/schema-utils").TBoolean;
    domain_separator_hash: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    message_hash: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUndefined>;
    show_message_hash: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export interface EthereumSignTypedHash<T extends EthereumSignTypedDataTypes> {
    path: DerivationPath;
    data: EthereumSignTypedDataMessage<T>;
    metamask_v4_compat: boolean;
    domain_separator_hash: string;
    message_hash?: string;
    show_message_hash?: boolean;
}
export declare const EthereumSignTypedHash: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    data: import("@trezor/schema-utils").TObject<{
        types: import("@trezor/schema-utils").TObject<{
            EIP712Domain: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
                name: import("@trezor/schema-utils").TString;
                type: import("@trezor/schema-utils").TString;
            }>>;
        }>;
        primaryType: import("@trezor/schema-utils").TString;
        domain: import("@trezor/schema-utils").TObject<{
            name: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            version: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            chainId: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TNumber, import("@trezor/schema-utils").TBigInt, import("@trezor/schema-utils").TString]>>;
            verifyingContract: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            salt: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils/lib/custom-types/array-buffer").TArrayBuffer, import("@trezor/schema-utils").TString]>>;
        }>;
        message: import("@trezor/schema-utils").TObject<{}>;
    }>;
    metamask_v4_compat: import("@trezor/schema-utils").TBoolean;
    domain_separator_hash: import("@trezor/schema-utils").TString;
    message_hash: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    show_message_hash: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export type EthereumVerifyMessage = Static<typeof EthereumVerifyMessage>;
export declare const EthereumVerifyMessage: import("@trezor/schema-utils").TObject<{
    address: import("@trezor/schema-utils").TString;
    message: import("@trezor/schema-utils").TString;
    hex: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
    signature: import("@trezor/schema-utils").TString;
}>;
export {};
//# sourceMappingURL=index.d.ts.map