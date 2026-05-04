import { activeModule, resetWalletState } from "../state/values.js";
import { closeEvent, disconnectEvent } from "../state/events.js";
export function parseError(e) {
    return {
        code: e?.error?.code || e?.code || -1,
        message: e?.error?.message || e?.message || (typeof e === "string" && e) || "Unhandled error from the wallet",
        ext: e?.error?.ext || e?.ext,
    };
}
export function disconnect() {
    if (activeModule.value?.disconnect) {
        activeModule.value.disconnect();
    }
    resetWalletState();
    disconnectEvent.next();
    closeEvent.next();
}
