"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StellarWalletsKit = void 0;
const signals_1 = require("@preact/signals");
const preact_1 = require("htm/preact");
const preact_2 = require("preact");
const mod_js_1 = require("../types/mod.js");
const mod_js_2 = require("../state/mod.js");
const mod_js_3 = require("../components/mod.js");
const utils_js_1 = require("./utils.js");
const router_js_1 = require("../components/router.js");
class StellarWalletsKit {
    static init(params) {
        mod_js_2.activeModules.value = params.modules;
        if (params.selectedWalletId)
            StellarWalletsKit.setWallet(params.selectedWalletId);
        if (params.network)
            StellarWalletsKit.setNetwork(params.network);
        if (params.theme)
            StellarWalletsKit.setTheme(params.theme);
        if (params.authModal) {
            if (typeof params.authModal.showInstallLabel !== "undefined") {
                mod_js_2.showInstallLabel.value = params.authModal.showInstallLabel;
            }
            if (typeof params.authModal.hideUnsupportedWallets !== "undefined") {
                mod_js_2.hideUnsupportedWallets.value = params.authModal.hideUnsupportedWallets;
            }
        }
    }
    static get selectedModule() {
        if (!mod_js_2.activeModule.value) {
            throw { code: -3, message: "Please set the wallet first" };
        }
        return mod_js_2.activeModule.value;
    }
    /**
     * This method sets the active wallet (module) that will be used when calling others methods (for example getAddress).
     */
    static setWallet(id) {
        const target = mod_js_2.activeModules.value.find((mod) => mod.productId === id);
        if (!target)
            throw new Error(`Wallet id "${id}" is not and existing module`);
        mod_js_2.selectedModuleId.value = target.productId;
    }
    /**
     * This method sets the Stellar network the kit will use across calls.
     */
    static setNetwork(network) {
        mod_js_2.selectedNetwork.value = network;
    }
    /**
     * You can manually update the kit's styles with this method.
     */
    static setTheme(newTheme = mod_js_1.SwkAppLightTheme) {
        mod_js_2.theme.value = newTheme;
    }
    // ---------------------------------------------- Wallet Interaction ----------------------------------------------
    /**
     * This method will get you the `address` that's currently active in the Kit's memory. Such address is fetched when the user connects its wallet
     *
     * NOTE: If you want to fetch the address directly from the wallet, use the `fetchAddress` method instead.
     */
    static async getAddress() {
        if (!mod_js_2.activeAddress.value) {
            throw {
                code: -1,
                message: "No wallet has been connected.",
            };
        }
        return { address: mod_js_2.activeAddress.value };
    }
    /**
     * This method will fetch the address from the selected module and update the internal kit's memory
     *
     * NOTE: We suggest that you use `getAddress` when possible instead of this method. Trying to fetch the address from a module
     * that is not ready might cause unexpected behaviors (for example with Freighter if no permission has been granted or when the user is using a hardware wallet);
     */
    static async fetchAddress() {
        const { address } = await StellarWalletsKit.selectedModule.getAddress();
        mod_js_2.activeAddress.value = address;
        mod_js_2.addressUpdatedEvent.next(address);
        return { address };
    }
    static signTransaction(xdr, opts) {
        return StellarWalletsKit.selectedModule.signTransaction(xdr, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || mod_js_2.selectedNetwork.value,
        });
    }
    static signAuthEntry(authEntry, opts) {
        return StellarWalletsKit.selectedModule.signAuthEntry(authEntry, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || mod_js_2.selectedNetwork.value,
        });
    }
    static signMessage(message, opts) {
        return StellarWalletsKit.selectedModule.signMessage(message, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || mod_js_2.selectedNetwork.value,
        });
    }
    static signAndSubmitTransaction(xdr, opts) {
        const module = StellarWalletsKit.selectedModule;
        if (!module.signAndSubmitTransaction) {
            throw {
                code: -3,
                message: `The selected module "${module.productName}" does not support the "signAndSubmitTransaction" method.`,
            };
        }
        return module.signAndSubmitTransaction(xdr, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || mod_js_2.selectedNetwork.value,
        });
    }
    static getNetwork() {
        return StellarWalletsKit.selectedModule.getNetwork();
    }
    static async disconnect() {
        (0, utils_js_1.disconnect)();
    }
    static on(type, callback) {
        switch (type) {
            case mod_js_1.KitEventType.STATE_UPDATED: {
                let currentActiveAddress = undefined;
                let currentSelectedNetwork = undefined;
                return (0, signals_1.effect)(() => {
                    if ((mod_js_2.activeAddress.value !== currentActiveAddress || mod_js_2.selectedNetwork.value !== currentSelectedNetwork)) {
                        currentActiveAddress = mod_js_2.activeAddress.value;
                        currentSelectedNetwork = mod_js_2.selectedNetwork.value;
                        callback({
                            eventType: mod_js_1.KitEventType.STATE_UPDATED,
                            payload: { address: mod_js_2.activeAddress.value, networkPassphrase: mod_js_2.selectedNetwork.value },
                        });
                    }
                });
            }
            case mod_js_1.KitEventType.WALLET_SELECTED: {
                let current = undefined;
                return (0, signals_1.effect)(() => {
                    if (mod_js_2.selectedModuleId.value !== current) {
                        current = mod_js_2.selectedModuleId.value;
                        callback({
                            eventType: mod_js_1.KitEventType.WALLET_SELECTED,
                            payload: { id: mod_js_2.selectedModuleId.value },
                        });
                    }
                });
            }
            case mod_js_1.KitEventType.DISCONNECT:
                return mod_js_2.disconnectEvent.subscribe(() => {
                    callback({ eventType: mod_js_1.KitEventType.DISCONNECT, payload: {} });
                });
            default:
                throw new Error(`${type} event type is not supported`);
        }
    }
    static async refreshSupportedWallets() {
        const results = await Promise.all(mod_js_2.activeModules.value.map(async (mod) => {
            const timer = new Promise((r) => setTimeout(() => r(false), 1000));
            return {
                id: mod.productId,
                name: mod.productName,
                type: mod.moduleType,
                icon: mod.productIcon,
                isAvailable: await Promise.race([timer, mod.isAvailable()]).catch(() => false),
                isPlatformWrapper: await Promise.race([
                    timer,
                    mod.isPlatformWrapper ? mod.isPlatformWrapper() : Promise.resolve(false),
                ]).catch(() => false),
                url: mod.productUrl,
            };
        }));
        mod_js_2.allowedWallets.value = results;
        return results;
    }
    static async createButton(container, props = {}) {
        (0, preact_2.render)((0, preact_1.html) `
        <${mod_js_3.SwkButton}
          styles="${props.styles}"
          classes="${props.classes}"
          mode="${props.mode}"
          shape="${props.shape}"
          size="${props.size}"
          onClick="${() => props.onClick && props.onClick()}"
          children="${props.children}"
        />
      `, container);
    }
    // ---------------------------------------------- Modal methods ----------------------------------------------
    /**
     * This method opens an "authentication" modal where the user can pick the wallet they want to connect,
     * it sets the selected wallet as the currently active module and then it requests the public key from the wallet.
     */
    static async authModal(params) {
        (0, router_js_1.resetHistory)();
        (0, mod_js_3.navigateTo)(mod_js_1.SwkAppRoute.AUTH_OPTIONS);
        mod_js_2.mode.value = params?.container ? mod_js_1.SwkAppMode.BLOCK : mod_js_1.SwkAppMode.FIXED;
        const wrapper = document.createElement("div");
        (params?.container || document.body).appendChild(wrapper);
        (0, preact_2.render)((0, preact_1.html) `
        <${mod_js_3.SwkApp} />
      `, wrapper);
        await StellarWalletsKit.refreshSupportedWallets();
        const subs = [];
        const close = () => {
            for (const sub of subs)
                sub();
            (0, preact_2.render)(null, wrapper);
            wrapper.parentNode?.removeChild(wrapper);
        };
        return new Promise((resolve, reject) => {
            const sub1 = mod_js_2.addressUpdatedEvent.subscribe((result) => {
                if (typeof result === "string") {
                    resolve({ address: result });
                }
                else {
                    reject((0, utils_js_1.parseError)(result));
                }
            });
            const sub2 = mod_js_2.closeEvent.subscribe(() => {
                reject({ code: -1, message: "The user closed the modal." });
            });
            subs.push(sub1);
            subs.push(sub2);
        })
            .then((r) => {
            close();
            return r;
        })
            .catch((e) => {
            close();
            throw e;
        });
    }
    /**
     * This method opens the "profile" modal, this modal allows the user to check its currently connected account, copy its public key
     */
    static async profileModal(params) {
        if (!mod_js_2.activeAddress.value) {
            throw { code: -1, message: "There is no active address, the user needs to authenticate first." };
        }
        (0, router_js_1.resetHistory)();
        (0, mod_js_3.navigateTo)(mod_js_1.SwkAppRoute.PROFILE_PAGE);
        mod_js_2.mode.value = params?.container ? mod_js_1.SwkAppMode.BLOCK : mod_js_1.SwkAppMode.FIXED;
        const wrapper = document.createElement("div");
        (params?.container || document.body).appendChild(wrapper);
        (0, preact_2.render)((0, preact_1.html) `
        <${mod_js_3.SwkApp} />
      `, wrapper);
        const sub = mod_js_2.closeEvent.subscribe(() => {
            sub();
            (0, preact_2.render)(null, wrapper);
            wrapper.parentNode?.removeChild(wrapper);
        });
    }
}
exports.StellarWalletsKit = StellarWalletsKit;
