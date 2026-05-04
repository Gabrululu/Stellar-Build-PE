import { DeviceModelInternal, FirmwareRelease, FirmwareType, VersionArray } from '@trezor/device-utils';
export declare class HttpRequestError extends Error {
    response: Response;
    constructor(response: Response);
}
export declare const getReleasesAssetByDeviceModelAndFirmwareType: (deviceModel: DeviceModelInternal, firmwareType: FirmwareType) => FirmwareRelease[];
export declare const getReleaseAsset: (deviceModel: DeviceModelInternal, version: VersionArray, firmwareType: FirmwareType) => FirmwareRelease;
export declare const firmwareReleaseConfigAssets: any;
export declare const tryLocalAssetRequire: (url: string) => unknown;
//# sourceMappingURL=assetUtils.d.ts.map