/**
 * @module
 * @description
 * This module contains the {@link FailoverRpcProvider} client class
 * which can be used to interact with multiple [NEAR RPC APIs](https://docs.near.org/api/rpc/introduction).
 * @see {@link "@near-js/types".provider | provider} for a list of request and response types
 */
import { Logger } from '@near-js/utils';
import { TypedError, } from '@near-js/types';
import { Provider } from './provider';
/**
 * Client class to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see [https://github.com/near/nearcore/tree/master/chain/jsonrpc](https://github.com/near/nearcore/tree/master/chain/jsonrpc)
 */
export class FailoverRpcProvider extends Provider {
    /** @hidden */
    providers;
    currentProviderIndex;
    /**
     * @param providers list of providers
     */
    constructor(providers) {
        super();
        if (providers.length === 0) {
            throw new Error('At least one provider must be specified');
        }
        this.providers = providers;
        this.currentProviderIndex = 0;
    }
    switchToNextProvider() {
        if (this.providers.length === 1)
            return;
        if (this.providers.length - 1 <= this.currentProviderIndex) {
            this.currentProviderIndex = 0;
        }
        else {
            this.currentProviderIndex += 1;
        }
        Logger.debug(`Switched to provider at the index ${this.currentProviderIndex}`);
    }
    get currentProvider() {
        const provider = this.providers[this.currentProviderIndex];
        if (!provider)
            throw new Error(`Provider wasn't found at index ${this.currentProviderIndex}`);
        return provider;
    }
    async withBackoff(getResult) {
        for (let i = 0; i < this.providers.length; i++) {
            try {
                // each provider implements own retry logic
                const result = await getResult(this.currentProvider);
                if (result)
                    return result;
            }
            catch (e) {
                console.error(e);
                this.switchToNextProvider();
            }
        }
        throw new TypedError(`Exceeded ${this.providers.length} providers to execute request`, 'RetriesExceeded');
    }
    /**
     * Gets the RPC's status
     * @see [https://docs.near.org/docs/develop/front-end/rpc#general-validator-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     */
    async status() {
        return this.withBackoff((currentProvider) => currentProvider.status());
    }
    async sendTransactionUntil(signedTransaction, waitUntil) {
        return this.withBackoff((currentProvider) => currentProvider.sendTransactionUntil(signedTransaction, waitUntil));
    }
    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction) {
        return this.withBackoff((currentProvider) => currentProvider.sendTransaction(signedTransaction));
    }
    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(signedTransaction) {
        return this.withBackoff((currentProvider) => currentProvider.sendTransactionAsync(signedTransaction));
    }
    /**
     * Gets a transaction's status from the RPC
     * @see [https://docs.near.org/docs/develop/front-end/rpc#transaction-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
     * @param accountId The NEAR account that signed the transaction
     */
    async txStatus(txHash, accountId, waitUntil) {
        return this.withBackoff((currentProvider) => currentProvider.txStatus(txHash, accountId, waitUntil));
    }
    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async txStatusReceipts(txHash, accountId, waitUntil) {
        return this.withBackoff((currentProvider) => currentProvider.txStatusReceipts(txHash, accountId, waitUntil));
    }
    async query(paramsOrPath, data) {
        if (data) {
            return this.withBackoff((currentProvider) => currentProvider.query(paramsOrPath, data));
        }
        return this.withBackoff((currentProvider) => currentProvider.query(paramsOrPath));
    }
    /**
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    async block(blockQuery) {
        return this.withBackoff((currentProvider) => currentProvider.block(blockQuery));
    }
    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges(blockQuery) {
        return this.withBackoff((currentProvider) => currentProvider.blockChanges(blockQuery));
    }
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    async chunk(chunkId) {
        return this.withBackoff((currentProvider) => currentProvider.chunk(chunkId));
    }
    /**
     * Query validators of the epoch defined by the given block id.
     * @see [https://docs.near.org/api/rpc/network#validation-status](https://docs.near.org/api/rpc/network#validation-status)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async validators(blockId) {
        return this.withBackoff((currentProvider) => currentProvider.validators(blockId));
    }
    /**
     * Gets the protocol config at a block from RPC
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(blockReference) {
        return this.withBackoff((currentProvider) => currentProvider.experimental_protocolConfig(blockReference));
    }
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(request) {
        return this.withBackoff((currentProvider) => currentProvider.lightClientProof(request));
    }
    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(request) {
        return this.withBackoff((currentProvider) => currentProvider.nextLightClientBlock(request));
    }
    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    async accessKeyChanges(accountIdArray, blockQuery) {
        return this.withBackoff((currentProvider) => currentProvider.accessKeyChanges(accountIdArray, blockQuery));
    }
    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    async singleAccessKeyChanges(accessKeyArray, blockQuery) {
        return this.withBackoff((currentProvider) => currentProvider.singleAccessKeyChanges(accessKeyArray, blockQuery));
    }
    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    async accountChanges(accountIdArray, blockQuery) {
        return this.withBackoff((currentProvider) => currentProvider.accountChanges(accountIdArray, blockQuery));
    }
    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractStateChanges(accountIdArray, blockQuery, keyPrefix = '') {
        return this.withBackoff((currentProvider) => currentProvider.contractStateChanges(accountIdArray, blockQuery, keyPrefix));
    }
    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractCodeChanges(accountIdArray, blockQuery) {
        return this.withBackoff((currentProvider) => currentProvider.contractCodeChanges(accountIdArray, blockQuery));
    }
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see [https://docs.near.org/api/rpc/gas](https://docs.near.org/api/rpc/gas)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async gasPrice(blockId) {
        return this.withBackoff((currentProvider) => currentProvider.gasPrice(blockId));
    }
}
