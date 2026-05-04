import { AlbedoModule } from "./albedo.module.js";
import { FreighterModule } from "./freighter.module.js";
import { LobstrModule } from "./lobstr.module.js";
import { RabetModule } from "./rabet.module.js";
import { xBullModule } from "./xbull.module.js";
import { HanaModule } from "./hana.module.js";
import { KleverModule } from "./klever.module.js";
import { OneKeyModule } from "./onekey.module.js";
import { BitgetModule } from "./bitget.module.js";
/**
 * This method returns all modules that don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 *
 * Note: If you are the creator of a module and you want the module to be listed here, the module must not require any extra configuration nor polyfills (everything should be include already in your module's dependencies).
 * If your module requires some extra polyfill or configuration then the user of the kit needs to include it manually.
 */
export function defaultModules(opts) {
    const modules = [
        new AlbedoModule(),
        new FreighterModule(),
        new RabetModule(),
        new xBullModule(),
        new LobstrModule(),
        new HanaModule(),
        new KleverModule(),
        new OneKeyModule(),
        new BitgetModule(),
    ];
    return opts?.filterBy ? modules.filter(opts.filterBy) : modules;
}
/**
 * This method only returns those modules from wallets that follow exactly the SEP-43 standard and don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 *
 * Note: If you are the creator of a module and you want the module to be listed here, the module must not require any extra configuration nor polyfills (everything should be included already in your module's dependencies).
 * If your module requires some extra polyfill or configuration then the user of the kit needs to include it manually.
 */
export function sep43Modules(opts) {
    const modules = [new FreighterModule()];
    return opts?.filterBy ? modules.filter(opts.filterBy) : modules;
}
