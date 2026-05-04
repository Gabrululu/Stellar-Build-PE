"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KitEventType = exports.ModuleType = exports.Networks = void 0;
__exportStar(require("./components.js"), exports);
__exportStar(require("./sdk.js"), exports);
__exportStar(require("./storage.js"), exports);
var Networks;
(function (Networks) {
    Networks["PUBLIC"] = "Public Global Stellar Network ; September 2015";
    Networks["TESTNET"] = "Test SDF Network ; September 2015";
    Networks["FUTURENET"] = "Test SDF Future Network ; October 2022";
    Networks["SANDBOX"] = "Local Sandbox Stellar Network ; September 2022";
    Networks["STANDALONE"] = "Standalone Network ; February 2017";
})(Networks || (exports.Networks = Networks = {}));
var ModuleType;
(function (ModuleType) {
    ModuleType["HW_WALLET"] = "HW_WALLET";
    ModuleType["HOT_WALLET"] = "HOT_WALLET";
    ModuleType["BRIDGE_WALLET"] = "BRIDGE_WALLET";
    ModuleType["AIR_GAPED_WALLET"] = "AIR_GAPED_WALLET";
})(ModuleType || (exports.ModuleType = ModuleType = {}));
var KitEventType;
(function (KitEventType) {
    KitEventType["STATE_UPDATED"] = "STATE_UPDATE";
    KitEventType["WALLET_SELECTED"] = "WALLET_SELECTED";
    KitEventType["DISCONNECT"] = "DISCONNECT";
})(KitEventType || (exports.KitEventType = KitEventType = {}));
