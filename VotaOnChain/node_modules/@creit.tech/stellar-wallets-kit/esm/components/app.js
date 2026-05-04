import { cx, reset, tw } from "./twind.js";
import { css } from "@twind/core";
import { html } from "htm/preact";
import { Header } from "./shared/header.js";
import { Footer } from "./shared/footer.js";
import { closeEvent, mode, route } from "../state/mod.js";
import { SwkAppMode, SwkAppRoute } from "../types/mod.js";
import { AuthOptionsPage } from "./pages/auth-options.page.js";
import { WhatIsAWalletPage } from "./pages/what-is-a-wallet.page.js";
import { MultiPageAnimator } from "./router.js";
import { ProfilePage } from "./pages/profile.page.js";
import { HwAccountsFetcherPage } from "./pages/hw-accounts-fetcher.page.js";
const pages = {
    [SwkAppRoute.AUTH_OPTIONS]: AuthOptionsPage,
    [SwkAppRoute.HELP_PAGE]: WhatIsAWalletPage,
    [SwkAppRoute.PROFILE_PAGE]: ProfilePage,
    [SwkAppRoute.HW_ACCOUNTS_FETCHER]: HwAccountsFetcherPage,
};
const glass = css `
  .glass {
    backdrop-filter: blur(10px);
    background-color: color-mix(in srgb, var(--swk-background) 25%, transparent);
  }
`;
export function SwkApp() {
    const kitsClasses = tw(cx([
        mode.value === SwkAppMode.FIXED ? "fixed flex left-0 top-0 z-[999] w-full h-full" : "inline-flex",
        "font-default justify-center items-center",
    ]));
    return html `
    <section class="stellar-wallets-kit ${kitsClasses} ${tw(reset)} ${tw(glass)}">
      ${mode.value === SwkAppMode.FIXED
        ? html `
          <div class="${tw("absolute left-0 top-0 z-0 w-full h-full bg-[rgba(0,0,0,0.5)]")}" onClick="${() => closeEvent.next()}"></div>
        `
        : ""}

      <section
        class="${tw("w-full h-fit relative max-w-[22rem] max-h-[39.4375rem] grid grid-cols-1 grid-rows-[auto_1fr_auto] bg-background rounded-default shadow-default transition-all duration-[0.5s] ease-in-out overflow-hidden max-h-[400px] overflow-y-scroll")}"
      >
        <div class="${tw("col-span-1 top-0 sticky z-50")} glass">
          <${Header} />
        </div>

        <div class="${tw("col-span-1 relative z-10")}">
          <${MultiPageAnimator}
            currentRoute="${route.value}"
            pages="${pages}"
            duration="${400}"
          />
        </div>

        <div class="${tw("col-span-1 bottom-0 sticky z-50")} glass">
          <${Footer} />
        </div>
      </section>
    </section>
  `;
}
