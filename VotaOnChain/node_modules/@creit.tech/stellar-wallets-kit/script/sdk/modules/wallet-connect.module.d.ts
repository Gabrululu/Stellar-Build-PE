import type { SessionTypes, SignClientTypes } from "@walletconnect/types";
import { type default as Client } from "@walletconnect/sign-client";
import { type AppKit, type CreateAppKit } from "@reown/appkit/core";
import { type ModuleInterface, ModuleType } from "../../types/mod.js";
export declare const WALLET_CONNECT_ID = "wallet_connect";
export declare class WalletConnectModule implements ModuleInterface {
    wcParams: TWalletConnectModuleParams;
    moduleType: ModuleType;
    productIcon: string;
    productId: string;
    productName: string;
    productUrl: string;
    modal: AppKit;
    signClient: Client;
    initiated: boolean;
    constructor(wcParams: TWalletConnectModuleParams);
    isAvailable(): Promise<boolean>;
    isPlatformWrapper(): Promise<boolean>;
    runChecks(): Promise<void>;
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
    signAndSubmitTransaction(xdr: string, opts?: {
        networkPassphrase?: string;
        address?: string;
    }): Promise<{
        status: "success" | "pending";
    }>;
    disconnect(): Promise<void>;
    getSessions(): Promise<SessionTypes.Struct[]>;
    closeSession(topic: string, reason?: string): Promise<void>;
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
export type TWalletConnectModuleParams = {
    projectId: string;
    metadata: Required<CreateAppKit>["metadata"];
    allowedChains?: WalletConnectTargetChain[];
    signClientOptions?: SignClientTypes.Options;
    appKitOptions?: CreateAppKit;
};
export declare enum WalletConnectTargetChain {
    PUBLIC = "stellar:pubnet",
    TESTNET = "stellar:testnet"
}
/**
 * Wallet connect supports both just signing a xdr or signing and sending the transaction to the network.
 * SIGN returns the signed XDR, while SIGN_AND_SUBMIT sends the transaction to the network (useful for multisig).
 */
export declare enum WalletConnectAllowedMethods {
    SIGN = "stellar_signXDR",
    SIGN_AND_SUBMIT = "stellar_signAndSubmitXDR"
}
//# sourceMappingURL=wallet-connect.module.d.ts.map