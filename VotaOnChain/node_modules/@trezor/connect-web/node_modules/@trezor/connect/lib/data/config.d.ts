import { DeviceModelInternal } from '@trezor/device-utils';
import { TREZOR_USB_DESCRIPTORS } from '@trezor/transport/lib/constants';
type Config = {
    webusb: typeof TREZOR_USB_DESCRIPTORS;
    whitelist: Array<{
        origin: string;
        priority: number;
    }>;
    management: Array<{
        origin: string;
    }>;
    knownHosts: Array<{
        origin: string;
        label: string;
    }>;
    onionDomains: Record<string, string>;
    supportedBrowsers: Record<string, {
        version: number;
        download: string;
        update: string;
    }>;
    supportedFirmware: Array<{
        coin?: string[];
        capabilities?: string[];
        methods?: string[];
        min: Partial<Record<DeviceModelInternal, string>>;
        max?: undefined;
        comment?: string[];
    }>;
};
export declare const config: Config;
export {};
//# sourceMappingURL=config.d.ts.map