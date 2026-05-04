import { type ModuleInterface, ModuleType } from "../../types/mod.js";
export declare const BITGET_WALLET_ID = "BitgetWallet";
export declare class BitgetModule implements ModuleInterface {
    moduleType: ModuleType;
    productId: string;
    productName: string;
    productUrl: string;
    productIcon: string;
    provider: any;
    constructor();
    runChecks(): Promise<void>;
    isAvailable(): Promise<boolean>;
    getAddress(): Promise<{
        address: string;
    }>;
    signMessage(message: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedMessage: string;
        signerAddress?: string;
    }>;
    signTransaction(xdr: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
        submit?: boolean;
        submitUrl?: string;
    }): Promise<{
        signedTxXdr: string;
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
//# sourceMappingURL=bitget.module.d.ts.map