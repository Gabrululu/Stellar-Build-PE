"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.LIBUSB_ERROR_MESSAGE = exports.serializeError = exports.TypedError = exports.TransportError = exports.nestError = exports.TrezorError = exports.ERROR_CODES = void 0;
exports.ERROR_CODES = {
  Init_NotInitialized: 'TrezorConnect not initialized',
  Init_AlreadyInitialized: 'TrezorConnect has been already initialized',
  Init_IframeBlocked: 'Iframe blocked',
  Init_IframeTimeout: 'Iframe timeout',
  Init_ManifestMissing: 'Manifest not set. Read more at https://github.com/trezor/trezor-suite/blob/develop/docs/packages/connect/index.md',
  Popup_ConnectionMissing: 'Unable to establish connection with iframe',
  Desktop_ConnectionMissing: 'Unable to establish connection with Suite',
  Transport_Missing: 'Transport is missing',
  Method_InvalidPackage: 'This package is not suitable to work with browser. Use @trezor/connect-web package instead',
  Method_InvalidParameter: '',
  Method_NotAllowed: 'Method not allowed for this configuration',
  Method_PermissionsNotGranted: 'Permissions not granted',
  Method_Cancel: 'Canceled',
  Method_Interrupted: 'Popup closed',
  Method_UnknownCoin: 'Coin not found',
  Method_AddressNotMatch: 'Addresses do not match',
  Method_Discovery_BundleException: '',
  Method_Override: 'override',
  Method_NoResponse: 'Call resolved without response',
  Method_Unsupported: 'Unsupported method',
  Backend_NotSupported: 'BlockchainLink settings not found in coins.json',
  Backend_WorkerMissing: '',
  Backend_Disconnected: 'Backend disconnected',
  Backend_Invalid: 'Invalid backend',
  Backend_Error: '',
  Runtime: '',
  Device_NotFound: 'Device not found',
  Device_InitializeFailed: '',
  Device_FwException: '',
  Device_ModeException: '',
  Device_Disconnected: 'Device disconnected',
  Device_UsedElsewhere: 'Device is used in another window',
  Device_InvalidState: 'Passphrase is incorrect',
  Device_CallInProgress: 'Device call in progress',
  Device_MultipleNotSupported: 'Multiple devices are not supported',
  Device_MissingCapability: 'Device is missing capability',
  Device_MissingCapabilityBtcOnly: 'Device is missing capability (BTC only)',
  Device_ThpPairingTagInvalid: 'Pairing tag mismatch',
  Device_ThpStateMissing: 'ThpState missing',
  Device_ThpPairingMethodsException: 'No common pairing methods',
  Failure_UnknownCode: 'Unknown error',
  Failure_EntropyCheck: '',
  Deeplink_VersionMismatch: 'Not compatible with current version of the app',
  Browser_LocalNetworkPermissionMissing: 'Local network permission is missing. Please allow local network access in browser settings.'
};
class TrezorError extends Error {
  code;
  message;
  constructor(code, message, options) {
    super(message, options);
    this.code = code;
    this.message = message;
  }
  toString() {
    return `${this.name} (code: ${this.code}): ${this.message}`;
  }
}
exports.TrezorError = TrezorError;
const nestError = cause => cause instanceof TrezorError ? new TrezorError(cause.code, cause.message, {
  cause
}) : new Error(cause.message, {
  cause
});
exports.nestError = nestError;
class TransportError extends Error {}
exports.TransportError = TransportError;
const TypedError = (id, message) => new TrezorError(id, message || exports.ERROR_CODES[id] || id);
exports.TypedError = TypedError;
const serializeError = payload => {
  const error = payload?.error instanceof Error ? payload.error : payload;
  return error instanceof Error ? {
    error: error.message,
    code: 'code' in error ? error.code : 'Failure_UnknownCode'
  } : {
    ...payload
  };
};
exports.serializeError = serializeError;
exports.LIBUSB_ERROR_MESSAGE = 'LIBUSB_ERROR';
//# sourceMappingURL=errors.js.map