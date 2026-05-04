import type { EventEmitter } from 'events';
import type { CallMethod } from './events/call';
import type { TrezorConnect } from './types';
import type { InitType } from './types/api/init';
export interface ConnectFactoryDependencies<SettingsType extends Record<string, any>> {
    init: InitType<SettingsType>;
    call: CallMethod;
    eventEmitter: EventEmitter;
    manifest: TrezorConnect['manifest'];
    setTransports: TrezorConnect['setTransports'];
    uiResponse: TrezorConnect['uiResponse'];
    cancel: TrezorConnect['cancel'];
    dispose: TrezorConnect['dispose'];
}
export declare const connectCallableMethods: readonly ["applyFlags", "applySettings", "authenticateDevice", "authorizeCoinjoin", "backupDevice", "bleUnpair", "blockchainDisconnect", "blockchainEstimateFee", "blockchainEvmRpcCall", "blockchainGetAccountBalanceHistory", "blockchainGetCurrentFiatRates", "blockchainGetFiatRatesForTimestamps", "blockchainGetInfo", "blockchainGetTransactions", "blockchainSetCustomBackend", "blockchainSubscribe", "blockchainSubscribeFiatRates", "blockchainUnsubscribe", "blockchainUnsubscribeFiatRates", "cancelCoinjoinAuthorization", "cardanoComposeTransaction", "cardanoGetAddress", "cardanoGetNativeScriptHash", "cardanoGetPublicKey", "cardanoSignMessage", "cardanoSignTransaction", "changeLanguage", "changePin", "changeWipeCode", "cipherKeyValue", "composeTransaction", "discoverAccounts", "eosGetPublicKey", "eosSignTransaction", "ethereumGetAddress", "ethereumGetPublicKey", "ethereumSignMessage", "ethereumSignTransaction", "ethereumSignTypedData", "ethereumVerifyMessage", "evoluGetDelegatedIdentityKey", "evoluGetNode", "evoluSignRegistrationRequest", "firmwareUpdate", "getAccountDescriptor", "getAccountInfo", "getAddress", "getCoinInfo", "getDeviceState", "getFeatures", "getFirmwareHash", "getNonce", "getOwnershipId", "getOwnershipProof", "getPublicKey", "getSettings", "loadDevice", "moneroGetAddress", "moneroGetWatchKey", "moneroKeyImageSync", "moneroSignTransaction", "nemGetAddress", "nemSignTransaction", "pushTransaction", "recoveryDevice", "requestLogin", "resetDevice", "rippleGetAddress", "rippleSignTransaction", "setBrightness", "setBusy", "setProxy", "showDeviceTutorial", "signMessage", "signTransaction", "solanaComposeTransaction", "solanaGetAddress", "solanaGetPublicKey", "solanaSignTransaction", "stellarGetAddress", "stellarSignTransaction", "tezosGetAddress", "tezosGetPublicKey", "tezosSignTransaction", "thpGetCredentials", "thpRemoveCredentials", "tronGetAddress", "tronSignTransaction", "unlockPath", "verifyMessage", "wipeDevice"];
export declare const factory: <SettingsType extends Record<string, any>, ExtraMethodsType extends Record<string, any>>({ eventEmitter, manifest, init, call, setTransports, uiResponse, cancel, dispose, }: ConnectFactoryDependencies<SettingsType>, extraMethods?: ExtraMethodsType) => Omit<TrezorConnect, "init"> & {
    init: InitType<SettingsType>;
    call: CallMethod;
} & ExtraMethodsType;
//# sourceMappingURL=factory.d.ts.map