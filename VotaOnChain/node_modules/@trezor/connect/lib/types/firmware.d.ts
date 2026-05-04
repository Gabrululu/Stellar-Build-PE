import type { ConditionalRelease, DeviceModelInternal, FirmwareRelease, FirmwareType, IntermediaryReleaseConfig, VersionArray } from '@trezor/device-utils';
export type FirmwareRange = Record<DeviceModelInternal, {
    min: string;
    max: string;
}>;
export type BinaryInfo = {
    binary: ArrayBuffer;
    binaryVersion: VersionArray;
    release?: FirmwareRelease;
};
export type FirmwareReleaseConfigInfo = {
    firmwareType: FirmwareType;
    isBitcoinOnlyAvailable: boolean;
    releaseConditions: ConditionalRelease['conditions'] & {
        shouldBeOffered: boolean;
    };
    release: FirmwareRelease;
    intermediary: IntermediaryReleaseConfig | undefined;
    isRequired: boolean | null;
    isNewer: boolean | null;
    translations?: Record<string, string>;
};
export type FirmwareUpdateFlowType = 'reboot_and_wait' | 'reboot_and_upgrade' | 'manual' | 'unknown_flow';
export type FirmwareUpdateSource = 'production' | 'test-unsigned' | 'test-unsigned-stable' | 'test-signed' | 'localhost-unsigned' | 'localhost-signed';
//# sourceMappingURL=firmware.d.ts.map