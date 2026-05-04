import { default as albedoImport } from "@albedo-link/intent";
const albedo = albedoImport.default;
import { ModuleType, Networks } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const ALBEDO_ID = "albedo";
export class AlbedoModule {
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
            value: ALBEDO_ID
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
            throw parseError(e);
        }
    }
    async signTransaction(xdr, opts) {
        try {
            const { signed_envelope_xdr } = await albedo
                .tx({
                xdr,
                pubkey: opts?.address,
                network: opts?.networkPassphrase
                    ? opts.networkPassphrase === Networks.PUBLIC ? AlbedoNetwork.PUBLIC : AlbedoNetwork.TESTNET
                    : undefined,
            });
            return ({
                signedTxXdr: signed_envelope_xdr,
                signerAddress: opts?.address,
            });
        }
        catch (e) {
            throw parseError(e);
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
export var AlbedoNetwork;
(function (AlbedoNetwork) {
    AlbedoNetwork["PUBLIC"] = "public";
    AlbedoNetwork["TESTNET"] = "testnet";
})(AlbedoNetwork || (AlbedoNetwork = {}));
