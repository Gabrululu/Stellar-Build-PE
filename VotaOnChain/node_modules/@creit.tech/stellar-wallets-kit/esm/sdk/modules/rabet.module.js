import { ModuleType, Networks } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const RABET_ID = "rabet";
export class RabetModule {
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
            value: RABET_ID
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
            throw parseError(e);
        }
    }
    async signTransaction(xdr, opts) {
        if (opts?.networkPassphrase &&
            opts.networkPassphrase !== Networks.PUBLIC &&
            opts.networkPassphrase !== Networks.TESTNET) {
            throw new Error(`Rabet doesn't support the network: ${opts.networkPassphrase}`);
        }
        if (opts?.address) {
            console.warn(`Rabet doesn't allow specifying the network that should be used, we skip the value`);
        }
        try {
            await this.runChecks();
            const result = await window.rabet.sign(xdr, opts?.networkPassphrase === Networks.PUBLIC ? RabetNetwork.PUBLIC : RabetNetwork.TESTNET);
            return { signedTxXdr: result?.xdr };
        }
        catch (e) {
            throw parseError(e);
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
export var RabetNetwork;
(function (RabetNetwork) {
    RabetNetwork["PUBLIC"] = "mainnet";
    RabetNetwork["TESTNET"] = "testnet";
})(RabetNetwork || (RabetNetwork = {}));
