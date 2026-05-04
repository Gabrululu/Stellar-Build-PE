import { FirmwareReleaseConfig } from '@trezor/device-utils';
export declare const getFirmwareReleaseConfig: () => Promise<{
    config: any;
    isRemote: boolean;
}>;
export declare const getOnlyLocalFirmwareReleaseConfig: () => {
    config: FirmwareReleaseConfig;
    isRemote: false;
};
//# sourceMappingURL=firmwareReleaseConfigUtils.d.ts.map