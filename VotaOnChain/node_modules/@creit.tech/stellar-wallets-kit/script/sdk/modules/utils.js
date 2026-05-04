"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultModules = defaultModules;
exports.sep43Modules = sep43Modules;
const albedo_module_js_1 = require("./albedo.module.js");
const freighter_module_js_1 = require("./freighter.module.js");
const lobstr_module_js_1 = require("./lobstr.module.js");
const rabet_module_js_1 = require("./rabet.module.js");
const xbull_module_js_1 = require("./xbull.module.js");
const hana_module_js_1 = require("./hana.module.js");
const klever_module_js_1 = require("./klever.module.js");
const onekey_module_js_1 = require("./onekey.module.js");
const bitget_module_js_1 = require("./bitget.module.js");
/**
 * This method returns all modules that don't require extra configuration before they can be loaded
 * You can provide a filter function if needed
 *
 * Note: If you are the creator of a module and you want the module to be listed here, the module must not require any extra configuration nor polyfills (everything should be include already in your module's dependencies).
 * If your module requires some extra polyfill or configuration then the user of the kit needs to include it manually.
 */
function defaultModules(opts) {
    const modules = [
        new albedo_module_js_1.AlbedoModule(),
        new freighter_module_js_1.FreighterModule(),
        new rabet_module_js_1.RabetModule(),
        new xbull_module_js_1.xBullModule(),
        new lobstr_module_js_1.LobstrModule(),
        new hana_module_js_1.HanaModule(),
        new klever_module_js_1.KleverModule(),
        new onekey_module_js_1.OneKeyModule(),
        new bitget_module_js_1.BitgetModule(),
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
function sep43Modules(opts) {
    const modules = [new freighter_module_js_1.FreighterModule()];
    return opts?.filterBy ? modules.filter(opts.filterBy) : modules;
}
