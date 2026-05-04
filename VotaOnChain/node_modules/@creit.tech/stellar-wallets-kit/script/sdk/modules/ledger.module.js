"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LedgerModule = exports.LEDGER_ID = void 0;
const hw_app_str_1 = __importDefault(require("@ledgerhq/hw-app-str"));
const Str = hw_app_str_1.default;
const hw_transport_1 = __importDefault(require("@ledgerhq/hw-transport"));
const Transport = hw_transport_1.default;
const hw_transport_webusb_1 = __importDefault(require("@ledgerhq/hw-transport-webusb"));
const TransportWebUSB = hw_transport_webusb_1.default;
const stellar_base_1 = require("@stellar/stellar-base");
const mod_js_1 = require("../../deps/jsr.io/@std/encoding/1.0.10/mod.js");
const utils_js_1 = require("../utils.js");
const mod_js_2 = require("../../types/mod.js");
const mod_js_3 = require("../../state/mod.js");
exports.LEDGER_ID = "LEDGER";
/**
 * **IMPORTANT**: This module requires that you have a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
class LedgerModule {
    constructor() {
        Object.defineProperty(this, "moduleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: mod_js_2.ModuleType.HW_WALLET
        });
        Object.defineProperty(this, "productId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: exports.LEDGER_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Ledger"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://www.ledger.com/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/ledger.png"
        });
        Object.defineProperty(this, "_transport", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
    }
    async transport() {
        if (!(await TransportWebUSB.isSupported()))
            throw new Error("Ledger can not be used with this device.");
        if (!this._transport) {
            this._transport = await TransportWebUSB.create();
        }
        if (!this._transport)
            throw new Error("Ledger Transport was not created.");
        return this._transport;
    }
    async disconnect() {
        this._transport?.close();
        this._transport = undefined;
    }
    async isAvailable() {
        return TransportWebUSB.isSupported();
    }
    async runChecks() {
        if (!(await this.isAvailable())) {
            throw new Error("Ledger wallets can not be used");
        }
    }
    async getAddress(opts) {
        await this.runChecks();
        try {
            const finalTransport = await this.transport();
            const str = new Str(finalTransport);
            let mnemonicPathValue = opts?.path || mod_js_3.mnemonicPath.value;
            if (!mnemonicPathValue) {
                mnemonicPathValue = mod_js_3.mnemonicPath.value;
            }
            const result = await str.getPublicKey(mnemonicPathValue);
            return { address: stellar_base_1.StrKey.encodeEd25519PublicKey(result.rawPublicKey) };
        }
        catch (e) {
            throw (0, utils_js_1.parseError)(e);
        }
    }
    /**
     * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
     * @param page - {Number}
     */
    async getAddresses(page = 0) {
        const finalTransport = await this.transport();
        const str = new Str(finalTransport);
        const startIndex = page * 10;
        const results = [];
        for (let i = 0; i < 10; i++) {
            const result = await str.getPublicKey(`44'/148'/${i + startIndex}'`);
            results.push({
                publicKey: stellar_base_1.StrKey.encodeEd25519PublicKey(result.rawPublicKey),
                index: i + startIndex,
            });
        }
        mod_js_3.hardwareWalletPaths.value = results;
        return results;
    }
    async signTransaction(xdr, opts) {
        await this.runChecks();
        const finalTransport = await this.transport();
        if (!finalTransport)
            throw new Error("Transport not possible to load.");
        const str = new Str(finalTransport);
        let mnemonicPathValue;
        let account;
        if (opts?.path) {
            mnemonicPathValue = opts.path;
            const result = await str.getPublicKey(mnemonicPathValue);
            account = stellar_base_1.StrKey.encodeEd25519PublicKey(result.rawPublicKey);
        }
        else if (opts?.address) {
            const paths = mod_js_3.hardwareWalletPaths.value;
            const target = paths
                .find((p) => p.publicKey === opts.address);
            if (!target)
                throw new Error("This address has not been loaded from this ledger");
            mnemonicPathValue = `44'/148'/${target.index}'`;
            account = target.publicKey;
        }
        else {
            mnemonicPathValue = mod_js_3.mnemonicPath.value;
            if (!mnemonicPathValue)
                throw new Error("There is no path available, please call the `getAddress` method first.");
            const result = await str.getPublicKey(mnemonicPathValue);
            account = stellar_base_1.StrKey.encodeEd25519PublicKey(result.rawPublicKey);
        }
        const network = opts?.networkPassphrase || mod_js_3.selectedNetwork.value;
        if (!network)
            throw new Error("You need to provide or set a network passphrase");
        const tx = new stellar_base_1.Transaction(xdr, network);
        const result = opts?.nonBlindTx
            ? await str.signTransaction(mnemonicPathValue, tx.signatureBase())
            : await str.signHash(mnemonicPathValue, tx.hash());
        tx.addSignature(account, (0, mod_js_1.encodeBase64)(result.signature));
        return {
            signedTxXdr: tx.toXDR(),
            signerAddress: account,
        };
    }
    async signAuthEntry() {
        throw {
            code: -3,
            message: 'Ledger Wallets do not support the "signAuthEntry" function',
        };
    }
    async signMessage() {
        throw {
            code: -3,
            message: 'Ledger Wallets do not support the "signMessage" function',
        };
    }
    async getNetwork() {
        throw {
            code: -3,
            message: 'Ledger Wallets do not support the "getNetwork" function',
        };
    }
}
exports.LedgerModule = LedgerModule;
