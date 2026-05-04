import { Messages } from '@trezor/protobuf';
import { thp } from '@trezor/protocol';
export declare const ERROR_CODES: {
    readonly Init_NotInitialized: "TrezorConnect not initialized";
    readonly Init_AlreadyInitialized: "TrezorConnect has been already initialized";
    readonly Init_IframeBlocked: "Iframe blocked";
    readonly Init_IframeTimeout: "Iframe timeout";
    readonly Init_ManifestMissing: "Manifest not set. Read more at https://github.com/trezor/trezor-suite/blob/develop/docs/packages/connect/index.md";
    readonly Popup_ConnectionMissing: "Unable to establish connection with iframe";
    readonly Desktop_ConnectionMissing: "Unable to establish connection with Suite";
    readonly Transport_Missing: "Transport is missing";
    readonly Method_InvalidPackage: "This package is not suitable to work with browser. Use @trezor/connect-web package instead";
    readonly Method_InvalidParameter: "";
    readonly Method_NotAllowed: "Method not allowed for this configuration";
    readonly Method_PermissionsNotGranted: "Permissions not granted";
    readonly Method_Cancel: "Canceled";
    readonly Method_Interrupted: "Popup closed";
    readonly Method_UnknownCoin: "Coin not found";
    readonly Method_AddressNotMatch: "Addresses do not match";
    readonly Method_Discovery_BundleException: "";
    readonly Method_Override: "override";
    readonly Method_NoResponse: "Call resolved without response";
    readonly Method_Unsupported: "Unsupported method";
    readonly Backend_NotSupported: "BlockchainLink settings not found in coins.json";
    readonly Backend_WorkerMissing: "";
    readonly Backend_Disconnected: "Backend disconnected";
    readonly Backend_Invalid: "Invalid backend";
    readonly Backend_Error: "";
    readonly Runtime: "";
    readonly Device_NotFound: "Device not found";
    readonly Device_InitializeFailed: "";
    readonly Device_FwException: "";
    readonly Device_ModeException: "";
    readonly Device_Disconnected: "Device disconnected";
    readonly Device_UsedElsewhere: "Device is used in another window";
    readonly Device_InvalidState: "Passphrase is incorrect";
    readonly Device_CallInProgress: "Device call in progress";
    readonly Device_MultipleNotSupported: "Multiple devices are not supported";
    readonly Device_MissingCapability: "Device is missing capability";
    readonly Device_MissingCapabilityBtcOnly: "Device is missing capability (BTC only)";
    readonly Device_ThpPairingTagInvalid: "Pairing tag mismatch";
    readonly Device_ThpStateMissing: "ThpState missing";
    readonly Device_ThpPairingMethodsException: "No common pairing methods";
    readonly Failure_UnknownCode: "Unknown error";
    readonly Failure_EntropyCheck: "";
    readonly Deeplink_VersionMismatch: "Not compatible with current version of the app";
    readonly Browser_LocalNetworkPermissionMissing: "Local network permission is missing. Please allow local network access in browser settings.";
};
type TypedErrorCode = keyof typeof ERROR_CODES;
export type ErrorCode = TypedErrorCode | Messages.FailureType | thp.ThpError['code'];
export declare class TrezorError extends Error {
    code: ErrorCode;
    message: string;
    constructor(code: ErrorCode, message: string, options?: ErrorOptions);
    toString(): string;
}
export declare const nestError: (cause: Error) => Error;
export declare class TransportError extends Error {
}
export declare const TypedError: (id: ErrorCode, message?: string) => TrezorError;
export declare const serializeError: (payload: any) => any;
export declare const LIBUSB_ERROR_MESSAGE = "LIBUSB_ERROR";
export {};
//# sourceMappingURL=errors.d.ts.map