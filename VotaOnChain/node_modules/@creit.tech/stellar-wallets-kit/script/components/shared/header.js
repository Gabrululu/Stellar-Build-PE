"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Header = Header;
const preact_1 = require("htm/preact");
const mod_js_1 = require("../../state/mod.js");
const signals_1 = require("@preact/signals");
const mod_js_2 = require("../../types/mod.js");
const button_js_1 = require("./button.js");
const router_js_1 = require("../router.js");
const twind_js_1 = require("../twind.js");
function openHelpPage() {
    (0, router_js_1.navigateTo)(mod_js_2.SwkAppRoute.HELP_PAGE);
}
function back() {
    (0, router_js_1.goBack)();
}
const leftButtonComponent = (0, signals_1.computed)(() => {
    if (mod_js_1.route.value !== mod_js_2.SwkAppRoute.AUTH_OPTIONS) {
        if (mod_js_1.routerHistory.value.length < 2)
            return (0, preact_1.html) ``;
        // Back button
        return (0, preact_1.html) `
      <${button_js_1.Button} onClick=${() => back()}
                 size="${button_js_1.ButtonSize.md}"
                 mode="${button_js_1.ButtonMode.ghost}"
                 shape="${button_js_1.ButtonShape.icon}">
        
        <svg class="${(0, twind_js_1.tw)('w-4 h-4')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M7.82843 10.9999H20V12.9999H7.82843L13.1924 18.3638L11.7782 19.778L4 11.9999L11.7782 4.22168L13.1924 5.63589L7.82843 10.9999Z"></path></svg>
      <//>
    `;
    }
    else {
        return (0, preact_1.html) `
      <${button_js_1.Button} onClick=${() => openHelpPage()}
                 size="${button_js_1.ButtonSize.md}"
                 mode="${button_js_1.ButtonMode.ghost}"
                 shape="${button_js_1.ButtonShape.icon}">
        <svg class="${(0, twind_js_1.tw)('w-4 h-4')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM11 15H13V17H11V15ZM13 13.3551V14H11V12.5C11 11.9477 11.4477 11.5 12 11.5C12.8284 11.5 13.5 10.8284 13.5 10C13.5 9.17157 12.8284 8.5 12 8.5C11.2723 8.5 10.6656 9.01823 10.5288 9.70577L8.56731 9.31346C8.88637 7.70919 10.302 6.5 12 6.5C13.933 6.5 15.5 8.067 15.5 10C15.5 11.5855 14.4457 12.9248 13 13.3551Z"></path></svg>
      <//>
    `;
    }
});
function Header() {
    return (0, preact_1.html) `
    <header class="${(0, twind_js_1.tw)('flex items-center px-3 py-2')}">
      <div class="${(0, twind_js_1.tw)('w-3/12 flex justify-start')}">
        ${leftButtonComponent.value}
      </div>

      <div class="${(0, twind_js_1.tw)('w-6/12 text-center')}">
        <h1 class="${(0, twind_js_1.tw)('text-foreground-strong font-semibold')}">
          ${mod_js_1.modalTitle.value}
        </h1>
      </div>

      <div class="${(0, twind_js_1.tw)('w-3/12 flex justify-end')}">
        <${button_js_1.Button} onClick=${() => mod_js_1.closeEvent.next()}
                   size="${button_js_1.ButtonSize.md}"
                   mode="${button_js_1.ButtonMode.ghost}"
                   shape="${button_js_1.ButtonShape.icon}">

          <svg class="${(0, twind_js_1.tw)('w-4 h-4')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z"></path></svg>
        <//>
      </div>
    </header>
  `;
}
