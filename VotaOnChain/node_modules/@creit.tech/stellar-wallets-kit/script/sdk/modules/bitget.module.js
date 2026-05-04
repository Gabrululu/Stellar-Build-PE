"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BitgetModule = exports.BITGET_WALLET_ID = void 0;
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.BITGET_WALLET_ID = "BitgetWallet";
class BitgetModule {
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
            value: exports.BITGET_WALLET_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Bitget Wallet"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://web3.bitget.com"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/bitget.png"
        });
        Object.defineProperty(this, "provider", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        this.provider = window.bitkeep?.stellar;
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error(`${this.productName} is not connected`);
        }
    }
    async isAvailable() {
        return !!this.provider;
    }
    async getAddress() {
        try {
            await this.runChecks();
            const address = await this.provider.connect();
            return { address };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signMessage(message, opts) {
        try {
            await this.runChecks();
            const signatureHex = await this.provider.signMessage(message, opts?.address);
            return { signedMessage: signatureHex };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            await this.runChecks();
            const signedTxXdr = await this.provider.signTransaction(xdr, opts);
            return { signedTxXdr };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signAuthEntry() {
        throw {
            code: -3,
            message: `${this.productName} does not support the "signAuthEntry" function`,
        };
    }
    async getNetwork() {
        try {
            await this.runChecks();
            return this.provider.network();
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
}
exports.BitgetModule = BitgetModule;
