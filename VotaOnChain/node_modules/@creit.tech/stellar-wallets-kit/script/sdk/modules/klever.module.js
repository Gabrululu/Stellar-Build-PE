"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.KleverModule = exports.KLEVER_ID = void 0;
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.KLEVER_ID = "klever";
class KleverModule {
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
            value: exports.KLEVER_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Klever Wallet"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://klever.io/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/klever.png"
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error("Klever Wallet is not installed");
        }
    }
    async isAvailable() {
        return typeof window !== "undefined" && !!window.kleverWallet?.stellar;
    }
    async getAddress() {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.getAddress())
            .catch((e) => {
            throw (0, utils_js_1.parseError)(e);
        });
    }
    async signTransaction(xdr, opts) {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.signTransaction(xdr, opts))
            .catch((e) => {
            throw (0, utils_js_1.parseError)(e);
        });
    }
    async signAuthEntry(authEntry, opts) {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.signAuthEntry(authEntry, opts))
            .catch((e) => {
            throw (0, utils_js_1.parseError)(e);
        });
    }
    async signMessage(message, opts) {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.signMessage(message, opts))
            .catch((e) => {
            throw (0, utils_js_1.parseError)(e);
        });
    }
    async getNetwork() {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.getNetwork())
            .catch((e) => {
            throw (0, utils_js_1.parseError)(e);
        });
    }
}
exports.KleverModule = KleverModule;
