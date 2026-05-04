import { type CaipNetwork, type ChainNamespace, type Connection } from '@reown/appkit-common';
import { type WalletItem } from '../src/utils/ConnectUtil.js';
import type { BadgeType, UseAppKitAccountReturn, UseAppKitNetworkReturn } from '../src/utils/TypeUtil.js';
export type { Connection } from '@reown/appkit-common';
interface DisconnectParams {
    id?: string;
    namespace?: ChainNamespace;
}
interface UseAppKitConnectionProps {
    namespace?: ChainNamespace;
    onSuccess?: (params: {
        address: string;
        namespace: ChainNamespace;
        hasSwitchedAccount: boolean;
        hasSwitchedWallet: boolean;
        hasDeletedWallet: boolean;
    }) => void;
    onError?: (error: Error) => void;
}
interface SwitchConnectionParams {
    connection: Connection;
    address?: string;
}
interface DeleteRecentConnectionProps {
    address: string;
    connectorId: string;
}
export interface ConnectOptions {
    wcPayUrl?: string;
}
export declare function useAppKitProvider<T>(chainNamespace: ChainNamespace): {
    walletProvider: T;
    walletProviderType: import("./index.js").ConnectorType | undefined;
};
export declare function useAppKitNetworkCore(): Pick<UseAppKitNetworkReturn, 'caipNetwork' | 'chainId' | 'caipNetworkId'>;
export declare function useAppKitAccount(options?: {
    namespace?: ChainNamespace;
}): UseAppKitAccountReturn;
export declare function useDisconnect(): {
    disconnect: (props?: DisconnectParams) => Promise<void>;
};
export declare function useAppKitConnections(namespace?: ChainNamespace): {
    connections: {
        name: string;
        icon: string;
        networkIcon: string;
        accounts: {
            type?: string;
            address: string;
            publicKey?: string;
            caipAddress?: import("@reown/appkit-common").CaipAddress;
        }[];
        caipNetwork?: CaipNetwork;
        connectorId: string;
        auth?: {
            name: string | undefined;
            username: string | undefined;
        };
    }[];
    recentConnections: {
        name: string;
        icon: string;
        networkIcon: string;
        accounts: {
            type?: string;
            address: string;
            publicKey?: string;
            caipAddress?: import("@reown/appkit-common").CaipAddress;
        }[];
        caipNetwork?: CaipNetwork;
        connectorId: string;
        auth?: {
            name: string | undefined;
            username: string | undefined;
        };
    }[];
};
export declare function useAppKitConnection({ namespace, onSuccess, onError }: UseAppKitConnectionProps): {
    connection: Connection | undefined;
    isPending: boolean;
    switchConnection: ({ connection: _connection, address }: SwitchConnectionParams) => Promise<void>;
    deleteConnection: ({ address, connectorId }: DeleteRecentConnectionProps) => void;
};
export interface FetchWalletsOptions {
    /** Page number to fetch (default: 1) */
    page?: number;
    /** @deprecated Use `search` instead */
    query?: string;
    /** Search query to filter wallets. When provided, switches to search mode. */
    search?: string;
    /** Number of entries per page. Defaults to 40 for list mode, 100 for search mode. */
    entries?: number;
    /** Filter wallets by badge type ('none' | 'certified') */
    badge?: BadgeType;
    /** Wallet IDs to include. Overrides the global includeWalletIds config when provided. */
    include?: string[];
    /** Wallet IDs to exclude. Overrides the default exclude list when provided. */
    exclude?: string[];
}
export interface UseAppKitWalletsReturn {
    /**
     * List of wallets for the initial connect view including WalletConnect wallet and injected wallets together. If user doesn't have any injected wallets, it'll fill the list with most ranked WalletConnect wallets.
     */
    wallets: WalletItem[];
    /**
     * List of WalletConnect wallets from Wallet Guide API. Useful to display all available WalletConnect wallets in a separate Search Wallets view.
     * @see https://walletguide.walletconnect.network/.
     */
    wcWallets: WalletItem[];
    /**
     * Boolean that indicates if WalletConnect wallets are being fetched.
     */
    isFetchingWallets: boolean;
    /**
     * Boolean that indicates if a WalletConnect URI is being fetched.
     */
    isFetchingWcUri: boolean;
    /**
     * Boolean that indicates if the AppKit is initialized. It's useful to render a fallback UI when the AppKit initializes and detects all injected wallets.
     */
    isInitialized: boolean;
    /**
     * The current WalletConnect URI for QR code display. This is set when connecting to a WalletConnect wallet. Reset with resetWcUri().
     */
    wcUri?: string;
    /**
     * The wallet currently being connected to. This is set when a connection is initiated and cleared when it completes or fails. For WalletConnect wallets, resetWcUri() should be called to clear the state.
     */
    connectingWallet?: WalletItem;
    /**
     * The current page number of WalletConnect wallets.
     */
    page: number;
    /**
     * The total number of available WalletConnect wallets based on the AppKit configurations and given parameters.
     */
    count: number;
    /**
     * Function to fetch WalletConnect wallets from the explorer API. Allows to list, search and paginate through the wallets.
     * @param options - Options for fetching wallets
     */
    fetchWallets: (options?: FetchWalletsOptions) => Promise<void>;
    /**
     * Function to connect to a wallet.
     * - For WalletConnect wallets: initiates WC connection and returns the URI with the `wcUri` state.
     * - For injected connectors: triggers the extension/wallet directly.
     *
     * @param wallet - The wallet item to connect to
     * @param namespace - Optional chain namespace
     * @param options - Optional connect options (e.g., wcPayUrl for WalletConnect Pay)
     * @returns Promise that resolves when connection completes or rejects on error
     */
    connect: (wallet: WalletItem, namespace?: ChainNamespace, options?: ConnectOptions) => Promise<void>;
    /**
     * Function to reset the WC URI. Useful to keep `connectingWallet` state sync with the WC URI. Can be called when the QR code is closed.
     */
    resetWcUri: () => void;
    /**
     * Clears the connectingWallet state in PublicStateController.
     */
    resetConnectingWallet: () => void;
    /**
     * Pre-fetches the WalletConnect URI. Call this when user selects a wallet on mobile
     * to ensure the URI is ready when they click "Open". This enables synchronous deeplink
     * triggering which is required for iOS Safari.
     *
     * **Mobile two-step flow:**
     * 1. User selects wallet → call `getWcUri()` → button shows loading via `isFetchingWcUri`
     * 2. User clicks "Open" → `connect()` triggers deeplink synchronously (URI is ready)
     *
     * @see PR #5456 for context on iOS deeplink requirements
     */
    getWcUri: () => Promise<void>;
    /**
     * Boolean that indicates if there was an error fetching the WalletConnect URI.
     */
    wcError: boolean;
}
/**
 * Headless hook for wallet connection.
 * Provides all the data and functions needed to build a custom connect UI.
 */
export declare function useAppKitWallets(): UseAppKitWalletsReturn;
