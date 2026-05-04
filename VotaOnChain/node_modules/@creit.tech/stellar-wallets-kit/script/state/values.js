"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wcSessionPaths = exports.mnemonicPath = exports.hardwareWalletPaths = exports.activeModule = exports.activeModules = exports.allowedWallets = exports.selectedModuleId = exports.activeAddress = exports.routerHistory = exports.route = exports.theme = exports.selectedNetwork = exports.horizonUrl = exports.installText = exports.hideUnsupportedWallets = exports.showInstallLabel = exports.modalTitle = exports.mode = void 0;
exports.resetWalletState = resetWalletState;
const signals_1 = require("@preact/signals");
const mod_js_1 = require("../types/mod.js");
const localstorage = globalThis.localStorage;
///////////////////////////////////
/// Configuration state signals ///
///////////////////////////////////
exports.mode = (0, signals_1.signal)(mod_js_1.SwkAppMode.FIXED);
exports.modalTitle = (0, signals_1.signal)("Connect a Wallet");
exports.showInstallLabel = (0, signals_1.signal)(true);
exports.hideUnsupportedWallets = (0, signals_1.signal)(true);
exports.installText = (0, signals_1.signal)("Install");
exports.horizonUrl = (0, signals_1.signal)("https://horizon.stellar.org");
exports.selectedNetwork = (0, signals_1.signal)(mod_js_1.Networks.PUBLIC);
exports.theme = (0, signals_1.signal)(mod_js_1.SwkAppLightTheme);
///////////////////////////////////
///      App state signals      ///
///////////////////////////////////
exports.route = (0, signals_1.signal)(mod_js_1.SwkAppRoute.AUTH_OPTIONS);
exports.routerHistory = (0, signals_1.signal)([mod_js_1.SwkAppRoute.AUTH_OPTIONS]);
///////////////////////////////////
///    Wallets state signals    ///
///////////////////////////////////
exports.activeAddress = (0, signals_1.signal)(localstorage?.getItem(mod_js_1.LocalStorageKeys.activeAddress) || undefined);
exports.selectedModuleId = (0, signals_1.signal)(localstorage?.getItem(mod_js_1.LocalStorageKeys.selectedModuleId) || undefined);
exports.allowedWallets = (0, signals_1.signal)([]);
exports.activeModules = (0, signals_1.signal)([]);
exports.activeModule = (0, signals_1.computed)(() => {
    return exports.activeModules.value
        .find((m) => m.productId === exports.selectedModuleId.value);
});
const hardwareWalletPathsInitial = localstorage?.getItem(mod_js_1.LocalStorageKeys.hardwareWalletPaths);
exports.hardwareWalletPaths = (0, signals_1.signal)(JSON.parse(hardwareWalletPathsInitial || "[]"));
exports.mnemonicPath = (0, signals_1.computed)(() => {
    const path = exports.hardwareWalletPaths.value.find(({ publicKey }) => publicKey === exports.activeAddress.value);
    if (!path)
        return undefined;
    return `44'/148'/${path.index}'`;
});
const wcSessionPathsInitial = localstorage?.getItem(mod_js_1.LocalStorageKeys.wcSessionPaths);
exports.wcSessionPaths = (0, signals_1.signal)(JSON.parse(wcSessionPathsInitial || "[]"));
function resetWalletState() {
    exports.routerHistory.value = [];
    exports.hardwareWalletPaths.value = [];
    exports.wcSessionPaths.value = [];
    exports.activeAddress.value = undefined;
    exports.selectedModuleId.value = undefined;
}
