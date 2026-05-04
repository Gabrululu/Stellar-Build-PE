"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SwkApp = SwkApp;
const twind_js_1 = require("./twind.js");
const core_1 = require("@twind/core");
const preact_1 = require("htm/preact");
const header_js_1 = require("./shared/header.js");
const footer_js_1 = require("./shared/footer.js");
const mod_js_1 = require("../state/mod.js");
const mod_js_2 = require("../types/mod.js");
const auth_options_page_js_1 = require("./pages/auth-options.page.js");
const what_is_a_wallet_page_js_1 = require("./pages/what-is-a-wallet.page.js");
const router_js_1 = require("./router.js");
const profile_page_js_1 = require("./pages/profile.page.js");
const hw_accounts_fetcher_page_js_1 = require("./pages/hw-accounts-fetcher.page.js");
const pages = {
    [mod_js_2.SwkAppRoute.AUTH_OPTIONS]: auth_options_page_js_1.AuthOptionsPage,
    [mod_js_2.SwkAppRoute.HELP_PAGE]: what_is_a_wallet_page_js_1.WhatIsAWalletPage,
    [mod_js_2.SwkAppRoute.PROFILE_PAGE]: profile_page_js_1.ProfilePage,
    [mod_js_2.SwkAppRoute.HW_ACCOUNTS_FETCHER]: hw_accounts_fetcher_page_js_1.HwAccountsFetcherPage,
};
const glass = (0, core_1.css) `
  .glass {
    backdrop-filter: blur(10px);
    background-color: color-mix(in srgb, var(--swk-background) 25%, transparent);
  }
`;
function SwkApp() {
    const kitsClasses = (0, twind_js_1.tw)((0, twind_js_1.cx)([
        mod_js_1.mode.value === mod_js_2.SwkAppMode.FIXED ? "fixed flex left-0 top-0 z-[999] w-full h-full" : "inline-flex",
        "font-default justify-center items-center",
    ]));
    return (0, preact_1.html) `
    <section class="stellar-wallets-kit ${kitsClasses} ${(0, twind_js_1.tw)(twind_js_1.reset)} ${(0, twind_js_1.tw)(glass)}">
      ${mod_js_1.mode.value === mod_js_2.SwkAppMode.FIXED
        ? (0, preact_1.html) `
          <div class="${(0, twind_js_1.tw)("absolute left-0 top-0 z-0 w-full h-full bg-[rgba(0,0,0,0.5)]")}" onClick="${() => mod_js_1.closeEvent.next()}"></div>
        `
        : ""}

      <section
        class="${(0, twind_js_1.tw)("w-full h-fit relative max-w-[22rem] max-h-[39.4375rem] grid grid-cols-1 grid-rows-[auto_1fr_auto] bg-background rounded-default shadow-default transition-all duration-[0.5s] ease-in-out overflow-hidden max-h-[400px] overflow-y-scroll")}"
      >
        <div class="${(0, twind_js_1.tw)("col-span-1 top-0 sticky z-50")} glass">
          <${header_js_1.Header} />
        </div>

        <div class="${(0, twind_js_1.tw)("col-span-1 relative z-10")}">
          <${router_js_1.MultiPageAnimator}
            currentRoute="${mod_js_1.route.value}"
            pages="${pages}"
            duration="${400}"
          />
        </div>

        <div class="${(0, twind_js_1.tw)("col-span-1 bottom-0 sticky z-50")} glass">
          <${footer_js_1.Footer} />
        </div>
      </section>
    </section>
  `;
}
