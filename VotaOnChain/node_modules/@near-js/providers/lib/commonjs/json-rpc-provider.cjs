"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonRpcProvider = void 0;
/**
 * @module
 * @description
 * This module contains the {@link JsonRpcProvider} client class
 * which can be used to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see {@link "@near-js/types".provider | provider} for a list of request and response types
 */
const utils_1 = require("@near-js/utils");
const types_1 = require("@near-js/types");
const transactions_1 = require("@near-js/transactions");
const provider_1 = require("./provider.cjs");
const fetch_json_1 = require("./fetch_json.cjs");
/** @hidden */
// Default number of retries before giving up on a request.
const REQUEST_RETRY_NUMBER = 12;
// Default wait until next retry in millis.
const REQUEST_RETRY_WAIT = 500;
// Exponential back off for waiting to retry.
const REQUEST_RETRY_WAIT_BACKOFF = 1.5;
/// Keep ids unique across all connections.
let _nextId = 123;
/**
 * Client class to interact with the [NEAR RPC API](https://docs.near.org/api/rpc/introduction).
 * @see [https://github.com/near/nearcore/tree/master/chain/jsonrpc](https://github.com/near/nearcore/tree/master/chain/jsonrpc)
 */
class JsonRpcProvider extends provider_1.Provider {
    /** @hidden */
    connection;
    /** @hidden */
    options;
    /**
     * @param connectionInfo Connection info
     */
    constructor(connectionInfo, options) {
        super();
        this.connection = connectionInfo || { url: '' };
        const defaultOptions = {
            retries: REQUEST_RETRY_NUMBER,
            wait: REQUEST_RETRY_WAIT,
            backoff: REQUEST_RETRY_WAIT_BACKOFF
        };
        this.options = Object.assign({}, defaultOptions, options);
    }
    /**
     * Gets the RPC's status
     * @see [https://docs.near.org/docs/develop/front-end/rpc#general-validator-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     */
    async status() {
        return this.sendJsonRpc('status', []);
    }
    /**
     * Sends a signed transaction to the RPC
     *
     * @param signedTransaction The signed transaction being sent
     * @param waitUntil
     */
    async sendTransactionUntil(signedTransaction, waitUntil) {
        const bytes = (0, transactions_1.encodeTransaction)(signedTransaction);
        return this.sendJsonRpc('send_tx', { signed_tx_base64: Buffer.from(bytes).toString('base64'), wait_until: waitUntil });
    }
    /**
     * Sends a signed transaction to the RPC and waits until transaction is fully complete
     * @see [https://docs.near.org/docs/develop/front-end/rpc#send-transaction-await](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param signedTransaction The signed transaction being sent
     */
    async sendTransaction(signedTransaction) {
        return this.sendTransactionUntil(signedTransaction, 'EXECUTED_OPTIMISTIC');
    }
    /**
     * Sends a signed transaction to the RPC and immediately returns transaction hash
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#send-transaction-async)
     * @param signedTransaction The signed transaction being sent
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async sendTransactionAsync(signedTransaction) {
        return this.sendTransactionUntil(signedTransaction, 'NONE');
    }
    /**
     * Gets a transaction's status from the RPC
     * @see [https://docs.near.org/docs/develop/front-end/rpc#transaction-status](https://docs.near.org/docs/develop/front-end/rpc#general-validator-status)
     *
     * @param txHash A transaction hash as either a Uint8Array or a base58 encoded string
     * @param accountId The NEAR account that signed the transaction
     * @param waitUntil
     */
    async txStatus(txHash, accountId, waitUntil = 'EXECUTED_OPTIMISTIC') {
        if (typeof txHash === 'string') {
            return this.txStatusString(txHash, accountId, waitUntil);
        }
        else {
            return this.txStatusUint8Array(txHash, accountId, waitUntil);
        }
    }
    async txStatusUint8Array(txHash, accountId, waitUntil) {
        return this.sendJsonRpc('tx', { tx_hash: (0, utils_1.baseEncode)(txHash), sender_account_id: accountId, wait_until: waitUntil });
    }
    async txStatusString(txHash, accountId, waitUntil) {
        return this.sendJsonRpc('tx', { tx_hash: txHash, sender_account_id: accountId, wait_until: waitUntil });
    }
    /**
     * Gets a transaction's status from the RPC with receipts
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#transaction-status-with-receipts)
     * @param txHash The hash of the transaction
     * @param accountId The NEAR account that signed the transaction
     * @param waitUntil
     * @returns {Promise<FinalExecutionOutcome>}
     */
    async txStatusReceipts(txHash, accountId, waitUntil = 'EXECUTED_OPTIMISTIC') {
        if (typeof txHash === 'string') {
            return this.sendJsonRpc('EXPERIMENTAL_tx_status', { tx_hash: txHash, sender_account_id: accountId, wait_until: waitUntil });
        }
        else {
            return this.sendJsonRpc('EXPERIMENTAL_tx_status', { tx_hash: (0, utils_1.baseEncode)(txHash), sender_account_id: accountId, wait_until: waitUntil });
        }
    }
    /**
     * Query the RPC by passing an {@link "@near-js/types".provider/request.RpcQueryRequest | RpcQueryRequest }
     * @see [https://docs.near.org/api/rpc/contracts](https://docs.near.org/api/rpc/contracts)
     *
     * @typeParam T the shape of the returned query response
     */
    async query(...args) {
        let result;
        if (args.length === 1) {
            const { block_id, blockId, ...otherParams } = args[0];
            result = await this.sendJsonRpc('query', { ...otherParams, block_id: block_id || blockId });
        }
        else {
            const [path, data] = args;
            result = await this.sendJsonRpc('query', [path, data]);
        }
        if (result && result.error) {
            throw new types_1.TypedError(`Querying failed: ${result.error}.\n${JSON.stringify(result, null, 2)}`, (0, utils_1.getErrorTypeFromErrorMessage)(result.error, result.error.name));
        }
        return result;
    }
    /**
     * Query for block info from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     *
     * @param blockQuery {@link BlockReference} (passing a {@link BlockId} is deprecated)
     */
    async block(blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('block', { block_id: blockId, finality });
    }
    /**
     * Query changes in block from the RPC
     * pass block_id OR finality as blockQuery, not both
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     */
    async blockChanges(blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes_in_block', { block_id: blockId, finality });
    }
    /**
     * Queries for details about a specific chunk appending details of receipts and transactions to the same chunk data provided by a block
     * @see [https://docs.near.org/api/rpc/block-chunk](https://docs.near.org/api/rpc/block-chunk)
     *
     * @param chunkId Hash of a chunk ID or shard ID
     */
    async chunk(chunkId) {
        return this.sendJsonRpc('chunk', [chunkId]);
    }
    /**
     * Query validators of the epoch defined by the given block id.
     * @see [https://docs.near.org/api/rpc/network#validation-status](https://docs.near.org/api/rpc/network#validation-status)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async validators(blockId) {
        return this.sendJsonRpc('validators', [blockId]);
    }
    /**
     * Gets the protocol config at a block from RPC
     *
     * @param blockReference specifies the block to get the protocol config for
     */
    async experimental_protocolConfig(blockReference) {
        const { blockId, ...otherParams } = blockReference;
        return await this.sendJsonRpc('EXPERIMENTAL_protocol_config', { ...otherParams, block_id: blockId });
    }
    /**
     * Gets a light client execution proof for verifying execution outcomes
     * @see [https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof](https://github.com/nearprotocol/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-proof)
     */
    async lightClientProof(request) {
        return await this.sendJsonRpc('EXPERIMENTAL_light_client_proof', request);
    }
    /**
     * Returns the next light client block as far in the future as possible from the last known hash
     * to still be able to validate from that hash. This will either return the last block of the
     * next epoch, or the last final known block.
     *
     * @see [https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block](https://github.com/near/NEPs/blob/master/specs/ChainSpec/LightClient.md#light-client-block)
     */
    async nextLightClientBlock(request) {
        return await this.sendJsonRpc('next_light_client_block', request);
    }
    /**
     * Gets access key changes for a given array of accountIds
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-all)
     * @returns {Promise<ChangeResult>}
     */
    async accessKeyChanges(accountIdArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'all_access_key_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets single access key changes for a given array of access keys
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-access-key-changes-single)
     * @returns {Promise<ChangeResult>}
     */
    async singleAccessKeyChanges(accessKeyArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'single_access_key_changes',
            keys: accessKeyArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets account changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-account-changes)
     * @returns {Promise<ChangeResult>}
     */
    async accountChanges(accountIdArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'account_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets contract state changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: If you pass a keyPrefix it must be base64 encoded
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-state-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractStateChanges(accountIdArray, blockQuery, keyPrefix = '') {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'data_changes',
            account_ids: accountIdArray,
            key_prefix_base64: keyPrefix,
            block_id: blockId,
            finality
        });
    }
    /**
     * Gets contract code changes for a given array of accountIds
     * pass block_id OR finality as blockQuery, not both
     * Note: Change is returned in a base64 encoded WASM file
     * See [docs for more info](https://docs.near.org/docs/develop/front-end/rpc#view-contract-code-changes)
     * @returns {Promise<ChangeResult>}
     */
    async contractCodeChanges(accountIdArray, blockQuery) {
        const { finality } = blockQuery;
        const { blockId } = blockQuery;
        return this.sendJsonRpc('EXPERIMENTAL_changes', {
            changes_type: 'contract_code_changes',
            account_ids: accountIdArray,
            block_id: blockId,
            finality
        });
    }
    /**
     * Returns gas price for a specific block_height or block_hash.
     * @see [https://docs.near.org/api/rpc/gas](https://docs.near.org/api/rpc/gas)
     *
     * @param blockId Block hash or height, or null for latest.
     */
    async gasPrice(blockId) {
        return await this.sendJsonRpc('gas_price', [blockId]);
    }
    /**
     * Directly call the RPC specifying the method and params
     *
     * @param method RPC method
     * @param params Parameters to the method
     */
    async sendJsonRpc(method, params) {
        const request = {
            method,
            params,
            id: (_nextId++),
            jsonrpc: '2.0'
        };
        const response = await (0, fetch_json_1.fetchJsonRpc)(this.connection.url, request, this.connection.headers, (0, fetch_json_1.retryConfig)(this.options.retries, this.options.backoff, this.options.wait));
        if (response.error) {
            if (typeof response.error.data === 'object') {
                if (typeof response.error.data.error_message === 'string' && typeof response.error.data.error_type === 'string') {
                    // if error data has error_message and error_type properties, we consider that node returned an error in the old format
                    throw new types_1.TypedError(response.error.data.error_message, response.error.data.error_type);
                }
                throw (0, utils_1.parseRpcError)(response.error.data);
            }
            else {
                const errorMessage = `[${response.error.code}] ${response.error.message}: ${response.error.data}`;
                const errorType = (0, utils_1.getErrorTypeFromErrorMessage)(response.error.data, '');
                if (errorType) {
                    throw new types_1.TypedError((0, utils_1.formatError)(errorType, params), errorType);
                }
                throw new types_1.TypedError(errorMessage, response.error.name);
            }
        }
        else if (typeof response.result?.error === 'string') {
            const errorType = (0, utils_1.getErrorTypeFromErrorMessage)(response.result.error, '');
            if (errorType) {
                throw new utils_1.ServerError((0, utils_1.formatError)(errorType, params), errorType);
            }
        }
        const { result } = response;
        // From jsonrpc spec:
        // result
        //   This member is REQUIRED on success.
        //   This member MUST NOT exist if there was an error invoking the method.
        if (typeof result === 'undefined') {
            throw new types_1.TypedError(`Exceeded ${this.options.retries} attempts for request to ${method}.`, 'RetriesExceeded');
        }
        return result;
    }
}
exports.JsonRpcProvider = JsonRpcProvider;
