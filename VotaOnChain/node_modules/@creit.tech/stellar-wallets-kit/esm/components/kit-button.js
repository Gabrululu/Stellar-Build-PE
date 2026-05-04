import { tw, reset } from "./twind.js";
import { html } from "htm/preact";
import { Button, ButtonMode, ButtonShape } from "./shared/mod.js";
import { activeModule, activeModules, activeAddress } from '../state/mod.js';
import { StellarWalletsKit } from '../sdk/kit.js';
async function handleOnClick(cb) {
    if (cb)
        cb();
    if (typeof activeModules.value === 'undefined')
        throw new Error(`The kit hasn't been initiated.`);
    if (!activeModule.value || !activeAddress.value) {
        await StellarWalletsKit.authModal();
    }
    else {
        await StellarWalletsKit.profileModal();
    }
}
export function SwkButton(props) {
    const content = activeAddress.value
        ? `${activeAddress.value.slice(0, 4)}....${activeAddress.value.slice(-6)}`
        : 'Connect Wallet';
    return html `
    <div class="${tw(reset)} ${tw('inline-block')}">      
      <${Button} styles=${props.styles} 
                 classes=${props.classes}
                 mode=${props.mode || ButtonMode.primary}
                 shape=${props.shape || ButtonShape.regular}
                 size=${props.size}
                 onClick=${() => handleOnClick(props.onClick)}>        
        ${props.children ? props.children : content}
      <//>
    </div>
  `;
}
