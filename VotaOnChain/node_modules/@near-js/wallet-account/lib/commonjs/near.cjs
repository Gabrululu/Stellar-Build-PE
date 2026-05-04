"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Near = void 0;
/**
 * This module contains the main class developers will use to interact with NEAR.
 * The {@link Near} class is used to interact with {@link "@near-js/accounts".account.Account | Account} through the {@link "@near-js/providers".json-rpc-provider.JsonRpcProvider | JsonRpcProvider}.
 * It is configured via the {@link NearConfig}.
 *
 * @see [https://docs.near.org/tools/near-api-js/quick-reference#account](https://docs.near.org/tools/near-api-js/quick-reference#account)
 *
 * @module near
 */
const accounts_1 = require("@near-js/accounts");
/**
 * This is the main class developers should use to interact with NEAR.
 * @example
 * ```js
 * const near = new Near(config);
 * ```
 */
class Near {
    config;
    connection;
    accountCreator;
    constructor(config) {
        this.config = config;
        this.connection = accounts_1.Connection.fromConfig({
            networkId: config.networkId,
            provider: config.provider || { type: 'JsonRpcProvider', args: { url: config.nodeUrl, headers: config.headers } },
            signer: config.signer || { type: 'InMemorySigner', keyStore: config.keyStore || config.deps?.keyStore },
            jsvmAccountId: config.jsvmAccountId || `jsvm.${config.networkId}`
        });
        if (config.masterAccount) {
            // TODO: figure out better way of specifiying initial balance.
            // Hardcoded number below must be enough to pay the gas cost to dev-deploy with near-shell for multiple times
            const initialBalance = config.initialBalance ? BigInt(config.initialBalance) : 500000000000000000000000000n;
            this.accountCreator = new accounts_1.LocalAccountCreator(new accounts_1.Account(this.connection, config.masterAccount), initialBalance);
        }
        else if (config.helperUrl) {
            this.accountCreator = new accounts_1.UrlAccountCreator(this.connection, config.helperUrl);
        }
        else {
            this.accountCreator = null;
        }
    }
    /**
     * @param accountId near accountId used to interact with the network.
     */
    async account(accountId) {
        const account = new accounts_1.Account(this.connection, accountId);
        return account;
    }
    /**
     * Create an account using the {@link AccountCreator}. Either:
     * * using a masterAccount with {@link LocalAccountCreator}
     * * using the helperUrl with {@link UrlAccountCreator}
     * @see {@link NearConfig#masterAccount} and {@link NearConfig#helperUrl}
     *
     * @param accountId
     * @param publicKey
     */
    async createAccount(accountId, publicKey) {
        if (!this.accountCreator) {
            throw new Error('Must specify account creator, either via masterAccount or helperUrl configuration settings.');
        }
        await this.accountCreator.createAccount(accountId, publicKey);
        return new accounts_1.Account(this.connection, accountId);
    }
}
exports.Near = Near;
