import { AbstractApi, AbstractApiConstructorParams } from './abstract';
import { DescriptorApiLevel } from '../types';
interface ConstructorParams extends Omit<AbstractApiConstructorParams, 'type'> {
    usbInterface: USB;
    forceReadSerialOnConnect?: boolean;
    debugLink?: boolean;
}
interface TransportInterfaceDevice {
    session?: null | string;
    path: string;
    device: USBDevice;
}
export declare class UsbApi extends AbstractApi {
    chunkSize: number;
    protected devices: TransportInterfaceDevice[];
    protected usbInterface: ConstructorParams['usbInterface'];
    private forceReadSerialOnConnect?;
    private abortController;
    private debugLink?;
    private synchronizeCreateDevices;
    private synchronizeGetDevices;
    private synchronizeResetDevice;
    private deviceResetMap;
    private devicePendingTransferIn;
    constructor({ usbInterface, logger, forceReadSerialOnConnect, debugLink }: ConstructorParams);
    listen(): void;
    private formatDeviceForLog;
    private matchDeviceType;
    private devicesToDescriptors;
    private abortableMethod;
    enumerate(signal?: AbortSignal): Promise<{
        success: false;
        error: never;
        message: string | undefined;
    } | {
        success: false;
        error: "unexpected error";
        message: string;
    } | import("../types").Success<DescriptorApiLevel[]>>;
    private getTransferIn;
    read(path: string, signal?: AbortSignal): Promise<import("../types").Success<Buffer<ArrayBufferLike>> | {
        success: false;
        error: "Unable to open device" | "device not found" | "device disconnected during action" | "unexpected error" | "Aborted by signal" | "Aborted by timeout";
        message: string | undefined;
    }>;
    write(path: string, buffer: Buffer, signal?: AbortSignal): Promise<import("../types").Success<undefined> | {
        success: false;
        error: "Unable to open device" | "device not found" | "device disconnected during action" | "unexpected error" | "Aborted by signal" | "Aborted by timeout";
        message: string | undefined;
    }>;
    openDevice(path: string, options: {
        reset: boolean;
        signal?: AbortSignal;
    }): Promise<import("../types").Success<undefined> | {
        success: false;
        error: "Unable to open device";
        message: string | undefined;
    } | {
        success: false;
        error: "device not found";
        message: string | undefined;
    } | {
        success: false;
        error: "LIBUSB_ERROR_ACCESS";
        message: string | undefined;
    }>;
    private openInternal;
    closeDevice(path: string): Promise<import("../types").Success<undefined> | {
        success: false;
        error: "device not found";
        message: string | undefined;
    } | {
        success: false;
        error: "Unable to close device";
        message: string | undefined;
    }>;
    private findDevice;
    private createDevices;
    private loadSerialNumber;
    private resetDevice;
    private filterDevices;
    private isInterfaceClaimed;
    private handleReadWriteError;
    dispose(): void;
}
export {};
//# sourceMappingURL=usb.d.ts.map