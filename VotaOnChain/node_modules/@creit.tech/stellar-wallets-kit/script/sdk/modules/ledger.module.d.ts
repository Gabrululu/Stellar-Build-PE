import { type HardwareWalletModuleInterface, ModuleType } from "../../types/mod.js";
export declare const LEDGER_ID = "LEDGER";
/**
 * **IMPORTANT**: This module requires that you have a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
export declare class LedgerModule implements HardwareWalletModuleInterface {
    moduleType: ModuleType;
    productId: string;
    productName: string;
    productUrl: string;
    productIcon: string;
    private _transport?;
    transport(): Promise<any>;
    disconnect(): Promise<void>;
    isAvailable(): Promise<boolean>;
    runChecks(): Promise<void>;
    getAddress(opts?: {
        path?: string;
    }): Promise<{
        address: string;
    }>;
    /**
     * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
     * @param page - {Number}
     */
    getAddresses(page?: number): Promise<{
        publicKey: string;
        index: number;
    }[]>;
    signTransaction(xdr: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
        nonBlindTx?: boolean;
    }): Promise<{
        signedTxXdr: string;
        signerAddress?: string;
    }>;
    signAuthEntry(): Promise<{
        signedAuthEntry: string;
        signerAddress?: string;
    }>;
    signMessage(): Promise<{
        signedMessage: string;
        signerAddress?: string;
    }>;
    getNetwork(): Promise<{
        network: string;
        networkPassphrase: string;
    }>;
}
//# sourceMappingURL=ledger.module.d.ts.map