import { type AuthModalParams, type ISupportedWallet, type KitEventDisconnected, type KitEventStateUpdated, KitEventType, type KitEventWalletSelected, type ModuleInterface, type Networks, type ProfileModalParams, type StellarWalletsKitInitParams, type SwkAppTheme } from "../types/mod.js";
import { type SwkButtonProps } from "../components/mod.js";
export declare class StellarWalletsKit {
    static init(params: StellarWalletsKitInitParams): void;
    static get selectedModule(): ModuleInterface;
    /**
     * This method sets the active wallet (module) that will be used when calling others methods (for example getAddress).
     */
    static setWallet(id: string): void;
    /**
     * This method sets the Stellar network the kit will use across calls.
     */
    static setNetwork(network: Networks): void;
    /**
     * You can manually update the kit's styles with this method.
     */
    static setTheme(newTheme?: SwkAppTheme): void;
    /**
     * This method will get you the `address` that's currently active in the Kit's memory. Such address is fetched when the user connects its wallet
     *
     * NOTE: If you want to fetch the address directly from the wallet, use the `fetchAddress` method instead.
     */
    static getAddress(): Promise<{
        address: string;
    }>;
    /**
     * This method will fetch the address from the selected module and update the internal kit's memory
     *
     * NOTE: We suggest that you use `getAddress` when possible instead of this method. Trying to fetch the address from a module
     * that is not ready might cause unexpected behaviors (for example with Freighter if no permission has been granted or when the user is using a hardware wallet);
     */
    static fetchAddress(): Promise<{
        address: string;
    }>;
    static signTransaction(xdr: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedTxXdr: string;
        signerAddress?: string;
    }>;
    static signAuthEntry(authEntry: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedAuthEntry: string;
        signerAddress?: string;
    }>;
    static signMessage(message: string, opts?: {
        networkPassphrase?: string;
        address?: string;
        path?: string;
    }): Promise<{
        signedMessage: string;
        signerAddress?: string;
    }>;
    static signAndSubmitTransaction(xdr: string, opts?: {
        networkPassphrase?: string;
        address?: string;
    }): Promise<{
        status: "success" | "pending";
    }>;
    static getNetwork(): Promise<{
        network: string;
        networkPassphrase: string;
    }>;
    static disconnect(): Promise<void>;
    /**
     * A signal based event you can listen for different events across the kit
     *
     * NOTE: These events are also triggered at launch IE the first time the values are set.
     */
    static on(type: KitEventType.STATE_UPDATED, callback: (event: KitEventStateUpdated) => void): () => void;
    static on(type: KitEventType.WALLET_SELECTED, callback: (event: KitEventWalletSelected) => void): () => void;
    static on(type: KitEventType.DISCONNECT, callback: (event: KitEventDisconnected) => void): () => void;
    static refreshSupportedWallets(): Promise<ISupportedWallet[]>;
    static createButton(container: HTMLElement, props?: SwkButtonProps): Promise<void>;
    /**
     * This method opens an "authentication" modal where the user can pick the wallet they want to connect,
     * it sets the selected wallet as the currently active module and then it requests the public key from the wallet.
     */
    static authModal(params?: AuthModalParams): Promise<{
        address: string;
    }>;
    /**
     * This method opens the "profile" modal, this modal allows the user to check its currently connected account, copy its public key
     */
    static profileModal(params?: ProfileModalParams): Promise<void>;
}
//# sourceMappingURL=kit.d.ts.map