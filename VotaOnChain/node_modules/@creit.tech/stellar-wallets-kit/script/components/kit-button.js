"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwkButton = SwkButton;
const twind_js_1 = require("./twind.js");
const preact_1 = require("htm/preact");
const mod_js_1 = require("./shared/mod.js");
const mod_js_2 = require("../state/mod.js");
const kit_js_1 = require("../sdk/kit.js");
async function handleOnClick(cb) {
    if (cb)
        cb();
    if (typeof mod_js_2.activeModules.value === 'undefined')
        throw new Error(`The kit hasn't been initiated.`);
    if (!mod_js_2.activeModule.value || !mod_js_2.activeAddress.value) {
        await kit_js_1.StellarWalletsKit.authModal();
    }
    else {
        await kit_js_1.StellarWalletsKit.profileModal();
    }
}
function SwkButton(props) {
    const content = mod_js_2.activeAddress.value
        ? `${mod_js_2.activeAddress.value.slice(0, 4)}....${mod_js_2.activeAddress.value.slice(-6)}`
        : 'Connect Wallet';
    return (0, preact_1.html) `
    <div class="${(0, twind_js_1.tw)(twind_js_1.reset)} ${(0, twind_js_1.tw)('inline-block')}">      
      <${mod_js_1.Button} styles=${props.styles} 
                 classes=${props.classes}
                 mode=${props.mode || mod_js_1.ButtonMode.primary}
                 shape=${props.shape || mod_js_1.ButtonShape.regular}
                 size=${props.size}
                 onClick=${() => handleOnClick(props.onClick)}>        
        ${props.children ? props.children : content}
      <//>
    </div>
  `;
}
