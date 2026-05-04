"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbedoNetwork = exports.AlbedoModule = exports.ALBEDO_ID = void 0;
const intent_1 = __importDefault(require("@albedo-link/intent"));
const albedo = intent_1.default.default;
const mod_js_1 = require("../../types/mod.js");
const utils_js_1 = require("../utils.js");
exports.ALBEDO_ID = "albedo";
class AlbedoModule {
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
            value: exports.ALBEDO_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Albedo"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://albedo.link/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/albedo.png"
        });
    }
    async isAvailable() {
        return true;
    }
    async getAddress() {
        try {
            const result = await albedo
                .publicKey({});
            return ({ address: result.pubkey });
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            const { signed_envelope_xdr } = await albedo
                .tx({
                xdr,
                pubkey: opts?.address,
                network: opts?.networkPassphrase
                    ? opts.networkPassphrase === mod_js_1.Networks.PUBLIC ? AlbedoNetwork.PUBLIC : AlbedoNetwork.TESTNET
                    : undefined,
            });
            return ({
                signedTxXdr: signed_envelope_xdr,
                signerAddress: opts?.address,
            });
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    async signAuthEntry() {
        throw {
            code: -3,
            message: 'Albedo does not support the "signAuthEntry" function',
        };
    }
    /**
     * We understand that Albedo has a method to sign a message, but that method is not compatible with SEP-0043
     */
    async signMessage() {
        throw {
            code: -3,
            message: 'Albedo does not support the "signMessage" function',
        };
    }
    async getNetwork() {
        throw {
            code: -3,
            message: 'Albedo does not support the "getNetwork" function',
        };
    }
}
exports.AlbedoModule = AlbedoModule;
var AlbedoNetwork;
(function (AlbedoNetwork) {
    AlbedoNetwork["PUBLIC"] = "public";
    AlbedoNetwork["TESTNET"] = "testnet";
})(AlbedoNetwork || (exports.AlbedoNetwork = AlbedoNetwork = {}));
