import type { ChainNamespace } from '@reown/appkit-common';
import type { ConnectorItemWithKind, ConnectorWithProviders, WcWallet } from './TypeUtil.js';
export type WalletItem = {
    id: string;
    name: string;
    imageUrl: string;
    imageId?: string;
    connectors: {
        id: string;
        rdns?: string;
        chain: ChainNamespace;
        chainImageUrl?: string;
    }[];
    walletInfo: {
        description?: WcWallet['description'];
        supportedChains?: WcWallet['chains'];
        supportedNamespaces?: ChainNamespace[];
        website?: WcWallet['homepage'];
        installationLinks?: {
            appStore?: WcWallet['app_store'];
            playStore?: WcWallet['play_store'];
            chromeStore?: WcWallet['chrome_store'];
            desktopLink?: WcWallet['desktop_link'];
        };
        deepLink?: WcWallet['mobile_link'];
        linkMode?: WcWallet['link_mode'];
        isCertified?: boolean;
        supportsWcPay?: boolean;
    };
    isInjected: boolean;
    isRecent: boolean;
};
export declare const ConnectUtil: {
    /**
     * Maps the initial connect view wallets into WalletItems. Includes WalletConnect wallet and injected wallets. If user doesn't have any injected wallets, it'll fill the list with most ranked WalletConnect wallets.
     * @returns The WalletItems for the initial connect view.
     */
    getInitialWallets(): WalletItem[];
    /**
     * Maps the WalletGuide explorer wallets to WalletItems including search results.
     * @returns The WalletItems for the WalletGuide explorer wallets.
     */
    getWalletConnectWallets(wcAllWallets: WcWallet[], wcSearchWallets: WcWallet[]): WalletItem[];
    /**
     * Serializes WcWallet properties into WalletItem format.
     * @param wallet - The WcWallet to serialize.
     * @returns The serialized walletInfo property.
     */
    serializeWcWallet(wallet?: WcWallet): Pick<WalletItem, "walletInfo">;
    /**
     * Maps the connector to a WalletItem.
     * @param connector - The connector to map to a WalletItem.
     * @param subType - The subtype of the connector.
     * @returns The WalletItem for the connector.
     */
    mapConnectorToWalletItem(connector: ConnectorWithProviders, subType: ConnectorItemWithKind["subtype"]): WalletItem;
    /**
     * Maps the WalletGuide explorer wallet to a WalletItem.
     * @param w - The WalletGuide explorer wallet.
     * @returns The WalletItem for the WalletGuide explorer wallet.
     */
    mapWalletToWalletItem(w: WcWallet): WalletItem;
    /**
     * Maps the WalletItem to a Wallet Guide Wallet.
     * @param wallet - The WalletItem to map to a Wallet Guide Wallet.
     * @returns The Wallet Guide Wallet for the WalletItem.
     */
    mapWalletItemToWcWallet(wallet: WalletItem): WcWallet;
};
