export * from "./components.js";
export * from "./sdk.js";
export * from "./storage.js";
export var Networks;
(function (Networks) {
    Networks["PUBLIC"] = "Public Global Stellar Network ; September 2015";
    Networks["TESTNET"] = "Test SDF Network ; September 2015";
    Networks["FUTURENET"] = "Test SDF Future Network ; October 2022";
    Networks["SANDBOX"] = "Local Sandbox Stellar Network ; September 2022";
    Networks["STANDALONE"] = "Standalone Network ; February 2017";
})(Networks || (Networks = {}));
export var ModuleType;
(function (ModuleType) {
    ModuleType["HW_WALLET"] = "HW_WALLET";
    ModuleType["HOT_WALLET"] = "HOT_WALLET";
    ModuleType["BRIDGE_WALLET"] = "BRIDGE_WALLET";
    ModuleType["AIR_GAPED_WALLET"] = "AIR_GAPED_WALLET";
})(ModuleType || (ModuleType = {}));
export var KitEventType;
(function (KitEventType) {
    KitEventType["STATE_UPDATED"] = "STATE_UPDATE";
    KitEventType["WALLET_SELECTED"] = "WALLET_SELECTED";
    KitEventType["DISCONNECT"] = "DISCONNECT";
})(KitEventType || (KitEventType = {}));
