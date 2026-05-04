"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.viewFunction = exports.viewState = exports.encodeJSContractArgs = exports.validateArgs = void 0;
const types_1 = require("@near-js/types");
const utils_1 = require("@near-js/utils");
function parseJsonFromRawResponse(response) {
    return JSON.parse(Buffer.from(response).toString());
}
function bytesJsonStringify(input) {
    return Buffer.from(JSON.stringify(input));
}
function validateArgs(args) {
    const isUint8Array = args.byteLength !== undefined && args.byteLength === args.length;
    if (isUint8Array) {
        return;
    }
    if (Array.isArray(args) || typeof args !== 'object') {
        throw new types_1.PositionalArgsError();
    }
}
exports.validateArgs = validateArgs;
function encodeJSContractArgs(contractId, method, args) {
    return Buffer.concat([Buffer.from(contractId), Buffer.from([0]), Buffer.from(method), Buffer.from([0]), Buffer.from(args)]);
}
exports.encodeJSContractArgs = encodeJSContractArgs;
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
async function viewState(connection, accountId, prefix, blockQuery = { finality: 'optimistic' }) {
    const { values } = await connection.provider.query({
        request_type: 'view_state',
        ...blockQuery,
        account_id: accountId,
        prefix_base64: Buffer.from(prefix).toString('base64')
    });
    return values.map(({ key, value }) => ({
        key: Buffer.from(key, 'base64'),
        value: Buffer.from(value, 'base64')
    }));
}
exports.viewState = viewState;
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
async function viewFunction(connection, { contractId, methodName, args = {}, parse = parseJsonFromRawResponse, stringify = bytesJsonStringify, jsContract = false, blockQuery = { finality: 'optimistic' } }) {
    let encodedArgs;
    validateArgs(args);
    if (jsContract) {
        encodedArgs = encodeJSContractArgs(contractId, methodName, Object.keys(args).length > 0 ? JSON.stringify(args) : '');
    }
    else {
        encodedArgs = stringify(args);
    }
    const result = await connection.provider.query({
        request_type: 'call_function',
        ...blockQuery,
        account_id: jsContract ? connection.jsvmAccountId : contractId,
        method_name: jsContract ? 'view_js_contract' : methodName,
        args_base64: encodedArgs.toString('base64')
    });
    if (result.logs) {
        (0, utils_1.printTxOutcomeLogs)({ contractId, logs: result.logs });
    }
    return result.result && result.result.length > 0 && parse(Buffer.from(result.result));
}
exports.viewFunction = viewFunction;
