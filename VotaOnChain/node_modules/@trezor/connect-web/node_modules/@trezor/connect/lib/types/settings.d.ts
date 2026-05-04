import type { BlockchainSettings } from '@trezor/blockchain-link';
import type { DeviceModelInternal } from '@trezor/device-utils';
import type { ThpCredentials, ThpPairingMethod } from '@trezor/protocol';
import type { Transport } from '@trezor/transport';
import { PartialRecord } from '@trezor/type-utils';
import type { FirmwareUpdateSource } from '../types/firmware';
export type { SystemInfo } from '@trezor/connect-common';
export interface Manifest {
    appName: string;
    appIcon?: string;
    appUrl: string;
    email: string;
}
export type FirmwareHashCheckTimeouts = PartialRecord<DeviceModelInternal, number>;
export type Proxy = BlockchainSettings['proxy'];
export type LocalFirmwares = {
    firmwareDir: string;
    firmwareList: string[];
};
type KnownTransport = Exclude<Transport['name'], 'NativeUsbTransport' | 'BluetoothTransport' | 'NativeBluetoothTransport'>;
export type ThpSettings = {
    hostName?: string;
    appName?: string;
    staticKey?: string;
    knownCredentials?: ThpCredentials[];
    pairingMethods: ThpPairingMethod[] | (keyof typeof ThpPairingMethod)[];
};
export type ConnectSettingsTransport = KnownTransport | Transport | (new (...args: any[]) => Transport);
export interface ConnectSettingsPublic {
    manifest?: Manifest;
    connectSrc?: string;
    debug?: boolean;
    popup?: boolean;
    transportReconnect?: boolean;
    transports?: ConnectSettingsTransport[];
    pendingTransportEvent?: boolean;
    lazyLoad?: boolean;
    interactionTimeout?: number;
    trustedHost: boolean;
    binFilesBaseUrl?: string;
    enableFirmwareHashCheck?: boolean;
    firmwareHashCheckTimeouts?: FirmwareHashCheckTimeouts;
    thp?: ThpSettings;
}
export interface ConnectSettingsInternal {
    origin?: string;
    configSrc: string;
    iframeSrc: string;
    popupSrc: string;
    webusbSrc: string;
    version: string;
    npmVersion?: string;
    priority: number;
    extension?: string;
    env: 'node' | 'web' | 'webextension' | 'electron' | 'react-native';
    timestamp: number;
    proxy?: Proxy;
    sharedLogger?: boolean;
    useCoreInPopup?: boolean;
    localFirmwares?: LocalFirmwares;
    firmwareUpdateSource?: FirmwareUpdateSource;
}
export interface ConnectSettingsWeb {
    hostLabel?: string;
    coreMode?: 'auto' | 'popup' | 'iframe' | 'deeplink' | 'suite-desktop' | 'suite-web';
}
export interface ConnectSettingsWebextension {
    _extendWebextensionLifetime?: boolean;
    coreMode?: 'auto' | 'popup' | 'suite-desktop' | 'suite-web';
}
export interface ConnectSettingsMobile {
    deeplinkUrl: string;
    deeplinkOpen?: (url: string) => void;
    deeplinkCallbackUrl?: string;
    coreMode?: 'deeplink';
}
export type ConnectSettings = ConnectSettingsPublic & ConnectSettingsInternal & Omit<ConnectSettingsWeb & ConnectSettingsWebextension & ConnectSettingsMobile, 'coreMode'> & {
    coreMode?: ConnectSettingsWeb['coreMode'] | ConnectSettingsWebextension['coreMode'] | ConnectSettingsMobile['coreMode'];
};
//# sourceMappingURL=settings.d.ts.map