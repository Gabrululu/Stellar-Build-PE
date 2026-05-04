"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HwAccountsFetcherPage = void 0;
const preact_1 = require("preact");
const signals_1 = require("@preact/signals");
const preact_2 = require("htm/preact");
const values_js_1 = require("../../state/values.js");
const twind_js_1 = require("../twind.js");
const button_js_1 = require("../shared/button.js");
const events_js_1 = require("../../state/events.js");
const initialState = {
    error: null,
    loading: true,
    accounts: [],
};
class HwAccountsFetcherPage extends preact_1.Component {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "stateSignal", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: (0, signals_1.signal)(initialState)
        });
    }
    componentWillMount() {
        values_js_1.modalTitle.value = "Wallet Accounts";
        this.fetchAccounts();
    }
    async fetchAccounts() {
        const hwModule = values_js_1.activeModule.value;
        this.stateSignal.value = initialState;
        if (hwModule.disconnect) {
            await hwModule.disconnect();
            await new Promise(r => setTimeout(r, 500));
        }
        try {
            const accounts = await hwModule.getAddresses();
            this.stateSignal.value = {
                ...this.stateSignal.value,
                loading: false,
                accounts,
            };
        }
        catch (err) {
            this.stateSignal.value = {
                ...this.stateSignal.value,
                error: err.message
            };
        }
    }
    async selectAccount(params) {
        values_js_1.activeAddress.value = params.publicKey;
        events_js_1.addressUpdatedEvent.next(params.publicKey);
    }
    render() {
        const loadingComponent = (0, preact_2.html) `
      <div class="${(0, twind_js_1.tw)('py-8 w-full flex justify-center items-center text-foreground')}">
        <svg class="${(0, twind_js_1.tw)('w-8 h-8 text-gray-200 animate-spin')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3C16.9706 3 21 7.02944 21 12H19C19 8.13401 15.866 5 12 5V3Z"></path>
        </svg>
      </div>
    `;
        const accountsListComponent = (0, preact_2.html) `    
      <ul class="${(0, twind_js_1.tw)("w-full grid gap-2 px-2 py-4 text-foreground")}">
        ${values_js_1.hardwareWalletPaths.value.map(({ publicKey, index }) => {
            return (0, preact_2.html) `
            <li onClick=${() => this.selectAccount({ publicKey, index })}
                class="${(0, twind_js_1.tw)("px-2 py-2 cursor-pointer flex justify-between items-center bg-background hover:border-light-gray border-1 border-transparent rounded-default duration-150 ease active:bg-background active:border-gray")}">
              ${publicKey.slice(0, 6)}....${publicKey.slice(-6)}

              <span class="dialog-text">(44'/148'/${index}')</span>
            </li>
          `;
        })}
      </ul>
    `;
        const errorComponent = (0, preact_2.html) `
      <div class="${(0, twind_js_1.tw)('w-full text-center text-foreground py-4')}">
        <div class="${(0, twind_js_1.tw)('text-danger')}">
          <svg class="${(0, twind_js_1.tw)('inline-block mx-auto w-8 h-8 mb-2')}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.8659 3.00017L22.3922 19.5002C22.6684 19.9785 22.5045 20.5901 22.0262 20.8662C21.8742 20.954 21.7017 21.0002 21.5262 21.0002H2.47363C1.92135 21.0002 1.47363 20.5525 1.47363 20.0002C1.47363 19.8246 1.51984 19.6522 1.60761 19.5002L11.1339 3.00017C11.41 2.52187 12.0216 2.358 12.4999 2.63414C12.6519 2.72191 12.7782 2.84815 12.8659 3.00017ZM4.20568 19.0002H19.7941L11.9999 5.50017L4.20568 19.0002ZM10.9999 16.0002H12.9999V18.0002H10.9999V16.0002ZM10.9999 9.00017H12.9999V14.0002H10.9999V9.00017Z"></path>
          </svg>
        </div>
        
        <h3 class="${(0, twind_js_1.tw)('text-sm font-semibold')}">
          Error while fetching accounts with reason:
        </h3>
        
        <p class="${(0, twind_js_1.tw)('mb-4 text-sm')}">
          ${this.stateSignal.value.error}
        </p>
        
        <div class="${(0, twind_js_1.tw)('w-full flex justify-center items-center')}">
          <${button_js_1.Button} onClick=${() => this.fetchAccounts()} size="${button_js_1.ButtonSize.md}">
            Retry
          <//>
        </div>
      </div>
    `;
        if (this.stateSignal.value.error) {
            return errorComponent;
        }
        else {
            return this.stateSignal.value.loading
                ? loadingComponent
                : accountsListComponent;
        }
    }
}
exports.HwAccountsFetcherPage = HwAccountsFetcherPage;
