"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthOptionsPage = AuthOptionsPage;
const preact_1 = require("htm/preact");
const mod_js_1 = require("../../state/mod.js");
const signals_1 = require("@preact/signals");
const mod_js_2 = require("../../types/mod.js");
const avatar_js_1 = require("../shared/avatar.js");
const twind_js_1 = require("../twind.js");
const router_js_1 = require("../router.js");
const sortedWallet = (0, signals_1.computed)(() => {
    const tempSortedWallets = mod_js_1.allowedWallets.value
        .reduce((all, current) => {
        return {
            available: current.isAvailable ? [...all.available, current] : all.available,
            unavailable: !current.isAvailable ? [...all.unavailable, current] : all.unavailable,
        };
    }, { available: [], unavailable: [] });
    let usedWalletsIds;
    try {
        const record = globalThis?.localStorage.getItem(mod_js_2.LocalStorageKeys.usedWalletsIds);
        usedWalletsIds = record ? JSON.parse(record) : [];
    }
    catch (e) {
        console.error(e);
        usedWalletsIds = [];
    }
    const usedWallets = [];
    const nonUsedWallets = [];
    for (const availableWallet of tempSortedWallets.available) {
        if (usedWalletsIds.find((id) => id === availableWallet.id)) {
            usedWallets.push(availableWallet);
        }
        else {
            nonUsedWallets.push(availableWallet);
        }
    }
    return [
        ...usedWallets.sort((a, b) => {
            return usedWalletsIds.indexOf(a.id) - usedWalletsIds.indexOf(b.id);
        }),
        ...nonUsedWallets,
        ...tempSortedWallets.unavailable,
    ];
});
async function onWalletSelected(item) {
    if (!item.isAvailable) {
        globalThis.open(item.url, "_blank");
        return;
    }
    mod_js_1.selectedModuleId.value = item.id;
    mod_js_1.moduleSelectedEvent.next(item);
    if (item.type === mod_js_2.ModuleType.HW_WALLET) {
        (0, router_js_1.navigateTo)(mod_js_2.SwkAppRoute.HW_ACCOUNTS_FETCHER);
    }
    else {
        try {
            const { address } = await mod_js_1.activeModule.value.getAddress();
            mod_js_1.activeAddress.value = address;
            mod_js_1.addressUpdatedEvent.next(address);
        }
        catch (e) {
            mod_js_1.addressUpdatedEvent.next(e);
        }
    }
}
function AuthOptionsPage() {
    mod_js_1.modalTitle.value = "Connect Wallet";
    // If the auth modal is rendered from a wallet wrapper, we assume the direct connection
    const wrapper = sortedWallet.value.find((w) => w.isPlatformWrapper);
    if (wrapper) {
        onWalletSelected(wrapper)
            .then();
        return (0, preact_1.html) `
      <div class="${(0, twind_js_1.tw)("w-full text-center px-4 py-8")}">
        <div class="${(0, twind_js_1.tw)("w-full mb-4")}">
          <${avatar_js_1.Avatar} alt="${wrapper.name} icon" image="${wrapper.icon}" size="${avatar_js_1.AvatarSize.md}" />
        </div>

        <p class="${(0, twind_js_1.tw)("text-foreground text-lg w-full")}">
          Connecting to your wallet using <b>${wrapper.name}</b>
        </p>
      </div>
    `;
    }
    const loadingMessage = (0, preact_1.html) `
    <div class="${(0, twind_js_1.tw)("w-full text-center text-foreground font-semibold p-4")}">Loading wallets...</div>
  `;
    const walletItem = sortedWallet.value.map((wallet) => {
        return (0, preact_1.html) `
      <li
        onClick="${() => onWalletSelected(wallet)}"
        class="${(0, twind_js_1.tw)("px-2 py-2 cursor-pointer flex justify-between items-center bg-background hover:border-light-gray border-1 border-transparent rounded-default duration-150 ease active:bg-background active:border-gray")}"
      >
        <div class="${(0, twind_js_1.tw)("flex items-center gap-2")}">
          <${avatar_js_1.Avatar} class="${(0, twind_js_1.tw)("mr-2")}" alt="${wallet.name} icon" image="${wallet.icon}" size="${avatar_js_1.AvatarSize
            .sm}" />
          <p class="${(0, twind_js_1.tw)("text-foreground font-semibold")}">${wallet.name}</p>
        </div>

        ${mod_js_1.showInstallLabel.value && !wallet.isAvailable
            ? (0, preact_1.html) `
            <div class="${(0, twind_js_1.tw)("ml-4 flex items-center")}">
              <small
                class="${(0, twind_js_1.tw)("inline-flex items-center border-1 border-border px-2 py-1 rounded-default text-foreground-secondary text-xs bg-background-secondary")}"
              >
                ${mod_js_1.installText.value}

                <svg class="${(0, twind_js_1.tw)("w-4 h-4")}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                </svg>
              </small>
            </div>
          `
            : ""}
      </li>
    `;
    });
    return (0, preact_1.html) `
    <ul class="${(0, twind_js_1.tw)("w-full grid gap-2 px-2 py-4")}">
      ${sortedWallet.value.length === 0 ? loadingMessage : walletItem}
    </ul>
  `;
}
