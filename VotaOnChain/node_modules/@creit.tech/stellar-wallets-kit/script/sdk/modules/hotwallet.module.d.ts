import { type ModuleInterface, ModuleType } from "../../types/mod.js";
export declare const HOTWALLET_ID: string;
/**
 * **IMPORTANT**: This module requires that you have a "global" and a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
export declare class HotWalletModule implements ModuleInterface {
    moduleType: ModuleType;
    productId: string;
    productName: string;
    productUrl: string;
    productIcon: string;
    isAvailable(): Promise<boolean>;
    getAddress(): Promise<{
        address: string;
    }>;
    signTransaction(xdr: string, opts?: {
        address?: string;
    }): Promise<{
        signedTxXdr: string;
        signerAddress?: string;
    }>;
    signAuthEntry(authEntry: string, opts?: {
        address?: string;
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
//# sourceMappingURL=hotwallet.module.d.ts.map