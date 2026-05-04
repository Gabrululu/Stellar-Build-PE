import { computed, signal } from "@preact/signals";
import { LocalStorageKeys, Networks, SwkAppLightTheme, SwkAppMode, SwkAppRoute, } from "../types/mod.js";
const localstorage = globalThis.localStorage;
///////////////////////////////////
/// Configuration state signals ///
///////////////////////////////////
export const mode = signal(SwkAppMode.FIXED);
export const modalTitle = signal("Connect a Wallet");
export const showInstallLabel = signal(true);
export const hideUnsupportedWallets = signal(true);
export const installText = signal("Install");
export const horizonUrl = signal("https://horizon.stellar.org");
export const selectedNetwork = signal(Networks.PUBLIC);
export const theme = signal(SwkAppLightTheme);
///////////////////////////////////
///      App state signals      ///
///////////////////////////////////
export const route = signal(SwkAppRoute.AUTH_OPTIONS);
export const routerHistory = signal([SwkAppRoute.AUTH_OPTIONS]);
///////////////////////////////////
///    Wallets state signals    ///
///////////////////////////////////
export const activeAddress = signal(localstorage?.getItem(LocalStorageKeys.activeAddress) || undefined);
export const selectedModuleId = signal(localstorage?.getItem(LocalStorageKeys.selectedModuleId) || undefined);
export const allowedWallets = signal([]);
export const activeModules = signal([]);
export const activeModule = computed(() => {
    return activeModules.value
        .find((m) => m.productId === selectedModuleId.value);
});
const hardwareWalletPathsInitial = localstorage?.getItem(LocalStorageKeys.hardwareWalletPaths);
export const hardwareWalletPaths = signal(JSON.parse(hardwareWalletPathsInitial || "[]"));
export const mnemonicPath = computed(() => {
    const path = hardwareWalletPaths.value.find(({ publicKey }) => publicKey === activeAddress.value);
    if (!path)
        return undefined;
    return `44'/148'/${path.index}'`;
});
const wcSessionPathsInitial = localstorage?.getItem(LocalStorageKeys.wcSessionPaths);
export const wcSessionPaths = signal(JSON.parse(wcSessionPathsInitial || "[]"));
export function resetWalletState() {
    routerHistory.value = [];
    hardwareWalletPaths.value = [];
    wcSessionPaths.value = [];
    activeAddress.value = undefined;
    selectedModuleId.value = undefined;
}
