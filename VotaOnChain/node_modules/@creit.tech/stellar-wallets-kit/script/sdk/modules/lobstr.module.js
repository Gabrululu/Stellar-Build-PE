"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LobstrModule = exports.LOBSTR_ID = void 0;
const signer_extension_api_1 = require("@lobstrco/signer-extension-api");
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.LOBSTR_ID = "lobstr";
class LobstrModule {
    constructor() {
        Object.defineProperty(this, "moduleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mod_js_1.ModuleType.HOT_WALLET
        });
        Object.defineProperty(this, "productId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.LOBSTR_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "LOBSTR"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://lobstr.co"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/lobstr.png"
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error(`Lobstr is not connected`);
        }
    }
    async isAvailable() {
        return (0, signer_extension_api_1.isConnected)();
    }
    async getAddress() {
        try {
            await this.runChecks();
            const address = await (0, signer_extension_api_1.getPublicKey)();
            return ({ address });
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signTransaction(xdr, opts) {
        if (opts?.address) {
            console.warn(`Lobstr doesn't allow specifying what public key should sign the transaction, we skip the value`);
        }
        if (opts?.networkPassphrase) {
            console.warn(`Lobstr doesn't allow specifying the network that should be used, we skip the value`);
        }
        try {
            await this.runChecks();
            const signedTxXdr = await (0, signer_extension_api_1.signTransaction)(xdr);
            return { signedTxXdr };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signMessage(message, opts) {
        if (opts?.address) {
            console.warn(`Lobstr doesn't allow specifying what public key should sign the transaction, we skip the value`);
        }
        if (opts?.networkPassphrase) {
            console.warn(`Lobstr doesn't allow specifying the network that should be used, we skip the value`);
        }
        try {
            await this.runChecks();
            const result = await (0, signer_extension_api_1.signMessage)(message);
            if (!result) {
                throw new Error("Signing message failed");
            }
            return result;
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    signAuthEntry() {
        return Promise.reject({
            code: -3,
            message: 'Lobstr does not support the "signAuthEntry" function',
        });
    }
    getNetwork() {
        return Promise.reject({
            code: -3,
            message: 'Lobstr does not support the "getNetwork" function',
        });
    }
}
exports.LobstrModule = LobstrModule;
