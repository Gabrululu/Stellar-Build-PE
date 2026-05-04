import { ModuleType } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const ONEKEY_ID = "onekey";
export class OneKeyModule {
    constructor() {
        Object.defineProperty(this, "moduleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ModuleType.HOT_WALLET
        });
        Object.defineProperty(this, "productId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ONEKEY_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "OneKey Wallet"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://onekey.so/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://uni.onekey-asset.com/static/logo/onekey.png"
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error("OneKey Wallet is not installed");
        }
    }
    async isAvailable() {
        return typeof window !== "undefined" && !!window.$onekey?.stellar;
    }
    async getAddress() {
        try {
            await this.runChecks();
            const address = await window.$onekey.stellar.getPublicKey();
            return { address };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            await this.runChecks();
            return await window.$onekey.stellar.signTransaction(xdr, opts);
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signAuthEntry(authEntry, opts) {
        try {
            await this.runChecks();
            return await window.$onekey.stellar.signAuthEntry(authEntry, opts);
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signMessage(message, opts) {
        try {
            await this.runChecks();
            return await window.$onekey.stellar.signMessage(message, opts);
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async getNetwork() {
        throw {
            code: -3,
            message: 'OneKey does not support the "getNetwork" function',
        };
    }
}
