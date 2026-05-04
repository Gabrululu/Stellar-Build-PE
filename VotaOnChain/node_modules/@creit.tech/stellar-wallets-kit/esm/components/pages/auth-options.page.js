import { html } from "htm/preact";
import { activeAddress, activeModule, addressUpdatedEvent, allowedWallets, installText, modalTitle, moduleSelectedEvent, selectedModuleId, showInstallLabel, } from "../../state/mod.js";
import { computed } from "@preact/signals";
import { LocalStorageKeys, ModuleType, SwkAppRoute } from "../../types/mod.js";
import { Avatar, AvatarSize } from "../shared/avatar.js";
import { tw } from "../twind.js";
import { navigateTo } from "../router.js";
const sortedWallet = computed(() => {
    const tempSortedWallets = allowedWallets.value
        .reduce((all, current) => {
        return {
            available: current.isAvailable ? [...all.available, current] : all.available,
            unavailable: !current.isAvailable ? [...all.unavailable, current] : all.unavailable,
        };
    }, { available: [], unavailable: [] });
    let usedWalletsIds;
    try {
        const record = globalThis?.localStorage.getItem(LocalStorageKeys.usedWalletsIds);
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
    selectedModuleId.value = item.id;
    moduleSelectedEvent.next(item);
    if (item.type === ModuleType.HW_WALLET) {
        navigateTo(SwkAppRoute.HW_ACCOUNTS_FETCHER);
    }
    else {
        try {
            const { address } = await activeModule.value.getAddress();
            activeAddress.value = address;
            addressUpdatedEvent.next(address);
        }
        catch (e) {
            addressUpdatedEvent.next(e);
        }
    }
}
export function AuthOptionsPage() {
    modalTitle.value = "Connect Wallet";
    // If the auth modal is rendered from a wallet wrapper, we assume the direct connection
    const wrapper = sortedWallet.value.find((w) => w.isPlatformWrapper);
    if (wrapper) {
        onWalletSelected(wrapper)
            .then();
        return html `
      <div class="${tw("w-full text-center px-4 py-8")}">
        <div class="${tw("w-full mb-4")}">
          <${Avatar} alt="${wrapper.name} icon" image="${wrapper.icon}" size="${AvatarSize.md}" />
        </div>

        <p class="${tw("text-foreground text-lg w-full")}">
          Connecting to your wallet using <b>${wrapper.name}</b>
        </p>
      </div>
    `;
    }
    const loadingMessage = html `
    <div class="${tw("w-full text-center text-foreground font-semibold p-4")}">Loading wallets...</div>
  `;
    const walletItem = sortedWallet.value.map((wallet) => {
        return html `
      <li
        onClick="${() => onWalletSelected(wallet)}"
        class="${tw("px-2 py-2 cursor-pointer flex justify-between items-center bg-background hover:border-light-gray border-1 border-transparent rounded-default duration-150 ease active:bg-background active:border-gray")}"
      >
        <div class="${tw("flex items-center gap-2")}">
          <${Avatar} class="${tw("mr-2")}" alt="${wallet.name} icon" image="${wallet.icon}" size="${AvatarSize
            .sm}" />
          <p class="${tw("text-foreground font-semibold")}">${wallet.name}</p>
        </div>

        ${showInstallLabel.value && !wallet.isAvailable
            ? html `
            <div class="${tw("ml-4 flex items-center")}">
              <small
                class="${tw("inline-flex items-center border-1 border-border px-2 py-1 rounded-default text-foreground-secondary text-xs bg-background-secondary")}"
              >
                ${installText.value}

                <svg class="${tw("w-4 h-4")}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M16.0037 9.41421L7.39712 18.0208L5.98291 16.6066L14.5895 8H7.00373V6H18.0037V17H16.0037V9.41421Z"></path>
                </svg>
              </small>
            </div>
          `
            : ""}
      </li>
    `;
    });
    return html `
    <ul class="${tw("w-full grid gap-2 px-2 py-4")}">
      ${sortedWallet.value.length === 0 ? loadingMessage : walletItem}
    </ul>
  `;
}
