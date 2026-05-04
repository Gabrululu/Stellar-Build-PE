import { PROTO } from '../../constants';
import type { Device } from '../../device/Device';
import type { TypedCall } from '../../device/DeviceCommands';
import { CoreEventMessage } from '../../events';
import { FirmwareUpdateFlowType } from '../../types';
type UploadFirmwareProps = {
    typedCall: TypedCall;
    postMessage: (message: CoreEventMessage) => void;
    device: Device;
    firmwareUploadRequest: PROTO.FirmwareUpload;
    updateFlowType: FirmwareUpdateFlowType;
};
export declare const uploadFirmware: ({ typedCall, postMessage, device, firmwareUploadRequest: { payload }, updateFlowType, }: UploadFirmwareProps) => Promise<{
    message: string;
} | {
    type: "Success";
    message: {
        message: string;
    };
}>;
export {};
//# sourceMappingURL=uploadFirmware.d.ts.map