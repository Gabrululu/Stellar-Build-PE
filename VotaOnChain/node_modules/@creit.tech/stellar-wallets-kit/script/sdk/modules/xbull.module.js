"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.xBullModule = exports.XBULL_ID = void 0;
const xbull_wallet_connect_1 = require("@creit.tech/xbull-wallet-connect");
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.XBULL_ID = "xbull";
class xBullModule {
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
            value: exports.XBULL_ID
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
            const bridge = new xbull_wallet_connect_1.xBullWalletConnect();
            const publicKey = await bridge.connect();
            bridge.closeConnections();
            return { address: publicKey };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            const bridge = new xbull_wallet_connect_1.xBullWalletConnect();
            const signedXdr = await bridge.sign({
                xdr,
                publicKey: opts?.address,
                network: opts?.networkPassphrase,
            });
            bridge.closeConnections();
            return { signedTxXdr: signedXdr, signerAddress: opts?.address };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
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
            const bridge = new xbull_wallet_connect_1.xBullWalletConnect();
            const result = await bridge.signMessage(message, {
                address: opts?.address,
                networkPassphrase: opts?.networkPassphrase,
            });
            bridge.closeConnections();
            return result;
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    getNetwork() {
        return Promise.reject({
            code: -3,
            message: 'xBull does not support the "getNetwork" function',
        });
    }
}
exports.xBullModule = xBullModule;
