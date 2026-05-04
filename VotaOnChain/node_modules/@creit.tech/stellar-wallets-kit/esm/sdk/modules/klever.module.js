import { ModuleType } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const KLEVER_ID = "klever";
export class KleverModule {
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
            value: KLEVER_ID
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
            throw parseError(e);
        });
    }
    async signTransaction(xdr, opts) {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.signTransaction(xdr, opts))
            .catch((e) => {
            throw parseError(e);
        });
    }
    async signAuthEntry(authEntry, opts) {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.signAuthEntry(authEntry, opts))
            .catch((e) => {
            throw parseError(e);
        });
    }
    async signMessage(message, opts) {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.signMessage(message, opts))
            .catch((e) => {
            throw parseError(e);
        });
    }
    async getNetwork() {
        return this.runChecks()
            .then(() => window.kleverWallet.stellar.getNetwork())
            .catch((e) => {
            throw parseError(e);
        });
    }
}
