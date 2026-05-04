"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatIsAWalletPage = WhatIsAWalletPage;
const preact_1 = require("htm/preact");
const twind_js_1 = require("../twind.js");
function WhatIsAWalletPage() {
    return (0, preact_1.html) `
    <section class="${(0, twind_js_1.tw)("w-full p-4 pb-8 rounded-tl-default")}">
      <div class="${(0, twind_js_1.tw)("w-full mb-6")}">
        <h3 class="${(0, twind_js_1.tw)("text-foreground-strong font-semibold text-lg mb-2")}">What is a wallet?</h3>
        <p class="${(0, twind_js_1.tw)("text-foreground text-sm")}">
          Wallets are used to send, receive, and store the keys you use to sign blockchain transactions.
        </p>
      </div>

      <div class="w-full">
        <h3 class="${(0, twind_js_1.tw)("text-foreground-strong font-semibold text-lg mb-2")}">What is Stellar?</h3>
        <p class="${(0, twind_js_1.tw)("text-foreground text-sm")}">
          Stellar is a decentralized, public blockchain that gives developers the tools to create experiences that are more
          like cash than crypto.
        </p>
      </div>
    </section>
  `;
}
