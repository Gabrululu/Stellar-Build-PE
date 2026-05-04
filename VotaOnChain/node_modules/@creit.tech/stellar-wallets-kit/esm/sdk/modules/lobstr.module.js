import { getPublicKey, isConnected, signMessage, signTransaction } from "@lobstrco/signer-extension-api";
import { ModuleType } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const LOBSTR_ID = "lobstr";
export class LobstrModule {
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
            value: LOBSTR_ID
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
        return isConnected();
    }
    async getAddress() {
        try {
            await this.runChecks();
            const address = await getPublicKey();
            return ({ address });
        }
        catch (e) {
            throw parseError(e);
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
            const signedTxXdr = await signTransaction(xdr);
            return { signedTxXdr };
        }
        catch (e) {
            throw parseError(e);
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
            const result = await signMessage(message);
            if (!result) {
                throw new Error("Signing message failed");
            }
            return result;
        }
        catch (e) {
            throw parseError(e);
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
