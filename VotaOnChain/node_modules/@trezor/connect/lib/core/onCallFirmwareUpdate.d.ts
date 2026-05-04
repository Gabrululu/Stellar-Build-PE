import type { Device } from '../device/Device';
import { DeviceList } from '../device/DeviceList';
import { CoreEventMessage, UiPromiseCreator } from '../events';
import { CommonParams, DeviceUniquePath } from '../types';
import { FirmwareUpdateResponse } from '../types/api/firmwareUpdate';
import type { Log } from '../utils/debug';
type PostMessage = (message: CoreEventMessage) => void;
type ReconnectContext = {
    deviceList: DeviceList;
    device: Device;
    registerEvents: (device: Device) => void;
    postMessage: PostMessage;
    log: Log;
    abortSignal: AbortSignal;
    uiPromises: {
        create: UiPromiseCreator;
        rejectAll: (e: Error) => void;
    };
};
export type Params = {
    language?: string;
    baseUrl?: string;
    btcOnly?: boolean;
    binary?: ArrayBuffer;
} & CommonParams;
type Context = {
    deviceList: DeviceList;
    registerEvents: (device: Device) => void;
    postMessage: PostMessage;
    initDevice: (path?: DeviceUniquePath) => Promise<Device>;
    log: Log;
    abortSignal: AbortSignal;
    uiPromises: ReconnectContext['uiPromises'];
};
type OnCallFirmwareUpdateParams = {
    params: Params;
    context: Context;
};
export declare const onCallFirmwareUpdate: ({ params, context, }: OnCallFirmwareUpdateParams) => Promise<FirmwareUpdateResponse>;
export {};
//# sourceMappingURL=onCallFirmwareUpdate.d.ts.map