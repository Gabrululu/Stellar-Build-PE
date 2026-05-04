import { effect } from "@preact/signals";
import { html } from "htm/preact";
import { render } from "preact";
import { KitEventType, SwkAppLightTheme, SwkAppMode, SwkAppRoute, } from "../types/mod.js";
import { activeAddress, activeModule, activeModules, addressUpdatedEvent, allowedWallets, closeEvent, disconnectEvent, hideUnsupportedWallets, mode, selectedModuleId, selectedNetwork, showInstallLabel, theme, } from "../state/mod.js";
import { navigateTo, SwkApp, SwkButton } from "../components/mod.js";
import { disconnect, parseError } from "./utils.js";
import { resetHistory } from "../components/router.js";
export class StellarWalletsKit {
    static init(params) {
        activeModules.value = params.modules;
        if (params.selectedWalletId)
            StellarWalletsKit.setWallet(params.selectedWalletId);
        if (params.network)
            StellarWalletsKit.setNetwork(params.network);
        if (params.theme)
            StellarWalletsKit.setTheme(params.theme);
        if (params.authModal) {
            if (typeof params.authModal.showInstallLabel !== "undefined") {
                showInstallLabel.value = params.authModal.showInstallLabel;
            }
            if (typeof params.authModal.hideUnsupportedWallets !== "undefined") {
                hideUnsupportedWallets.value = params.authModal.hideUnsupportedWallets;
            }
        }
    }
    static get selectedModule() {
        if (!activeModule.value) {
            throw { code: -3, message: "Please set the wallet first" };
        }
        return activeModule.value;
    }
    /**
     * This method sets the active wallet (module) that will be used when calling others methods (for example getAddress).
     */
    static setWallet(id) {
        const target = activeModules.value.find((mod) => mod.productId === id);
        if (!target)
            throw new Error(`Wallet id "${id}" is not and existing module`);
        selectedModuleId.value = target.productId;
    }
    /**
     * This method sets the Stellar network the kit will use across calls.
     */
    static setNetwork(network) {
        selectedNetwork.value = network;
    }
    /**
     * You can manually update the kit's styles with this method.
     */
    static setTheme(newTheme = SwkAppLightTheme) {
        theme.value = newTheme;
    }
    // ---------------------------------------------- Wallet Interaction ----------------------------------------------
    /**
     * This method will get you the `address` that's currently active in the Kit's memory. Such address is fetched when the user connects its wallet
     *
     * NOTE: If you want to fetch the address directly from the wallet, use the `fetchAddress` method instead.
     */
    static async getAddress() {
        if (!activeAddress.value) {
            throw {
                code: -1,
                message: "No wallet has been connected.",
            };
        }
        return { address: activeAddress.value };
    }
    /**
     * This method will fetch the address from the selected module and update the internal kit's memory
     *
     * NOTE: We suggest that you use `getAddress` when possible instead of this method. Trying to fetch the address from a module
     * that is not ready might cause unexpected behaviors (for example with Freighter if no permission has been granted or when the user is using a hardware wallet);
     */
    static async fetchAddress() {
        const { address } = await StellarWalletsKit.selectedModule.getAddress();
        activeAddress.value = address;
        addressUpdatedEvent.next(address);
        return { address };
    }
    static signTransaction(xdr, opts) {
        return StellarWalletsKit.selectedModule.signTransaction(xdr, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || selectedNetwork.value,
        });
    }
    static signAuthEntry(authEntry, opts) {
        return StellarWalletsKit.selectedModule.signAuthEntry(authEntry, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || selectedNetwork.value,
        });
    }
    static signMessage(message, opts) {
        return StellarWalletsKit.selectedModule.signMessage(message, {
            ...opts,
            networkPassphrase: opts?.networkPassphrase || selectedNetwork.value,
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
            networkPassphrase: opts?.networkPassphrase || selectedNetwork.value,
        });
    }
    static getNetwork() {
        return StellarWalletsKit.selectedModule.getNetwork();
    }
    static async disconnect() {
        disconnect();
    }
    static on(type, callback) {
        switch (type) {
            case KitEventType.STATE_UPDATED: {
                let currentActiveAddress = undefined;
                let currentSelectedNetwork = undefined;
                return effect(() => {
                    if ((activeAddress.value !== currentActiveAddress || selectedNetwork.value !== currentSelectedNetwork)) {
                        currentActiveAddress = activeAddress.value;
                        currentSelectedNetwork = selectedNetwork.value;
                        callback({
                            eventType: KitEventType.STATE_UPDATED,
                            payload: { address: activeAddress.value, networkPassphrase: selectedNetwork.value },
                        });
                    }
                });
            }
            case KitEventType.WALLET_SELECTED: {
                let current = undefined;
                return effect(() => {
                    if (selectedModuleId.value !== current) {
                        current = selectedModuleId.value;
                        callback({
                            eventType: KitEventType.WALLET_SELECTED,
                            payload: { id: selectedModuleId.value },
                        });
                    }
                });
            }
            case KitEventType.DISCONNECT:
                return disconnectEvent.subscribe(() => {
                    callback({ eventType: KitEventType.DISCONNECT, payload: {} });
                });
            default:
                throw new Error(`${type} event type is not supported`);
        }
    }
    static async refreshSupportedWallets() {
        const results = await Promise.all(activeModules.value.map(async (mod) => {
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
        allowedWallets.value = results;
        return results;
    }
    static async createButton(container, props = {}) {
        render(html `
        <${SwkButton}
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
        resetHistory();
        navigateTo(SwkAppRoute.AUTH_OPTIONS);
        mode.value = params?.container ? SwkAppMode.BLOCK : SwkAppMode.FIXED;
        const wrapper = document.createElement("div");
        (params?.container || document.body).appendChild(wrapper);
        render(html `
        <${SwkApp} />
      `, wrapper);
        await StellarWalletsKit.refreshSupportedWallets();
        const subs = [];
        const close = () => {
            for (const sub of subs)
                sub();
            render(null, wrapper);
            wrapper.parentNode?.removeChild(wrapper);
        };
        return new Promise((resolve, reject) => {
            const sub1 = addressUpdatedEvent.subscribe((result) => {
                if (typeof result === "string") {
                    resolve({ address: result });
                }
                else {
                    reject(parseError(result));
                }
            });
            const sub2 = closeEvent.subscribe(() => {
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
        if (!activeAddress.value) {
            throw { code: -1, message: "There is no active address, the user needs to authenticate first." };
        }
        resetHistory();
        navigateTo(SwkAppRoute.PROFILE_PAGE);
        mode.value = params?.container ? SwkAppMode.BLOCK : SwkAppMode.FIXED;
        const wrapper = document.createElement("div");
        (params?.container || document.body).appendChild(wrapper);
        render(html `
        <${SwkApp} />
      `, wrapper);
        const sub = closeEvent.subscribe(() => {
            sub();
            render(null, wrapper);
            wrapper.parentNode?.removeChild(wrapper);
        });
    }
}
