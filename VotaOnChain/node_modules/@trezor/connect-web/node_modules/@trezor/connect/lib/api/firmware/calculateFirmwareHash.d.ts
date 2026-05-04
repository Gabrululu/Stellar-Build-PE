import { DeviceModelInternal, VersionArray } from '@trezor/device-utils';
type CalculateFirmwareHashParams = {
    internal_model: DeviceModelInternal;
    fw: ArrayBuffer;
    firmwareVersion: VersionArray;
    key?: Buffer;
};
export declare const calculateFirmwareHash: ({ internal_model, firmwareVersion, fw, key, }: CalculateFirmwareHashParams) => {
    hash: string;
    challenge: string;
};
export {};
//# sourceMappingURL=calculateFirmwareHash.d.ts.map