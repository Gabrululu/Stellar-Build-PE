import { getAddress, getNetwork, isConnected, requestAccess, signAuthEntry, signMessage, signTransaction, } from "@stellar/freighter-api";
import { encodeBase64 } from "../../deps/jsr.io/@std/encoding/1.0.10/mod.js";
import { ModuleType } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const FREIGHTER_ID = "freighter";
export class FreighterModule {
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
            value: FREIGHTER_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Freighter"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://freighter.app"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/freighter.png"
        });
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error("Freighter is not connected");
        }
    }
    async isAvailable() {
        // If these values are set it means we are loading the module from the Freighter's mobile version and so we need to
        // use WalletConnect instead.
        if (window.stellar?.provider === "freighter" && window.stellar?.platform === "mobile")
            return false;
        try {
            const response = await isConnected();
            return !response.error && response.isConnected;
        }
        catch (e) {
            console.error(e);
            return false;
        }
    }
    async getAddress(params) {
        try {
            await this.runChecks();
            if (params?.skipRequestAccess !== true) {
                const requestAccessResult = await requestAccess();
                if (requestAccessResult.error)
                    return Promise.reject(parseError(requestAccessResult.error));
            }
            const { address, error } = await getAddress();
            if (error)
                return Promise.reject(error);
            if (!address) {
                return Promise.reject({
                    code: -3,
                    message: "Getting the address from Freighter is not allowed, please request access first.",
                });
            }
            return { address };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            await this.runChecks();
            const { signedTxXdr, signerAddress, error } = await signTransaction(xdr, {
                address: opts?.address,
                networkPassphrase: opts?.networkPassphrase,
            });
            if (error)
                return Promise.reject(error);
            return { signedTxXdr, signerAddress: signerAddress };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signAuthEntry(authEntry, opts) {
        try {
            await this.runChecks();
            const { signedAuthEntry, signerAddress, error } = await signAuthEntry(authEntry, {
                address: opts?.address,
                networkPassphrase: opts?.networkPassphrase,
            });
            if (error)
                return Promise.reject(error);
            if (!signedAuthEntry) {
                return Promise.reject({
                    code: -3,
                    message: "signedAuthEntry returned from Freighter is undefined.",
                });
            }
            return {
                signedAuthEntry: typeof signedAuthEntry === "string"
                    ? signedAuthEntry
                    : encodeBase64(new Uint8Array(signedAuthEntry)),
                signerAddress: signerAddress,
            };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signMessage(message, opts) {
        try {
            await this.runChecks();
            const { signedMessage, signerAddress, error } = await signMessage(message, {
                address: opts?.address,
                networkPassphrase: opts?.networkPassphrase,
            });
            if (error)
                return Promise.reject(error);
            if (!signedMessage) {
                return Promise.reject({
                    code: -3,
                    message: "signedMessage returned from Freighter is undefined.",
                });
            }
            return {
                signedMessage: typeof signedMessage === "string" ? signedMessage : encodeBase64(new Uint8Array(signedMessage)),
                signerAddress: signerAddress,
            };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async getNetwork() {
        try {
            await this.runChecks();
            const { network, networkPassphrase, error } = await getNetwork();
            if (error)
                return Promise.reject(error);
            return { network, networkPassphrase };
        }
        catch (e) {
            throw parseError(e);
        }
    }
}
