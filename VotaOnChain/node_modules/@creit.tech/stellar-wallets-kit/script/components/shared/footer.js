"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Footer = Footer;
const preact_1 = require("htm/preact");
const twind_js_1 = require("../twind.js");
function Footer() {
    return (0, preact_1.html) `
    <footer class="${(0, twind_js_1.tw)("w-full text-center p-2 border-t-1 border-t-border")}">
      <p class="${(0, twind_js_1.tw)("text-xs text-foreground")}">
        Powered by
        <a target="_blank" href="https://stellarwalletskit.dev/" class="${(0, twind_js_1.tw)("font-semibold underline ml-1")}">
          Stellar Wallets Kit
        </a>
      </p>
    </footer>
  `;
}
