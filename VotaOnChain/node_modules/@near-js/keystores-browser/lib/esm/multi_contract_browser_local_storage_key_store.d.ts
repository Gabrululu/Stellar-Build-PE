import { KeyPair } from '@near-js/crypto';
import { MultiContractKeyStore } from '@near-js/keystores';
/**
 * This class is used to store keys in the browsers local storage.
 *
 * @see [https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store](https://docs.near.org/docs/develop/front-end/naj-quick-reference#key-store)
 * @example
 * ```js
 * import { connect, keyStores } from 'near-api-js';
 *
 * const keyStore = new keyStores.MultiContractBrowserLocalStorageKeyStore();
 * const config = {
 *   keyStore, // instance of MultiContractBrowserLocalStorageKeyStore
 *   networkId: 'testnet',
 *   nodeUrl: 'https://rpc.testnet.near.org',
 *   walletUrl: 'https://wallet.testnet.near.org',
 *   helperUrl: 'https://helper.testnet.near.org',
 *   explorerUrl: 'https://explorer.testnet.near.org'
 * };
 *
 * // inside an async function
 * const near = await connect(config)
 * ```
 */
export declare class MultiContractBrowserLocalStorageKeyStore extends MultiContractKeyStore {
    /** @hidden */
    private localStorage;
    /** @hidden */
    private prefix;
    /**
     * @param localStorage defaults to window.localStorage
     * @param prefix defaults to `near-api-js:keystore:`
     */
    constructor(localStorage?: any, prefix?: string);
    /**
     * Stores a {@link utils/key_pair!KeyPair} in local storage.
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param keyPair The key pair to store in local storage
     * @param contractId The contract to store in local storage
     */
    setKey(networkId: string, accountId: string, keyPair: KeyPair, contractId: string): Promise<void>;
    /**
     * Gets a {@link utils/key_pair!KeyPair} from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param contractId The NEAR contract tied to the key pair
     * @returns {Promise<KeyPair>}
     */
    getKey(networkId: string, accountId: string, contractId: string): Promise<KeyPair | null>;
    /**
     * Removes a {@link utils/key_pair!KeyPair} from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the key pair
     * @param contractId The NEAR contract tied to the key pair
     */
    removeKey(networkId: string, accountId: string, contractId: string): Promise<void>;
    /**
     * Removes all items that start with `prefix` from local storage
     */
    clear(): Promise<void>;
    /**
     * Get the network(s) from local storage
     * @returns {Promise<string[]>}
     */
    getNetworks(): Promise<string[]>;
    /**
     * Gets the account(s) from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     */
    getAccounts(networkId: string): Promise<string[]>;
    /**
     * Gets the contract(s) from local storage
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The targeted account.
     */
    getContracts(networkId: string, accountId: string): Promise<string[]>;
    /**
     * @hidden
     * Helper function to retrieve a local storage key
     * @param networkId The targeted network. (ex. default, betanet, etc…)
     * @param accountId The NEAR account tied to the storage keythat's sought
     * @param contractId The NEAR contract tied to the storage keythat's sought
     * @returns {string} An example might be: `near-api-js:keystore:near-friend:default`
     */
    private storageKeyForSecretKey;
    /** @hidden */
    private storageKeys;
}
//# sourceMappingURL=multi_contract_browser_local_storage_key_store.d.ts.map