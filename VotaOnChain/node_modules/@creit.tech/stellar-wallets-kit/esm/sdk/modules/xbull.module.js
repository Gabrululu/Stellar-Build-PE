import { xBullWalletConnect } from "@creit.tech/xbull-wallet-connect";
import { ModuleType } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const XBULL_ID = "xbull";
export class xBullModule {
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
            value: XBULL_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "xBull"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://xbull.app"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/xbull.png"
        });
    }
    isAvailable() {
        return Promise.resolve(true);
    }
    async getAddress() {
        try {
            const bridge = new xBullWalletConnect();
            const publicKey = await bridge.connect();
            bridge.closeConnections();
            return { address: publicKey };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            const bridge = new xBullWalletConnect();
            const signedXdr = await bridge.sign({
                xdr,
                publicKey: opts?.address,
                network: opts?.networkPassphrase,
            });
            bridge.closeConnections();
            return { signedTxXdr: signedXdr, signerAddress: opts?.address };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    signAuthEntry() {
        return Promise.reject({
            code: -3,
            message: 'xBull does not support the "signAuthEntry" function',
        });
    }
    async signMessage(message, opts) {
        try {
            const bridge = new xBullWalletConnect();
            const result = await bridge.signMessage(message, {
                address: opts?.address,
                networkPassphrase: opts?.networkPassphrase,
            });
            bridge.closeConnections();
            return result;
        }
        catch (e) {
            throw parseError(e);
        }
    }
    getNetwork() {
        return Promise.reject({
            code: -3,
            message: 'xBull does not support the "getNetwork" function',
        });
    }
}
