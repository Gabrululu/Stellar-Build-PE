import { type ModuleInterface, ModuleType } from "../../types/mod.js";
export declare const ONEKEY_ID: string;
export declare class OneKeyModule implements ModuleInterface {
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
    signAuthEntry(authEntry: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedAuthEntry: string;
        signerAddress?: string;
    }>;
    signMessage(message: string, opts?: {
        address?: string;
    }): Promise<{
        signedMessage: string;
        signerAddress?: string;
    }>;
    getNetwork(): Promise<{
        network: string;
        networkPassphrase: string;
    }>;
}
//# sourceMappingURL=onekey.module.d.ts.map