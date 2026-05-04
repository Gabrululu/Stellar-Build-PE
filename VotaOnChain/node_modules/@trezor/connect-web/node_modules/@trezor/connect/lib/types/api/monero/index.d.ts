import { Static } from '@trezor/schema-utils';
import { PROTO } from '../../../constants';
import { Address as AddressShared } from '../../params';
export type MoneroNetworkType = PROTO.MoneroNetworkType;
export type MoneroGetAddress = Static<typeof MoneroGetAddress>;
export declare const MoneroGetAddress: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    address: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    showOnTrezor: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
    networkType: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.MoneroNetworkType>>;
    account: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    minor: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    paymentId: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    chunkify: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export type MoneroAddress = AddressShared;
export type MoneroGetWatchKey = Static<typeof MoneroGetWatchKey>;
export declare const MoneroGetWatchKey: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    networkType: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.MoneroNetworkType>>;
}>;
export type MoneroWatchKey = Static<typeof MoneroWatchKey>;
export declare const MoneroWatchKey: import("@trezor/schema-utils").TObject<{
    watch_key: import("@trezor/schema-utils").TString;
    address: import("@trezor/schema-utils").TString;
}>;
export type MoneroTransferDetails = Static<typeof MoneroTransferDetails>;
export declare const MoneroTransferDetails: import("@trezor/schema-utils").TObject<{
    out_key: import("@trezor/schema-utils").TString;
    tx_pub_key: import("@trezor/schema-utils").TString;
    additional_tx_pub_keys: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>, import("@trezor/schema-utils").TString]>>;
    internal_output_index: import("@trezor/schema-utils").TNumber;
    sub_addr_major: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    sub_addr_minor: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
}>;
export type MoneroSubAddressIndicesList = Static<typeof MoneroSubAddressIndicesList>;
export declare const MoneroSubAddressIndicesList: import("@trezor/schema-utils").TObject<{
    account: import("@trezor/schema-utils").TNumber;
    minor_indices: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
}>;
export type MoneroKeyImageSync = Static<typeof MoneroKeyImageSync>;
export declare const MoneroKeyImageSync: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    networkType: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.MoneroNetworkType>>;
    subs: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        account: import("@trezor/schema-utils").TNumber;
        minor_indices: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
    }>>>;
    tdis: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        out_key: import("@trezor/schema-utils").TString;
        tx_pub_key: import("@trezor/schema-utils").TString;
        additional_tx_pub_keys: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>, import("@trezor/schema-utils").TString]>>;
        internal_output_index: import("@trezor/schema-utils").TNumber;
        sub_addr_major: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
        sub_addr_minor: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    }>>;
}>;
export type MoneroExportedKeyImage = Static<typeof MoneroExportedKeyImage>;
export declare const MoneroExportedKeyImage: import("@trezor/schema-utils").TObject<{
    iv: import("@trezor/schema-utils").TString;
    key_image: import("@trezor/schema-utils").TString;
}>;
export type MoneroKeyImageSyncResult = Static<typeof MoneroKeyImageSyncResult>;
export declare const MoneroKeyImageSyncResult: import("@trezor/schema-utils").TObject<{
    key_images: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        iv: import("@trezor/schema-utils").TString;
        key_image: import("@trezor/schema-utils").TString;
    }>>;
    signature: import("@trezor/schema-utils").TString;
}>;
export type MoneroOutputEntry = Static<typeof MoneroOutputEntry>;
export declare const MoneroOutputEntry: import("@trezor/schema-utils").TObject<{
    idx: import("@trezor/schema-utils").TNumber;
    key: import("@trezor/schema-utils").TObject<{
        dest: import("@trezor/schema-utils").TString;
        commitment: import("@trezor/schema-utils").TString;
    }>;
}>;
export type MoneroMultisigKLRki = Static<typeof MoneroMultisigKLRki>;
export declare const MoneroMultisigKLRki: import("@trezor/schema-utils").TObject<{
    K: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    L: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    R: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    ki: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
}>;
export type MoneroTransactionSourceEntry = Static<typeof MoneroTransactionSourceEntry>;
export declare const MoneroTransactionSourceEntry: import("@trezor/schema-utils").TObject<{
    outputs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        idx: import("@trezor/schema-utils").TNumber;
        key: import("@trezor/schema-utils").TObject<{
            dest: import("@trezor/schema-utils").TString;
            commitment: import("@trezor/schema-utils").TString;
        }>;
    }>>;
    real_output: import("@trezor/schema-utils").TNumber;
    real_out_tx_key: import("@trezor/schema-utils").TString;
    real_out_additional_tx_keys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    real_output_in_tx_index: import("@trezor/schema-utils").TNumber;
    amount: import("@trezor/schema-utils").TNumber;
    rct: import("@trezor/schema-utils").TBoolean;
    mask: import("@trezor/schema-utils").TString;
    subaddr_minor: import("@trezor/schema-utils").TNumber;
    multisig_kLRki: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
        K: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        L: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        R: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        ki: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    }>>;
}>;
export type MoneroAccountPublicAddress = Static<typeof MoneroAccountPublicAddress>;
export declare const MoneroAccountPublicAddress: import("@trezor/schema-utils").TObject<{
    spend_public_key: import("@trezor/schema-utils").TString;
    view_public_key: import("@trezor/schema-utils").TString;
}>;
export type MoneroTransactionDestinationEntry = Static<typeof MoneroTransactionDestinationEntry>;
export declare const MoneroTransactionDestinationEntry: import("@trezor/schema-utils").TObject<{
    amount: import("@trezor/schema-utils").TNumber;
    addr: import("@trezor/schema-utils").TObject<{
        spend_public_key: import("@trezor/schema-utils").TString;
        view_public_key: import("@trezor/schema-utils").TString;
    }>;
    is_subaddress: import("@trezor/schema-utils").TBoolean;
    original: import("@trezor/schema-utils").TString;
    is_integrated: import("@trezor/schema-utils").TBoolean;
}>;
export type MoneroTransactionRsigData = Static<typeof MoneroTransactionRsigData>;
export declare const MoneroTransactionRsigData: import("@trezor/schema-utils").TObject<{
    rsig_type: import("@trezor/schema-utils").TNumber;
    offload_type: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    grouping: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
    mask: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    rsig: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    rsig_parts: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
    bp_version: import("@trezor/schema-utils").TNumber;
}>;
export type MoneroTransactionData = Static<typeof MoneroTransactionData>;
export declare const MoneroTransactionData: import("@trezor/schema-utils").TObject<{
    version: import("@trezor/schema-utils").TNumber;
    payment_id: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    unlock_time: import("@trezor/schema-utils").TNumber;
    outputs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        amount: import("@trezor/schema-utils").TNumber;
        addr: import("@trezor/schema-utils").TObject<{
            spend_public_key: import("@trezor/schema-utils").TString;
            view_public_key: import("@trezor/schema-utils").TString;
        }>;
        is_subaddress: import("@trezor/schema-utils").TBoolean;
        original: import("@trezor/schema-utils").TString;
        is_integrated: import("@trezor/schema-utils").TBoolean;
    }>>;
    change_dts: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
        amount: import("@trezor/schema-utils").TNumber;
        addr: import("@trezor/schema-utils").TObject<{
            spend_public_key: import("@trezor/schema-utils").TString;
            view_public_key: import("@trezor/schema-utils").TString;
        }>;
        is_subaddress: import("@trezor/schema-utils").TBoolean;
        original: import("@trezor/schema-utils").TString;
        is_integrated: import("@trezor/schema-utils").TBoolean;
    }>>;
    num_inputs: import("@trezor/schema-utils").TNumber;
    mixin: import("@trezor/schema-utils").TNumber;
    fee: import("@trezor/schema-utils").TNumber;
    account: import("@trezor/schema-utils").TNumber;
    rsig_data: import("@trezor/schema-utils").TObject<{
        rsig_type: import("@trezor/schema-utils").TNumber;
        offload_type: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
        grouping: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
        mask: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        rsig: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        rsig_parts: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
        bp_version: import("@trezor/schema-utils").TNumber;
    }>;
    minor_indices: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>>;
    integrated_indices: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>>;
    client_version: import("@trezor/schema-utils").TNumber;
    hard_fork: import("@trezor/schema-utils").TNumber;
    monero_version: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    chunkify: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
}>;
export type MoneroSignTransaction = Static<typeof MoneroSignTransaction>;
export declare const MoneroSignTransaction: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    networkType: import("@trezor/schema-utils").TEnum<typeof PROTO.MoneroNetworkType>;
    tsx_data: import("@trezor/schema-utils").TObject<{
        version: import("@trezor/schema-utils").TNumber;
        payment_id: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        unlock_time: import("@trezor/schema-utils").TNumber;
        outputs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
            amount: import("@trezor/schema-utils").TNumber;
            addr: import("@trezor/schema-utils").TObject<{
                spend_public_key: import("@trezor/schema-utils").TString;
                view_public_key: import("@trezor/schema-utils").TString;
            }>;
            is_subaddress: import("@trezor/schema-utils").TBoolean;
            original: import("@trezor/schema-utils").TString;
            is_integrated: import("@trezor/schema-utils").TBoolean;
        }>>;
        change_dts: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
            amount: import("@trezor/schema-utils").TNumber;
            addr: import("@trezor/schema-utils").TObject<{
                spend_public_key: import("@trezor/schema-utils").TString;
                view_public_key: import("@trezor/schema-utils").TString;
            }>;
            is_subaddress: import("@trezor/schema-utils").TBoolean;
            original: import("@trezor/schema-utils").TString;
            is_integrated: import("@trezor/schema-utils").TBoolean;
        }>>;
        num_inputs: import("@trezor/schema-utils").TNumber;
        mixin: import("@trezor/schema-utils").TNumber;
        fee: import("@trezor/schema-utils").TNumber;
        account: import("@trezor/schema-utils").TNumber;
        rsig_data: import("@trezor/schema-utils").TObject<{
            rsig_type: import("@trezor/schema-utils").TNumber;
            offload_type: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
            grouping: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>;
            mask: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            rsig: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            rsig_parts: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>>;
            bp_version: import("@trezor/schema-utils").TNumber;
        }>;
        minor_indices: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>>;
        integrated_indices: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>>;
        client_version: import("@trezor/schema-utils").TNumber;
        hard_fork: import("@trezor/schema-utils").TNumber;
        monero_version: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        chunkify: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TBoolean>;
    }>;
    inputs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
        outputs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TObject<{
            idx: import("@trezor/schema-utils").TNumber;
            key: import("@trezor/schema-utils").TObject<{
                dest: import("@trezor/schema-utils").TString;
                commitment: import("@trezor/schema-utils").TString;
            }>;
        }>>;
        real_output: import("@trezor/schema-utils").TNumber;
        real_out_tx_key: import("@trezor/schema-utils").TString;
        real_out_additional_tx_keys: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
        real_output_in_tx_index: import("@trezor/schema-utils").TNumber;
        amount: import("@trezor/schema-utils").TNumber;
        rct: import("@trezor/schema-utils").TBoolean;
        mask: import("@trezor/schema-utils").TString;
        subaddr_minor: import("@trezor/schema-utils").TNumber;
        multisig_kLRki: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TObject<{
            K: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            L: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            R: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
            ki: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        }>>;
    }>>;
}>;
export type MoneroRingCtSig = Static<typeof MoneroRingCtSig>;
export declare const MoneroRingCtSig: import("@trezor/schema-utils").TObject<{
    txn_fee: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    message: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    rv_type: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
}>;
export type MoneroSignedTransaction = Static<typeof MoneroSignedTransaction>;
export declare const MoneroSignedTransaction: import("@trezor/schema-utils").TObject<{
    signatures: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    tx_prefix_hash: import("@trezor/schema-utils").TString;
    rv: import("@trezor/schema-utils").TObject<{
        txn_fee: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
        message: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
        rv_type: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    }>;
    cout_key: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    salt: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    rand_mult: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    tx_enc_keys: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    opening_key: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    pseudo_outs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    out_pks: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    ecdh_infos: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    tx_outs: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    rsig_parts: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TString>;
    extra: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
}>;
//# sourceMappingURL=index.d.ts.map