import { effect } from "@preact/signals";
import { activeAddress, activeModule, hardwareWalletPaths, selectedModuleId, theme, wcSessionPaths } from "./values.js";
import { LocalStorageKeys } from "../types/mod.js";
const localstorage = globalThis.localStorage;
const document = globalThis.document;
export const updatedThemeEffect = effect(() => {
    if (document) {
        for (const [key, value] of Object.entries(theme.value)) {
            document.documentElement.style.setProperty(`--swk-${key}`, value);
        }
    }
});
export const updatedSelectedModule = effect(() => {
    if (localstorage && !!activeModule.value) {
        try {
            const record = localstorage.getItem(LocalStorageKeys.usedWalletsIds);
            const usedWalletsIds = record ? new Set(JSON.parse(record)) : new Set();
            if (usedWalletsIds.has(activeModule.value.productId)) {
                usedWalletsIds.delete(activeModule.value.productId);
            }
            localstorage.setItem(LocalStorageKeys.usedWalletsIds, JSON.stringify([activeModule.value.productId, ...usedWalletsIds]));
        }
        catch (e) {
            console.error(e);
        }
    }
});
export const updateActiveSession = effect(() => {
    if (localstorage) {
        if (activeAddress.value) {
            localstorage.setItem(LocalStorageKeys.activeAddress, activeAddress.value);
        }
        else {
            localstorage.removeItem(LocalStorageKeys.activeAddress);
        }
        if (selectedModuleId.value) {
            localstorage.setItem(LocalStorageKeys.selectedModuleId, selectedModuleId.value);
        }
        else {
            localstorage.removeItem(LocalStorageKeys.selectedModuleId);
        }
        if (typeof hardwareWalletPaths.value !== "undefined") {
            localstorage.setItem(LocalStorageKeys.hardwareWalletPaths, JSON.stringify(hardwareWalletPaths.value));
        }
        if (typeof wcSessionPaths.value !== "undefined") {
            localstorage.setItem(LocalStorageKeys.wcSessionPaths, JSON.stringify(wcSessionPaths.value));
        }
    }
});
