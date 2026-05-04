import { printTxOutcomeLogs } from '@near-js/utils';
import { Storage } from './storage';
import { Runtime } from './runtime';
import { viewState } from '../utils';
export class LocalViewExecution {
    connection;
    storage;
    constructor(connection) {
        this.connection = connection.getConnection();
        this.storage = new Storage();
    }
    async fetchContractCode(contractId, blockQuery) {
        const result = await this.connection.provider.query({
            request_type: 'view_code',
            account_id: contractId,
            ...blockQuery,
        });
        return result.code_base64;
    }
    async fetchContractState(contractId, blockQuery) {
        return viewState(this.connection, contractId, '', blockQuery);
    }
    async fetch(contractId, blockQuery) {
        const block = await this.connection.provider.block(blockQuery);
        const blockHash = block.header.hash;
        const blockHeight = block.header.height;
        const blockTimestamp = block.header.timestamp;
        const contractCode = await this.fetchContractCode(contractId, blockQuery);
        const contractState = await this.fetchContractState(contractId, blockQuery);
        return {
            blockHash,
            blockHeight,
            blockTimestamp,
            contractCode,
            contractState,
        };
    }
    async loadOrFetch(contractId, blockQuery) {
        const stored = this.storage.load(blockQuery);
        if (stored) {
            return stored;
        }
        const { blockHash, ...fetched } = await this.fetch(contractId, blockQuery);
        this.storage.save(blockHash, fetched);
        return fetched;
    }
    /**
     * Calls a view function on a contract, fetching the contract code and state if needed.
     * @param options Options for calling the view function.
     * @param options.contractId The contract account ID.
     * @param options.methodName The name of the view function to call.
     * @param options.args The arguments to pass to the view function.
     * @param options.blockQuery The block query options.
     * @returns {Promise<any>} - A promise that resolves to the result of the view function.
     */
    async viewFunction({ contractId, methodName, args = {}, blockQuery = { finality: 'optimistic' } }) {
        const methodArgs = JSON.stringify(args);
        const { contractCode, contractState, blockHeight, blockTimestamp } = await this.loadOrFetch(contractId, blockQuery);
        const runtime = new Runtime({ contractId, contractCode, contractState, blockHeight, blockTimestamp, methodArgs });
        const { result, logs } = await runtime.execute(methodName);
        if (logs) {
            printTxOutcomeLogs({ contractId, logs });
        }
        return JSON.parse(Buffer.from(result).toString());
    }
}
