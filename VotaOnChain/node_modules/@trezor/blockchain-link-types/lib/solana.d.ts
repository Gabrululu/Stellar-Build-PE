export type SolanaTokenAccountInfo = {
    address: string;
    mint: string | undefined;
    decimals: number | undefined;
};
export type SolanaStakingAccount = {
    status: string;
    stake?: string;
    rentExemptReserve: string;
};
export declare const StakeState: {
    Inactive: string;
    Activating: string;
    Active: string;
    Deactivating: string;
    Deactivated: string;
};
//# sourceMappingURL=solana.d.ts.map