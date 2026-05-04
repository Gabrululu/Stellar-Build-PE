"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = exports.connectCallableMethods = void 0;
const events_1 = require("./events");
exports.connectCallableMethods = ['applyFlags', 'applySettings', 'authenticateDevice', 'authorizeCoinjoin', 'backupDevice', 'bleUnpair', 'blockchainDisconnect', 'blockchainEstimateFee', 'blockchainEvmRpcCall', 'blockchainGetAccountBalanceHistory', 'blockchainGetCurrentFiatRates', 'blockchainGetFiatRatesForTimestamps', 'blockchainGetInfo', 'blockchainGetTransactions', 'blockchainSetCustomBackend', 'blockchainSubscribe', 'blockchainSubscribeFiatRates', 'blockchainUnsubscribe', 'blockchainUnsubscribeFiatRates', 'cancelCoinjoinAuthorization', 'cardanoComposeTransaction', 'cardanoGetAddress', 'cardanoGetNativeScriptHash', 'cardanoGetPublicKey', 'cardanoSignMessage', 'cardanoSignTransaction', 'changeLanguage', 'changePin', 'changeWipeCode', 'cipherKeyValue', 'composeTransaction', 'discoverAccounts', 'eosGetPublicKey', 'eosSignTransaction', 'ethereumGetAddress', 'ethereumGetPublicKey', 'ethereumSignMessage', 'ethereumSignTransaction', 'ethereumSignTypedData', 'ethereumVerifyMessage', 'evoluGetDelegatedIdentityKey', 'evoluGetNode', 'evoluSignRegistrationRequest', 'firmwareUpdate', 'getAccountDescriptor', 'getAccountInfo', 'getAddress', 'getCoinInfo', 'getDeviceState', 'getFeatures', 'getFirmwareHash', 'getNonce', 'getOwnershipId', 'getOwnershipProof', 'getPublicKey', 'getSettings', 'loadDevice', 'moneroGetAddress', 'moneroGetWatchKey', 'moneroKeyImageSync', 'moneroSignTransaction', 'nemGetAddress', 'nemSignTransaction', 'pushTransaction', 'recoveryDevice', 'requestLogin', 'resetDevice', 'rippleGetAddress', 'rippleSignTransaction', 'setBrightness', 'setBusy', 'setProxy', 'showDeviceTutorial', 'signMessage', 'signTransaction', 'solanaComposeTransaction', 'solanaGetAddress', 'solanaGetPublicKey', 'solanaSignTransaction', 'stellarGetAddress', 'stellarSignTransaction', 'tezosGetAddress', 'tezosGetPublicKey', 'tezosSignTransaction', 'thpGetCredentials', 'thpRemoveCredentials', 'tronGetAddress', 'tronSignTransaction', 'unlockPath', 'verifyMessage', 'wipeDevice'];
const factory = ({
  eventEmitter,
  manifest,
  init,
  call,
  setTransports,
  uiResponse,
  cancel,
  dispose
}, extraMethods = {}) => {
  const callableMethods = Object.fromEntries(exports.connectCallableMethods.map(method => [method, params => call({
    ...params,
    method,
    useEventListener: method.toLowerCase().endsWith('getaddress') ? eventEmitter.listenerCount(events_1.UI.ADDRESS_VALIDATION) > 0 : undefined
  })]));
  return {
    manifest,
    init,
    setTransports,
    on: (type, fn) => {
      eventEmitter.on(type, fn);
    },
    off: (type, fn) => {
      eventEmitter.removeListener(type, fn);
    },
    removeAllListeners: type => {
      if (typeof type === 'string') {
        eventEmitter.removeAllListeners(type);
      } else {
        eventEmitter.removeAllListeners();
      }
    },
    uiResponse,
    call,
    dispose,
    cancel,
    ...callableMethods,
    ...extraMethods
  };
};
exports.factory = factory;
//# sourceMappingURL=factory.js.map