"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateActiveSession = exports.updatedSelectedModule = exports.updatedThemeEffect = void 0;
const signals_1 = require("@preact/signals");
const values_js_1 = require("./values.js");
const mod_js_1 = require("../types/mod.js");
const localstorage = globalThis.localStorage;
const document = globalThis.document;
exports.updatedThemeEffect = (0, signals_1.effect)(() => {
    if (document) {
        for (const [key, value] of Object.entries(values_js_1.theme.value)) {
            document.documentElement.style.setProperty(`--swk-${key}`, value);
        }
    }
});
exports.updatedSelectedModule = (0, signals_1.effect)(() => {
    if (localstorage && !!values_js_1.activeModule.value) {
        try {
            const record = localstorage.getItem(mod_js_1.LocalStorageKeys.usedWalletsIds);
            const usedWalletsIds = record ? new Set(JSON.parse(record)) : new Set();
            if (usedWalletsIds.has(values_js_1.activeModule.value.productId)) {
                usedWalletsIds.delete(values_js_1.activeModule.value.productId);
            }
            localstorage.setItem(mod_js_1.LocalStorageKeys.usedWalletsIds, JSON.stringify([values_js_1.activeModule.value.productId, ...usedWalletsIds]));
        }
        catch (e) {
            console.error(e);
        }
    }
});
exports.updateActiveSession = (0, signals_1.effect)(() => {
    if (localstorage) {
        if (values_js_1.activeAddress.value) {
            localstorage.setItem(mod_js_1.LocalStorageKeys.activeAddress, values_js_1.activeAddress.value);
        }
        else {
            localstorage.removeItem(mod_js_1.LocalStorageKeys.activeAddress);
        }
        if (values_js_1.selectedModuleId.value) {
            localstorage.setItem(mod_js_1.LocalStorageKeys.selectedModuleId, values_js_1.selectedModuleId.value);
        }
        else {
            localstorage.removeItem(mod_js_1.LocalStorageKeys.selectedModuleId);
        }
        if (typeof values_js_1.hardwareWalletPaths.value !== "undefined") {
            localstorage.setItem(mod_js_1.LocalStorageKeys.hardwareWalletPaths, JSON.stringify(values_js_1.hardwareWalletPaths.value));
        }
        if (typeof values_js_1.wcSessionPaths.value !== "undefined") {
            localstorage.setItem(mod_js_1.LocalStorageKeys.wcSessionPaths, JSON.stringify(values_js_1.wcSessionPaths.value));
        }
    }
});
