"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Contract = void 0;
const utils_1 = require("@near-js/utils");
const types_1 = require("@near-js/types");
const local_view_execution_1 = require("./local-view-execution/index.cjs");
const is_my_json_valid_1 = __importDefault(require("is-my-json-valid"));
const depd_1 = __importDefault(require("depd"));
const near_abi_1 = require("near-abi");
const account_1 = require("./account.cjs");
const errors_1 = require("./errors.cjs");
const utils_2 = require("./utils.cjs");
// Makes `function.name` return given name
function nameFunction(name, body) {
    return {
        [name](...args) {
            return body(...args);
        },
    }[name];
}
function validateArguments(args, abiFunction, abiRoot) {
    if (!isObject(args))
        return;
    if (abiFunction.params &&
        abiFunction.params.serialization_type !== near_abi_1.AbiSerializationType.Json) {
        throw new errors_1.UnsupportedSerializationError(abiFunction.name, abiFunction.params.serialization_type);
    }
    if (abiFunction.result &&
        abiFunction.result.serialization_type !== near_abi_1.AbiSerializationType.Json) {
        throw new errors_1.UnsupportedSerializationError(abiFunction.name, abiFunction.result.serialization_type);
    }
    const params = abiFunction.params?.args || [];
    for (const p of params) {
        const arg = args[p.name];
        const typeSchema = p.type_schema;
        typeSchema.definitions = abiRoot.body.root_schema.definitions;
        const validate = (0, is_my_json_valid_1.default)(typeSchema);
        const valid = validate(arg);
        if (!valid) {
            throw new errors_1.ArgumentSchemaError(p.name, validate.errors);
        }
    }
    // Check there are no extra unknown arguments passed
    for (const argName of Object.keys(args)) {
        const param = params.find((p) => p.name === argName);
        if (!param) {
            throw new errors_1.UnknownArgumentError(argName, params.map((p) => p.name));
        }
    }
}
const isUint8Array = (x) => x && x.byteLength !== undefined && x.byteLength === x.length;
const isObject = (x) => Object.prototype.toString.call(x) === "[object Object]";
/**
 * Defines a smart contract on NEAR including the change (mutable) and view (non-mutable) methods
 *
 * @see [https://docs.near.org/tools/near-api-js/quick-reference#contract](https://docs.near.org/tools/near-api-js/quick-reference#contract)
 * @example
 * ```js
 * import { Contract } from 'near-api-js';
 *
 * async function contractExample() {
 *   const methodOptions = {
 *     viewMethods: ['getMessageByAccountId'],
 *     changeMethods: ['addMessage']
 *   };
 *   const contract = new Contract(
 *     wallet.account(),
 *     'contract-id.testnet',
 *     methodOptions
 *   );
 *
 *   // use a contract view method
 *   const messages = await contract.getMessages({
 *     accountId: 'example-account.testnet'
 *   });
 *
 *   // use a contract change method
 *   await contract.addMessage({
 *      meta: 'some info',
 *      callbackUrl: 'https://example.com/callback',
 *      args: { text: 'my message' },
 *      amount: 1
 *   })
 * }
 * ```
 */
class Contract {
    /** @deprecated */
    account;
    connection;
    contractId;
    lve;
    /**
     * @param account NEAR account to sign change method transactions
     * @param contractId NEAR account id where the contract is deployed
     * @param options NEAR smart contract methods that your application will use. These will be available as `contract.methodName`
     */
    constructor(connection, contractId, options) {
        this.connection = connection.getConnection();
        if (connection instanceof account_1.Account) {
            const deprecate = (0, depd_1.default)("new Contract(account, contractId, options)");
            deprecate("use `new Contract(connection, contractId, options)` instead");
            this.account = connection;
        }
        this.contractId = contractId;
        this.lve = new local_view_execution_1.LocalViewExecution(connection);
        const { viewMethods = [], changeMethods = [], abi: abiRoot, useLocalViewExecution, } = options;
        let viewMethodsWithAbi = viewMethods.map((name) => ({
            name,
            abi: null,
        }));
        let changeMethodsWithAbi = changeMethods.map((name) => ({
            name,
            abi: null,
        }));
        if (abiRoot) {
            if (viewMethodsWithAbi.length > 0 ||
                changeMethodsWithAbi.length > 0) {
                throw new errors_1.ConflictingOptions();
            }
            viewMethodsWithAbi = abiRoot.body.functions
                .filter((m) => m.kind === near_abi_1.AbiFunctionKind.View)
                .map((m) => ({ name: m.name, abi: m }));
            changeMethodsWithAbi = abiRoot.body.functions
                .filter((methodAbi) => methodAbi.kind === near_abi_1.AbiFunctionKind.Call)
                .map((methodAbi) => ({ name: methodAbi.name, abi: methodAbi }));
        }
        viewMethodsWithAbi.forEach(({ name, abi }) => {
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, async (args = {}, options = {}, ...ignored) => {
                    if (ignored.length ||
                        !(isObject(args) || isUint8Array(args)) ||
                        !isObject(options)) {
                        throw new types_1.PositionalArgsError();
                    }
                    if (abi) {
                        validateArguments(args, abi, abiRoot);
                    }
                    if (useLocalViewExecution) {
                        try {
                            return await this.lve.viewFunction({
                                contractId: this.contractId,
                                methodName: name,
                                args,
                                ...options,
                            });
                        }
                        catch (error) {
                            utils_1.Logger.warn(`Local view execution failed with: "${error.message}"`);
                            utils_1.Logger.warn(`Fallback to normal RPC call`);
                        }
                    }
                    if (this.account) {
                        return this.account.viewFunction({
                            contractId: this.contractId,
                            methodName: name,
                            args,
                            ...options,
                        });
                    }
                    return (0, utils_2.viewFunction)(this.connection, {
                        contractId: this.contractId,
                        methodName: name,
                        args,
                        ...options,
                    });
                }),
            });
        });
        changeMethodsWithAbi.forEach(({ name, abi }) => {
            Object.defineProperty(this, name, {
                writable: false,
                enumerable: true,
                value: nameFunction(name, async (...args) => {
                    if (args.length &&
                        (args.length > 3 ||
                            !(isObject(args[0]) || isUint8Array(args[0])))) {
                        throw new types_1.PositionalArgsError();
                    }
                    if (args.length > 1 || !(args[0] && args[0].args)) {
                        const deprecate = (0, depd_1.default)("contract.methodName(args, gas, amount)");
                        deprecate("use `contract.methodName({ signerAccount, args, gas?, amount?, callbackUrl?, meta? })` instead");
                        args[0] = {
                            args: args[0],
                            gas: args[1],
                            amount: args[2],
                        };
                    }
                    if (abi) {
                        validateArguments(args[0].args, abi, abiRoot);
                    }
                    return this._changeMethod({ methodName: name, ...args[0] });
                }),
            });
        });
    }
    async _changeMethod({ signerAccount, args, methodName, gas, amount, meta, callbackUrl, }) {
        validateBNLike({ gas, amount });
        const account = this.account || signerAccount;
        if (!account)
            throw new Error(`signerAccount must be specified`);
        const rawResult = await account.functionCall({
            contractId: this.contractId,
            methodName,
            args,
            gas,
            attachedDeposit: amount,
            walletMeta: meta,
            walletCallbackUrl: callbackUrl,
        });
        return (0, utils_1.getTransactionLastResult)(rawResult);
    }
}
exports.Contract = Contract;
/**
 * Throws if an argument is not in BigInt format or otherwise invalid
 * @param argMap
 */
function validateBNLike(argMap) {
    const bnLike = "number, decimal string or BigInt";
    for (const argName of Object.keys(argMap)) {
        const argValue = argMap[argName];
        if (argValue && typeof argValue !== "bigint" && isNaN(argValue)) {
            throw new types_1.ArgumentTypeError(argName, bnLike, argValue);
        }
    }
}
