import { FreighterApiError } from "@shared/api/types";
export declare const signAuthEntry: (entryXdr: string, opts?: {
    networkPassphrase?: string;
    address?: string;
}) => Promise<{
    signedAuthEntry: string | null;
    signerAddress: string;
} & {
    error?: FreighterApiError;
}>;
