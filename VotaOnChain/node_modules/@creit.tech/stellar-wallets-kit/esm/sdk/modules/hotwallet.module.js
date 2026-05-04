import { HOT } from "@hot-wallet/sdk";
import { ModuleType, Networks } from "../../types/mod.js";
export const HOTWALLET_ID = "hot-wallet";
/**
 * **IMPORTANT**: This module requires that you have a "global" and a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
export class HotWalletModule {
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
            value: HOTWALLET_ID
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
        return await HOT.request("stellar:getAddress", {});
    }
    async signTransaction(xdr, opts) {
        return await HOT.request("stellar:signTransaction", { xdr, accountToSign: opts?.address });
    }
    async signAuthEntry(authEntry, opts) {
        return await HOT.request("stellar:signAuthEntry", { authEntry, accountToSign: opts?.address });
    }
    async signMessage(message, opts) {
        return await HOT.request("stellar:signMessage", { message, accountToSign: opts?.address });
    }
    async getNetwork() {
        return { network: "mainnet", networkPassphrase: Networks.PUBLIC };
    }
}
