"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseError = parseError;
exports.disconnect = disconnect;
const values_js_1 = require("../state/values.js");
const events_js_1 = require("../state/events.js");
function parseError(e) {
    return {
        code: e?.error?.code || e?.code || -1,
        message: e?.error?.message || e?.message || (typeof e === "string" && e) || "Unhandled error from the wallet",
        ext: e?.error?.ext || e?.ext,
    };
}
function disconnect() {
    if (values_js_1.activeModule.value?.disconnect) {
        values_js_1.activeModule.value.disconnect();
    }
    (0, values_js_1.resetWalletState)();
    events_js_1.disconnectEvent.next();
    events_js_1.closeEvent.next();
}
