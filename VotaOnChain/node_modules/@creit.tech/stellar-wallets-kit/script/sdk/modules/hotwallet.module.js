"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HotWalletModule = exports.HOTWALLET_ID = void 0;
const sdk_1 = require("@hot-wallet/sdk");
const mod_js_1 = require("../../types/mod.js");
exports.HOTWALLET_ID = "hot-wallet";
/**
 * **IMPORTANT**: This module requires that you have a "global" and a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
class HotWalletModule {
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
            value: exports.HOTWALLET_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "HOT Wallet"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://hot-labs.org/wallet"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://storage.herewallet.app/logo.png"
        });
    }
    async isAvailable() {
        return true;
    }
    async getAddress() {
        return await sdk_1.HOT.request("stellar:getAddress", {});
    }
    async signTransaction(xdr, opts) {
        return await sdk_1.HOT.request("stellar:signTransaction", { xdr, accountToSign: opts?.address });
    }
    async signAuthEntry(authEntry, opts) {
        return await sdk_1.HOT.request("stellar:signAuthEntry", { authEntry, accountToSign: opts?.address });
    }
    async signMessage(message, opts) {
        return await sdk_1.HOT.request("stellar:signMessage", { message, accountToSign: opts?.address });
    }
    async getNetwork() {
        return { network: "mainnet", networkPassphrase: mod_js_1.Networks.PUBLIC };
    }
}
exports.HotWalletModule = HotWalletModule;
