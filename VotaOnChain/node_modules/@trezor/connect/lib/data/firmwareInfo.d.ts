import { ConditionalRelease, DeviceModelInternal, FirmwareRelease, FirmwareReleaseConfig, FirmwareType, IntermediaryReleaseConfig, VersionArray } from '@trezor/device-utils';
import { Features } from '../types/device';
import { FirmwareReleaseConfigInfo, FirmwareUpdateSource } from '../types/firmware';
interface RemoteBaseInfo {
    BASE_URL: string;
    MIDDLE_PATH: string;
}
type OnlineFirmwareBaseUrl = RemoteBaseInfo & {
    env: FirmwareUpdateSource;
};
export declare const getOnlineFirmwareBaseUrl: () => OnlineFirmwareBaseUrl;
export declare const getBundledRelease: (deviceModel: DeviceModelInternal, firmwareType: FirmwareType) => FirmwareRelease | undefined;
export declare const getOnlineReleaseByVersion: (deviceModel: DeviceModelInternal, firmwareVersion: VersionArray, firmwareType: FirmwareType) => Promise<FirmwareRelease | undefined>;
export declare const getReleaseConfig: (features: Features, firmwareType: FirmwareType) => ConditionalRelease | undefined;
export declare const getReleaseByVersion: (features: Features, firmwareVersion: VersionArray, firmwareType: FirmwareType) => Promise<FirmwareRelease | undefined>;
export declare const createLocalFirmwareConfig: (baseConfig: FirmwareReleaseConfig) => any;
export declare const createRemoteFirmwareConfig: (config: FirmwareReleaseConfig) => Promise<any>;
export declare const initializeFirmwareConfig: (config: FirmwareReleaseConfig, isRemote: boolean) => Promise<{
    releases: any;
    intermediaries: Record<DeviceModelInternal, IntermediaryReleaseConfig[]>;
}>;
export declare const getLanguage: (languageBinPath: string) => Promise<ArrayBuffer | Buffer<ArrayBufferLike>>;
export type CurrentVersion = {
    bootloaderVersion: VersionArray | null;
    firmwareVersion: VersionArray | null;
};
export declare const getCurrentVersion: (features: Features) => CurrentVersion;
interface GetReleaseInfoParams {
    features: Features;
    release: FirmwareRelease;
    conditions: ConditionalRelease['conditions'];
    intermediary: IntermediaryReleaseConfig | undefined;
    firmwareType: FirmwareType;
    isBitcoinOnlyAvailable: boolean;
    releasesOfDevice: FirmwareRelease[];
}
export declare const getReleaseInfo: ({ features, release, conditions, intermediary, firmwareType, isBitcoinOnlyAvailable, releasesOfDevice, }: GetReleaseInfoParams) => FirmwareReleaseConfigInfo;
export declare const getFirmwareReleaseConfigInfo: (features: Features, firmwareType: FirmwareType) => FirmwareReleaseConfigInfo | undefined;
export declare const getFirmwareStatus: (features: Features, firmwareType: FirmwareType) => "valid" | "outdated" | "required" | "unknown" | "custom" | "none";
type GetFirmwareLocationParam = {
    firmwareVersion: VersionArray;
    remotePath: string;
    deviceModel: DeviceModelInternal;
    firmwareType: FirmwareType;
    intermediaryVersion?: number;
};
type FirmwareLocationPathParams = {
    baseUrl: string;
    path: string;
};
export declare const getFirmwareLocation: ({ firmwareVersion, remotePath, deviceModel, firmwareType, intermediaryVersion, }: GetFirmwareLocationParam) => FirmwareLocationPathParams;
export {};
//# sourceMappingURL=firmwareInfo.d.ts.map