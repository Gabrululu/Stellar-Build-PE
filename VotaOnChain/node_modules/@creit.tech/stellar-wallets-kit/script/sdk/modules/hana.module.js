"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HanaModule = exports.HANA_ID = void 0;
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.HANA_ID = "hana";
class HanaModule {
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
            value: exports.HANA_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Hana Wallet"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://hanawallet.io/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/hana.png"
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error("Hana Wallet is not installed");
        }
    }
    async isAvailable() {
        return typeof window !== "undefined" && !!window.hanaWallet?.stellar;
    }
    async getAddress() {
        try {
            await this.runChecks();
            const address = await window.hanaWallet.stellar.getPublicKey();
            return { address };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            await this.runChecks();
            const signedTxXdr = await window.hanaWallet.stellar.signTransaction({
                xdr,
                accountToSign: opts?.address,
                networkPassphrase: opts?.networkPassphrase,
            });
            return { signedTxXdr, signerAddress: opts?.address };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signAuthEntry(authEntry, opts) {
        try {
            await this.runChecks();
            const signedAuthEntry = await window.hanaWallet.stellar.signAuthEntry({
                xdr: authEntry,
                accountToSign: opts?.address,
            });
            return { signedAuthEntry, signerAddress: opts?.address };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signMessage(message, opts) {
        try {
            await this.runChecks();
            const signedMessage = await window.hanaWallet.stellar.signMessage({
                message,
                accountToSign: opts?.address,
            });
            return { signedMessage, signerAddress: opts?.address };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async getNetwork() {
        throw {
            code: -3,
            message: 'Hana does not support the "getNetwork" function',
        };
    }
}
exports.HanaModule = HanaModule;
