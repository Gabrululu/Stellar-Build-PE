import { FeaturesNarrowing, FirmwareType } from '@trezor/device-utils';
import { MessagesSchema as PROTO } from '@trezor/protobuf';
import type { ThpStateSerialized } from '@trezor/protocol';
import { Descriptor } from '@trezor/transport';
import { Branded } from '@trezor/type-utils';
import type { FirmwareReleaseConfigInfo } from './firmware';
export type DeviceBusyStatus = 'busy' | 'rebooting' | 'bootloader-locked' | 'hard-locked' | 'pin-locked' | 'thp-locked';
export type DeviceStatus = 'available' | 'occupied' | 'used' | DeviceBusyStatus;
export type DeviceMode = 'normal' | 'bootloader' | 'initialize' | 'seedless';
export type DeviceFirmwareStatus = 'valid' | 'outdated' | 'required' | 'unknown' | 'custom' | 'none';
export type UnavailableCapability = 'no-capability' | 'no-support' | 'update-required' | 'trezor-connect-outdated';
export type StaticSessionId = `${string}@${string}:${number}`;
export type DeviceState = {
    sessionId?: string;
    staticSessionId?: StaticSessionId;
    deriveCardano?: boolean;
};
export type DeviceThpState = {
    properties?: ThpStateSerialized['properties'];
    credentials: ThpStateSerialized['credentials'];
    channel: string;
};
export type UnavailableCapabilities = {
    [key: string]: UnavailableCapability;
};
export type FirmwareRevisionCheckError = 'revision-mismatch' | 'firmware-version-unknown' | 'cannot-perform-check-offline' | 'other-error';
export type FirmwareRevisionCheckResult = {
    success: true;
} | {
    success: false;
    error: FirmwareRevisionCheckError;
    errorPayload?: unknown;
};
export type FirmwareHashCheckError = 'hash-mismatch' | 'check-skipped' | 'check-unsupported' | 'unknown-release' | 'takes-too-long' | 'other-error';
export type FirmwareHashCheckResult = {
    success: true;
    attemptCount?: number;
    warningPayload?: unknown;
} | {
    success: false;
    error: FirmwareHashCheckError;
    attemptCount?: number;
    errorPayload?: unknown;
};
export type DeviceUniquePath = string & Branded<'DeviceUniquePath'>;
export declare const asDeviceUniquePath: (id: string) => DeviceUniquePath;
type BaseDevice = {
    path: DeviceUniquePath;
    name: string;
    descriptor: Pick<Descriptor, 'apiType' | 'id'>;
};
export type BluetoothDeviceId = string & Branded<'BluetoothDeviceId'>;
export declare const asBluetoothDeviceId: (id: string) => BluetoothDeviceId;
export type BluetoothDeviceProps = {
    id: BluetoothDeviceId;
};
export type KnownDevice = BaseDevice & {
    type: 'acquired';
    id: string | null;
    label: string;
    error?: typeof undefined;
    firmware: DeviceFirmwareStatus;
    firmwareReleaseConfigInfo?: FirmwareReleaseConfigInfo | null;
    firmwareType?: FirmwareType;
    color?: string;
    status: DeviceStatus;
    mode: DeviceMode;
    _state?: DeviceState;
    state?: DeviceState['staticSessionId'];
    features: PROTO.Features;
    thp?: DeviceThpState;
    unavailableCapabilities: UnavailableCapabilities;
    availableTranslations: Record<string, string>;
    authenticityChecks: {
        firmwareRevision: FirmwareRevisionCheckResult | null;
        firmwareHash: FirmwareHashCheckResult | null;
    };
    transportSessionOwner?: undefined;
    hid?: undefined;
    bluetoothProps?: BluetoothDeviceProps;
    usb_connected?: boolean;
    wireless_connected?: boolean;
};
export type UnknownDevice = BaseDevice & {
    type: 'unacquired';
    label: 'Unacquired device';
    id?: typeof undefined;
    error?: typeof undefined;
    features?: typeof undefined;
    thp?: DeviceThpState;
    firmware?: typeof undefined;
    firmwareReleaseConfigInfo?: typeof undefined;
    firmwareType?: typeof undefined;
    color?: typeof undefined;
    status?: DeviceStatus;
    mode?: typeof undefined;
    _state?: typeof undefined;
    state?: typeof undefined;
    unavailableCapabilities?: typeof undefined;
    availableTranslations?: typeof undefined;
    transportSessionOwner?: string;
    hid?: undefined;
    bluetoothProps?: BluetoothDeviceProps;
};
export type UnreadableDevice = BaseDevice & {
    type: 'unreadable';
    label: 'Unreadable device';
    error: string;
    id?: typeof undefined;
    features?: typeof undefined;
    thp?: typeof undefined;
    firmware?: typeof undefined;
    firmwareReleaseConfigInfo?: typeof undefined;
    firmwareType?: typeof undefined;
    color?: typeof undefined;
    status?: typeof undefined;
    mode?: typeof undefined;
    _state?: typeof undefined;
    state?: typeof undefined;
    unavailableCapabilities?: typeof undefined;
    availableTranslations?: typeof undefined;
    transportSessionOwner?: undefined;
    hid: boolean;
    bluetoothProps?: typeof undefined;
};
export type Device = KnownDevice | UnknownDevice | UnreadableDevice;
export type Features = PROTO.Features;
export type DisplayRotation = PROTO.DisplayRotation;
export type StrictFeatures = Features & FeaturesNarrowing;
export type ProofOfDelegatedIdentity = string & Branded<'ProofOfDelegatedIdentity'>;
export declare const asProofOfDelegatedIdentity: (value: string) => ProofOfDelegatedIdentity;
export {};
//# sourceMappingURL=device.d.ts.map