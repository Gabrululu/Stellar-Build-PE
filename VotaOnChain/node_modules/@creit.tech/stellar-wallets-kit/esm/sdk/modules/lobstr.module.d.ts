import { type ModuleInterface, ModuleType } from "../../types/mod.js";
export declare const LOBSTR_ID: string;
export declare class LobstrModule implements ModuleInterface {
    moduleType: ModuleType;
    productId: string;
    productName: string;
    productUrl: string;
    productIcon: string;
    runChecks(): Promise<void>;
    isAvailable(): Promise<boolean>;
    getAddress(): Promise<{
        address: string;
    }>;
    signTransaction(xdr: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedTxXdr: string;
        signerAddress?: string;
    }>;
    signMessage(message: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedMessage: string;
        signerAddress?: string;
    }>;
    signAuthEntry(): Promise<{
        signedAuthEntry: string;
        signerAddress?: string;
    }>;
    getNetwork(): Promise<{
        network: string;
        networkPassphrase: string;
    }>;
}
//# sourceMappingURL=lobstr.module.d.ts.map