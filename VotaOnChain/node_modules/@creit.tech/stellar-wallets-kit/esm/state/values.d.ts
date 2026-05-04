import { type ReadonlySignal, type Signal } from "@preact/signals";
import { type ISupportedWallet, type ModuleInterface, Networks, SwkAppMode, SwkAppRoute, type SwkAppTheme } from "../types/mod.js";
export declare const mode: Signal<SwkAppMode>;
export declare const modalTitle: Signal<string>;
export declare const showInstallLabel: Signal<boolean>;
export declare const hideUnsupportedWallets: Signal<boolean>;
export declare const installText: Signal<string>;
export declare const horizonUrl: Signal<string>;
export declare const selectedNetwork: Signal<Networks>;
export declare const theme: Signal<SwkAppTheme>;
export declare const route: Signal<SwkAppRoute>;
export declare const routerHistory: Signal<SwkAppRoute[]>;
export declare const activeAddress: Signal<string | undefined>;
export declare const selectedModuleId: Signal<string | undefined>;
export declare const allowedWallets: Signal<ISupportedWallet[]>;
export declare const activeModules: Signal<ModuleInterface[]>;
export declare const activeModule: ReadonlySignal<ModuleInterface | undefined>;
export declare const hardwareWalletPaths: Signal<Array<{
    publicKey: string;
    index: number;
}>>;
export declare const mnemonicPath: Signal<string | undefined>;
export declare const wcSessionPaths: Signal<Array<{
    publicKey: string;
    topic: string;
}>>;
export declare function resetWalletState(): void;
//# sourceMappingURL=values.d.ts.map