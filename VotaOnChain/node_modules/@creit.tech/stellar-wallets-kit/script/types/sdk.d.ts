import type { SwkAppTheme } from "./components.js";
import type { ModuleInterface, Networks } from "./mod.js";
export interface StellarWalletsKitInitParams {
    modules: ModuleInterface[];
    selectedWalletId?: string;
    network?: Networks;
    theme?: SwkAppTheme;
    authModal?: {
        showInstallLabel?: boolean;
        hideUnsupportedWallets?: boolean;
    };
}
export type AuthModalParams = {
    container?: HTMLElement;
};
export type ProfileModalParams = {
    container?: HTMLElement;
};
//# sourceMappingURL=sdk.d.ts.map