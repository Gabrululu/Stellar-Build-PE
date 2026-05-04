import { Static } from '@trezor/schema-utils';
import { PROTO } from '../../../constants';
export type TronContracts = Static<typeof TronContracts>;
export declare const TronContracts: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TObject<{
    type: import("@trezor/schema-utils").TLiteral<"TransferContract">;
    parameter: import("@trezor/schema-utils").TObject<{
        value: import("@trezor/schema-utils").TObject<{
            owner_address: import("@trezor/schema-utils").TString;
            to_address: import("@trezor/schema-utils").TString;
            amount: import("@trezor/schema-utils/lib/custom-types/uint").TUint;
        }>;
    }>;
}>, import("@trezor/schema-utils").TObject<{
    type: import("@trezor/schema-utils").TLiteral<"TriggerSmartContract">;
    parameter: import("@trezor/schema-utils").TObject<{
        value: import("@trezor/schema-utils").TObject<{
            owner_address: import("@trezor/schema-utils").TString;
            contract_address: import("@trezor/schema-utils").TString;
            data: import("@trezor/schema-utils").TString;
        }>;
    }>;
}>, import("@trezor/schema-utils").TObject<{
    type: import("@trezor/schema-utils").TLiteral<"FreezeBalanceV2Contract">;
    parameter: import("@trezor/schema-utils").TObject<{
        value: import("@trezor/schema-utils").TObject<{
            owner_address: import("@trezor/schema-utils").TString;
            balance: import("@trezor/schema-utils").TNumber;
            resource: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.TronResourceCode>>;
        }>;
    }>;
}>, import("@trezor/schema-utils").TObject<{
    type: import("@trezor/schema-utils").TLiteral<"UnfreezeBalanceV2Contract">;
    parameter: import("@trezor/schema-utils").TObject<{
        value: import("@trezor/schema-utils").TObject<{
            owner_address: import("@trezor/schema-utils").TString;
            balance: import("@trezor/schema-utils").TNumber;
            resource: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.TronResourceCode>>;
        }>;
    }>;
}>, import("@trezor/schema-utils").TObject<{
    type: import("@trezor/schema-utils").TLiteral<"WithdrawExpireUnfreezeContract">;
    parameter: import("@trezor/schema-utils").TObject<{
        value: import("@trezor/schema-utils").TObject<{
            owner_address: import("@trezor/schema-utils").TString;
        }>;
    }>;
}>]>;
export type TronContractsTypes = TronContracts['type'];
export type TronContractsParameters = TronContracts['parameter']['value'];
export type TronSignTransaction = Static<typeof TronSignTransaction>;
export declare const TronSignTransaction: import("@trezor/schema-utils").TObject<{
    path: import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TString, import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TNumber>]>;
    ref_block_bytes: import("@trezor/schema-utils").TString;
    ref_block_hash: import("@trezor/schema-utils").TString;
    expiration: import("@trezor/schema-utils").TNumber;
    timestamp: import("@trezor/schema-utils").TNumber;
    fee_limit: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TNumber>;
    data: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TString>;
    contract: import("@trezor/schema-utils").TArray<import("@trezor/schema-utils").TUnion<[import("@trezor/schema-utils").TObject<{
        type: import("@trezor/schema-utils").TLiteral<"TransferContract">;
        parameter: import("@trezor/schema-utils").TObject<{
            value: import("@trezor/schema-utils").TObject<{
                owner_address: import("@trezor/schema-utils").TString;
                to_address: import("@trezor/schema-utils").TString;
                amount: import("@trezor/schema-utils/lib/custom-types/uint").TUint;
            }>;
        }>;
    }>, import("@trezor/schema-utils").TObject<{
        type: import("@trezor/schema-utils").TLiteral<"TriggerSmartContract">;
        parameter: import("@trezor/schema-utils").TObject<{
            value: import("@trezor/schema-utils").TObject<{
                owner_address: import("@trezor/schema-utils").TString;
                contract_address: import("@trezor/schema-utils").TString;
                data: import("@trezor/schema-utils").TString;
            }>;
        }>;
    }>, import("@trezor/schema-utils").TObject<{
        type: import("@trezor/schema-utils").TLiteral<"FreezeBalanceV2Contract">;
        parameter: import("@trezor/schema-utils").TObject<{
            value: import("@trezor/schema-utils").TObject<{
                owner_address: import("@trezor/schema-utils").TString;
                balance: import("@trezor/schema-utils").TNumber;
                resource: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.TronResourceCode>>;
            }>;
        }>;
    }>, import("@trezor/schema-utils").TObject<{
        type: import("@trezor/schema-utils").TLiteral<"UnfreezeBalanceV2Contract">;
        parameter: import("@trezor/schema-utils").TObject<{
            value: import("@trezor/schema-utils").TObject<{
                owner_address: import("@trezor/schema-utils").TString;
                balance: import("@trezor/schema-utils").TNumber;
                resource: import("@trezor/schema-utils").TOptional<import("@trezor/schema-utils").TEnum<typeof PROTO.TronResourceCode>>;
            }>;
        }>;
    }>, import("@trezor/schema-utils").TObject<{
        type: import("@trezor/schema-utils").TLiteral<"WithdrawExpireUnfreezeContract">;
        parameter: import("@trezor/schema-utils").TObject<{
            value: import("@trezor/schema-utils").TObject<{
                owner_address: import("@trezor/schema-utils").TString;
            }>;
        }>;
    }>]>>;
}>;
export type TronSignedTx = Static<typeof TronSignedTx>;
export declare const TronSignedTx: import("@trezor/schema-utils").TObject<{
    signature: import("@trezor/schema-utils").TString;
}>;
//# sourceMappingURL=index.d.ts.map