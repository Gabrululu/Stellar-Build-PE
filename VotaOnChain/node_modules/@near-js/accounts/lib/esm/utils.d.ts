/// <reference types="node" />
import { BlockReference } from '@near-js/types';
import { Connection } from './connection';
import { ViewFunctionCallOptions } from './interface';
export declare function validateArgs(args: any): void;
export declare function encodeJSContractArgs(contractId: string, method: string, args: any): Buffer;
/**
 * Returns the state (key value pairs) of account's contract based on the key prefix.
 * Pass an empty string for prefix if you would like to return the entire state.
 * @see [https://docs.near.org/api/rpc/contracts#view-contract-state](https://docs.near.org/api/rpc/contracts#view-contract-state)
 *
 * @param connection connection to query state from
 * @param accountId account whose state is viewed
 * @param prefix allows to filter which keys should be returned. Empty prefix means all keys. String prefix is utf-8 encoded.
 * @param blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 */
export declare function viewState(connection: Connection, accountId: string, prefix: string | Uint8Array, blockQuery?: BlockReference): Promise<Array<{
    key: Buffer;
    value: Buffer;
}>>;
/**
 * Invoke a contract view function using the RPC API.
 * @see [https://docs.near.org/api/rpc/contracts#call-a-contract-function](https://docs.near.org/api/rpc/contracts#call-a-contract-function)
 *
 * @param options Function call options.
 * @param options.contractId NEAR account where the contract is deployed
 * @param options.methodName The view-only method (no state mutations) name on the contract as it is written in the contract code
 * @param options.args Any arguments to the view contract method, wrapped in JSON
 * @param options.parse Parse the result of the call. Receives a Buffer (bytes array) and converts it to any object. By default result will be treated as json.
 * @param options.stringify Convert input arguments into a bytes array. By default the input is treated as a JSON.
 * @param options.jsContract Is contract from JS SDK, automatically encodes args from JS SDK to binary.
 * @param options.blockQuery specifies which block to query state at. By default returns last "optimistic" block (i.e. not necessarily finalized).
 * @returns {Promise<any>}
 */
export declare function viewFunction(connection: Connection, { contractId, methodName, args, parse, stringify, jsContract, blockQuery }: ViewFunctionCallOptions): Promise<any>;
//# sourceMappingURL=utils.d.ts.map