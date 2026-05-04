import TrezorConnectImport from "@trezor/connect-web";
const TrezorConnect = "default" in TrezorConnectImport
    ? TrezorConnectImport.default
    : TrezorConnectImport;
import { transformTransaction } from "@trezor/connect-plugin-stellar";
import { Transaction } from "@stellar/stellar-base";
import { decodeHex, encodeBase64 } from "../../deps/jsr.io/@std/encoding/1.0.10/mod.js";
import { hardwareWalletPaths, mnemonicPath, selectedNetwork } from "../../state/mod.js";
import { ModuleType } from "../../types/mod.js";
import { parseError } from "../utils.js";
export const TREZOR_ID = "TREZOR";
/**
 * **IMPORTANT**: This module requires that you have a "Buffer" polyfill in your app, if not provided then this module will break your app.
 */
export class TrezorModule {
    constructor(params) {
        Object.defineProperty(this, "_isAvailable", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "moduleType", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: ModuleType.HW_WALLET
        });
        Object.defineProperty(this, "productId", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: TREZOR_ID
        });
        Object.defineProperty(this, "productName", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "Trezor"
        });
        Object.defineProperty(this, "productUrl", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://www.trezor.com/"
        });
        Object.defineProperty(this, "productIcon", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: "https://stellar.creit.tech/wallet-icons/trezor.png"
        });
        if (!params)
            throw new Error("Trezor module requires some parameters to work.");
        TrezorConnect.init({
            manifest: {
                appName: params.appName,
                appUrl: params.appUrl,
                email: params.email,
            },
            // More advanced options
            debug: params.debug || false,
            lazyLoad: params.lazyLoad || false,
            coreMode: params.coreMode || "auto",
        }).then(() => {
            console.log("Trezor is ready");
            this._isAvailable = true;
        });
    }
    /**
     * `TrezorConnect` needs to be started before we can use it but because users most likely
     * won't use their devices as soon as the site loads, we return `true` since it should be already started
     * once the user needs to interact with it.
     */
    async isAvailable() {
        return true;
    }
    async runChecks() {
        if (!this._isAvailable) {
            throw parseError(new Error("Trezor connection has not been started yet."));
        }
    }
    async getAddress(opts) {
        await this.runChecks();
        try {
            let mnemonicPathValue = opts?.path || mnemonicPath.value;
            if (!mnemonicPathValue) {
                mnemonicPathValue = mnemonicPath.value;
            }
            if (!mnemonicPathValue)
                throw new Error("No mnemonic path has bee selected.");
            const result = await TrezorConnect.stellarGetAddress({
                path: mnemonicPathValue,
                showOnTrezor: false,
            });
            if (!result.success) {
                throw new Error(result.payload.error);
            }
            return { address: result.payload.address };
        }
        catch (e) {
            throw parseError(e);
        }
    }
    /**
     * This method is used by the Wallets Kit itself, if you're a dApp developer, most likely you don't need to use this method.
     * @param page - {Number}
     */
    async getAddresses(page = 0) {
        const startIndex = page * 10;
        const bundle = new Array(10)
            .fill(undefined)
            .map((_, i) => ({
            path: `m/44'/148'/${i + startIndex}'`,
            showOnTrezor: false,
        }));
        const result = await TrezorConnect.stellarGetAddress({ bundle });
        if (!result.success) {
            throw parseError(new Error(result.payload.error));
        }
        const results = result.payload.map((item, i) => ({
            publicKey: item.address,
            index: i + startIndex,
        }));
        hardwareWalletPaths.value = results;
        return results;
    }
    async signTransaction(xdr, opts) {
        await this.runChecks();
        let mnemonicPathValue;
        let account;
        if (opts?.path) {
            mnemonicPathValue = opts.path;
            const result = await TrezorConnect.stellarGetAddress({ path: mnemonicPathValue, showOnTrezor: false });
            if (!result.success) {
                throw new Error(result.payload.error);
            }
            account = result.payload.address;
        }
        else if (opts?.address) {
            const paths = hardwareWalletPaths.value;
            const target = paths.find((p) => p.publicKey === opts.address);
            if (!target)
                throw parseError(new Error("This address has not been loaded from this device"));
            mnemonicPathValue = `m/44'/148'/${target.index}'`;
            account = target.publicKey;
        }
        else {
            mnemonicPathValue = mnemonicPath.value;
            if (!mnemonicPathValue) {
                throw parseError(new Error("There is no path available, please call the `getAddress` method first."));
            }
            const result = await TrezorConnect.stellarGetAddress({ path: mnemonicPathValue, showOnTrezor: false });
            if (!result.success) {
                throw new Error(result.payload.error);
            }
            account = result.payload.address;
        }
        const network = opts?.networkPassphrase || selectedNetwork.value;
        if (!network)
            throw parseError(new Error("You need to provide or set a network passphrase"));
        const tx = new Transaction(xdr, network);
        const parsedTx = transformTransaction(mnemonicPathValue, tx);
        const result = await TrezorConnect.stellarSignTransaction(parsedTx);
        if (!result.success) {
            throw parseError(new Error(result.payload.error));
        }
        tx.addSignature(account, encodeBase64(decodeHex(result.payload.signature)));
        return {
            signedTxXdr: tx.toXDR(),
            signerAddress: account,
        };
    }
    async signAuthEntry() {
        throw {
            code: -3,
            message: 'Trezor Wallets do not support the "signAuthEntry" method',
        };
    }
    async signMessage() {
        throw {
            code: -3,
            message: 'Trezor Wallets do not support the "signMessage" method',
        };
    }
    async getNetwork() {
        throw {
            code: -3,
            message: 'Trezor Wallets do not support the "getNetwork" method',
        };
    }
}
