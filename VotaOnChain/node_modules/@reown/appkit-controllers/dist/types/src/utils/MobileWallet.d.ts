import { type ChainControllerState } from '../controllers/ChainController.js';
export declare const CUSTOM_DEEPLINK_WALLETS: {
    PHANTOM: {
        id: string;
        url: string;
        androidPackage: string;
    };
    SOLFLARE: {
        id: string;
        url: string;
    };
    COINBASE: {
        id: string;
        url: string;
        evmDeeplink: string;
    };
    BINANCE: {
        id: string;
        appId: string;
        deeplink: string;
        url: string;
    };
};
export declare const MobileWalletUtil: {
    /**
     * Checks if a wallet is a custom deeplink wallet that uses Universal Links
     * instead of WalletConnect deeplinks for the given chain namespace.
     *
     * Only returns true for supported wallet-chain combinations:
     * - Phantom: Solana, EVM, and Bitcoin (doesn't support WalletConnect)
     * - Solflare: Solana only
     * - Coinbase: Solana and EVM
     * - Binance: Bitcoin only
     *
     * @param {string} id - The id of the wallet.
     * @param {ChainControllerState['activeChain']} namespace - The chain namespace.
     * @returns {boolean} Whether the wallet is a custom deeplink wallet for the given namespace.
     */
    isCustomDeeplinkWallet(id: string, namespace: ChainControllerState["activeChain"]): boolean;
    /**
     * Handles mobile wallet redirection for wallets that have Universal Links and doesn't support WalletConnect Deep Links.
     *
     * @param {string} id - The id of the wallet.
     * @param {ChainNamespace} namespace - The namespace of the chain.
     * @param {object} options - Optional configuration.
     * @param {boolean} options.isCoinbaseDisabled - Whether Coinbase wallet is disabled. When true, always trigger deeplink.
     */
    handleMobileDeeplinkRedirect(id: string, namespace: ChainControllerState["activeChain"], options?: {
        isCoinbaseDisabled?: boolean;
    }): void;
};
