import type { FirmwareType, VersionArray } from '@trezor/device-utils';
import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { FirmwareRevisionCheckResult } from '../types/device';
export type CheckFirmwareRevisionParams = {
    firmwareVersion: VersionArray;
    internalModel: PROTO.DeviceModelInternal;
    deviceRevision: string | null;
    expectedRevision: string | undefined;
    firmwareType: FirmwareType;
};
export declare const checkFirmwareRevision: ({ firmwareVersion, internalModel, deviceRevision, expectedRevision, firmwareType, }: CheckFirmwareRevisionParams) => Promise<FirmwareRevisionCheckResult>;
//# sourceMappingURL=checkFirmwareRevision.d.ts.map