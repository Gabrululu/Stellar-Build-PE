import { FirmwareType } from '@trezor/device-utils';
import type { DeviceModelInternal, FirmwareRelease, VersionArray } from '@trezor/device-utils';
import type { CurrentVersion } from '../data/firmwareInfo';
import type { Features, StrictFeatures } from '../types/device';
export declare const isStrictFeatures: (extFeatures: Features) => extFeatures is StrictFeatures;
type VersionCheckProperty = 'min_firmware_version' | 'min_bootloader_version';
export declare const findBestCompatibleRelease: (availableFirmwares: FirmwareRelease[], currentVesion: CurrentVersion, checkProperty: VersionCheckProperty) => FirmwareRelease | undefined;
export declare const buildLocalReleaseName: (firmwareType: FirmwareType, deviceModel: DeviceModelInternal, version: VersionArray) => string;
export declare const buildLocalFirmwareFileName: (firmwareType: FirmwareType, deviceModel: DeviceModelInternal, version: VersionArray) => string;
export declare const buildIntermediaryFirmwareFileName: (internalModel: DeviceModelInternal, version: number) => string;
export declare const getFirmwareMode: (features: Features) => "normal" | "bootloader" | "initialize" | "seedless";
export declare const getFirmwareType: (features: Features) => FirmwareType;
export declare const isFirmwareCacheUsedForSelectedSource: () => boolean;
export {};
//# sourceMappingURL=firmwareUtils.d.ts.map