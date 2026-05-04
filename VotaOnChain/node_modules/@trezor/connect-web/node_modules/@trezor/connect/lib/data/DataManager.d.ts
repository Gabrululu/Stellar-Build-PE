import { ConditionalRelease, DeviceModelInternal, FirmwareReleaseConfig, FirmwareType, IntermediaryReleaseConfig, ReleasesConfig } from '@trezor/device-utils';
import type { ConnectSettings, LocalFirmwares } from '../types/settings';
type AssetKeys = `firmware-${string}` | 'coins' | 'coinsEth';
type AssetCollection = {
    [K in AssetKeys]?: Record<string, any>;
};
export declare class DataManager {
    static assets: AssetCollection;
    private static settings;
    private static messages;
    private static localFirmwares;
    private static firmwareReleasesConfig;
    private static firmwareIntermediaryReleasesConfig;
    private static localFirmwareReleaseConfig;
    static load(settings: ConnectSettings, withAssets?: boolean, onlyLocalFirmwareConfig?: boolean): Promise<void>;
    static prepareLocalFirmwareReleaseData(): void;
    static loadFirmwareRelaseConfig(onlyLocal: boolean): Promise<void>;
    static getProtobufMessages(): Record<string, any>;
    static getSettings(key?: undefined): ConnectSettings;
    static getSettings<T extends keyof ConnectSettings>(key: T): ConnectSettings[T];
    static setLocalFirmwares(firmwares: LocalFirmwares): void;
    static getLocalFirmwares(): LocalFirmwares;
    static setLocalFirmwareReleaseConfig(localFirmwareReleaseConfig: FirmwareReleaseConfig): void;
    static getLocalFirmwareReleaseConfig(): FirmwareReleaseConfig;
    static setFirmwareReleaseConfig(releaseConfig: ReleasesConfig): void;
    static getFirmwareReleaseConfig(): Partial<Record<"T1B1" | "T2T1" | "T2B1" | "T3B1" | "T3T1" | "T3W1" | "UNKNOWN", Record<FirmwareType, ConditionalRelease>>>;
    static setFirmwareIntermediaryReleaseConfig(intermediariesConfig: Record<DeviceModelInternal, IntermediaryReleaseConfig[]>): void;
    static getFirmwareIntermediaryReleaseConfig(): Record<"T1B1" | "T2T1" | "T2B1" | "T3B1" | "T3T1" | "T3W1" | "UNKNOWN", IntermediaryReleaseConfig[]> | undefined;
}
export {};
//# sourceMappingURL=DataManager.d.ts.map