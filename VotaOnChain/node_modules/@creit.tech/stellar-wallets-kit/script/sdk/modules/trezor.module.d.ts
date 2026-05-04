import { type HardwareWalletModuleInterface, ModuleType } from "../../types/mod.js";
export declare const TREZOR_ID = "TREZOR";
/**
 * **IMPORTANT**: This module requires that you have a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
export declare class TrezorModule implements HardwareWalletModuleInterface {
    private _isAvailable;
    moduleType: ModuleType;
    productId: string;
    productName: string;
    productUrl: string;
    productIcon: string;
    constructor(params: ITrezorModuleParams);
    /**
     * `TrezorConnect` needs to be started before we can use it but because users most likely
     * won't use their devices as soon as the site loads, we return `true` since it should be already started
     * once the user needs to interact with it.
     */
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
/**
 * These values are used to start the TrezorConnect library
 */
export interface ITrezorModuleParams {
    appUrl: string;
    appName: string;
    email: string;
    debug?: boolean;
    lazyLoad?: boolean;
    coreMode?: "auto" | "iframe" | "popup";
}
//# sourceMappingURL=trezor.module.d.ts.map