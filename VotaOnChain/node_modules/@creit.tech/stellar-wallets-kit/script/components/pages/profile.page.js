"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfilePage = ProfilePage;
const preact_1 = require("htm/preact");
const twind_js_1 = require("../twind.js");
const values_js_1 = require("../../state/values.js");
const button_js_1 = require("../shared/button.js");
const avatar_js_1 = require("../shared/avatar.js");
const signals_1 = require("@preact/signals");
const utils_js_1 = require("../../sdk/utils.js");
const showCopiedText = (0, signals_1.signal)(false);
function copyToClipboard() {
    if (!values_js_1.activeAddress.value) {
        throw new Error(`Text to copy to the clipboard can't be undefined`);
    }
    navigator.clipboard.writeText(values_js_1.activeAddress.value)
        .then(() => {
        showCopiedText.value = true;
        setTimeout(() => {
            showCopiedText.value = false;
        }, 2500);
    })
        .catch(e => console.error(e));
}
function ProfilePage() {
    values_js_1.modalTitle.value = '';
    return (0, preact_1.html) `
    <section class="${(0, twind_js_1.tw)('w-full flex flex-col pb-8')}">
      <div class="${(0, twind_js_1.tw)('w-full flex justify-center mb-4')}">
        <${avatar_js_1.Avatar} alt="${values_js_1.activeModule.value?.productName} icon" image="${values_js_1.activeModule.value?.productIcon}" size="${avatar_js_1.AvatarSize.xl}" />
      </div>
      
      <div class="${(0, twind_js_1.tw)('w-full flex items-center justify-center mb-2')}">
        <h1 class="${(0, twind_js_1.tw)('text-lg font-semibold text-foreground')}">
          ${values_js_1.activeAddress.value && `${values_js_1.activeAddress.value.slice(0, 6)}....${values_js_1.activeAddress.value.slice(-6)}`}
        </h1>
      </div>
      
      <div class="${(0, twind_js_1.tw)('w-full flex flex-col items-center justify-center gap-2')}">
        <${button_js_1.Button} mode="${button_js_1.ButtonMode.ghost}" onClick="${copyToClipboard}" size="${button_js_1.ButtonSize.sm}">
          ${showCopiedText.value ? 'Address copied!' : (0, preact_1.html) `Copy address`} <svg class="${(0, twind_js_1.tw)('w-4 h-4 ml-2')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M6.9998 6V3C6.9998 2.44772 7.44752 2 7.9998 2H19.9998C20.5521 2 20.9998 2.44772 20.9998 3V17C20.9998 17.5523 20.5521 18 19.9998 18H16.9998V20.9991C16.9998 21.5519 16.5499 22 15.993 22H4.00666C3.45059 22 3 21.5554 3 20.9991L3.0026 7.00087C3.0027 6.44811 3.45264 6 4.00942 6H6.9998ZM5.00242 8L5.00019 20H14.9998V8H5.00242ZM8.9998 6H16.9998V16H18.9998V4H8.9998V6Z"></path></svg>
        <//>

        <${button_js_1.Button} mode="${button_js_1.ButtonMode.ghost}" onClick="${utils_js_1.disconnect}" size="${button_js_1.ButtonSize.sm}">
          Disconnect <svg class="${(0, twind_js_1.tw)('w-4 h-4 ml-2')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5 11H13V13H5V16L0 12L5 8V11ZM3.99927 18H6.70835C8.11862 19.2447 9.97111 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C9.97111 4 8.11862 4.75527 6.70835 6H3.99927C5.82368 3.57111 8.72836 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22C8.72836 22 5.82368 20.4289 3.99927 18Z"></path></svg>
        <//>
      </div>
    </section>
  `;
}
