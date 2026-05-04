"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabetNetwork = exports.RabetModule = exports.RABET_ID = void 0;
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.RABET_ID = "rabet";
class RabetModule {
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
            value: exports.RABET_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Rabet"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://rabet.io/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/rabet.png"
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error(`Rabet is not installed`);
        }
    }
    isAvailable() {
        return new Promise((resolve) => {
            // We wait 100ms before answering the call because Rabet is really slow when it comes to create the rabet window object and so this way we make sure is available
            setTimeout(() => {
                resolve(typeof window !== "undefined" && !!window.rabet);
            }, 100);
        });
    }
    async getAddress() {
        try {
            await this.runChecks();
            const { publicKey } = await window.rabet.connect();
            return { address: publicKey };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signTransaction(xdr, opts) {
        if (opts?.networkPassphrase &&
            opts.networkPassphrase !== mod_js_1.Networks.PUBLIC &&
            opts.networkPassphrase !== mod_js_1.Networks.TESTNET) {
            throw new Error(`Rabet doesn't support the network: ${opts.networkPassphrase}`);
        }
        if (opts?.address) {
            console.warn(`Rabet doesn't allow specifying the network that should be used, we skip the value`);
        }
        try {
            await this.runChecks();
            const result = await window.rabet.sign(xdr, opts?.networkPassphrase === mod_js_1.Networks.PUBLIC ? RabetNetwork.PUBLIC : RabetNetwork.TESTNET);
            return { signedTxXdr: result?.xdr };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    signAuthEntry() {
        return Promise.reject({
            code: -3,
            message: 'Rabet does not support the "signAuthEntry" function',
        });
    }
    signMessage() {
        return Promise.reject({
            code: -3,
            message: 'Rabet does not support the "signMessage" function',
        });
    }
    getNetwork() {
        return Promise.reject({
            code: -3,
            message: 'Rabet does not support the "getNetwork" function',
        });
    }
}
exports.RabetModule = RabetModule;
var RabetNetwork;
(function (RabetNetwork) {
    RabetNetwork["PUBLIC"] = "mainnet";
    RabetNetwork["TESTNET"] = "testnet";
})(RabetNetwork || (exports.RabetNetwork = RabetNetwork = {}));
