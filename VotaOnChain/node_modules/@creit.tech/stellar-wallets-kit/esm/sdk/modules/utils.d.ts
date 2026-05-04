import type { ModuleInterface } from "../../types/mod.js";
/**
 * This method returns all modules that don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 *
 * Note: If you are the creator of a module and you want the module to be listed here, the module must not require any extra configuration nor polyfills (everything should be include already in your module's dependencies).
 * If your module requires some extra polyfill or configuration then the user of the kit needs to include it manually.
 */
export declare function defaultModules(opts?: {
    filterBy: (module: ModuleInterface) => boolean;
}): ModuleInterface[];
/**
 * This method only returns those modules from wallets that follow exactly the SEP-43 standard and don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 *
 * Note: If you are the creator of a module and you want the module to be listed here, the module must not require any extra configuration nor polyfills (everything should be included already in your module's dependencies).
 * If your module requires some extra polyfill or configuration then the user of the kit needs to include it manually.
 */
export declare function sep43Modules(opts?: {
    filterBy: (module: ModuleInterface) => boolean;
}): ModuleInterface[];
//# sourceMappingURL=utils.d.ts.map