import UDP from 'dgram';
import { AbstractApi, AbstractApiConstructorParams } from './abstract';
import { DEVICE_TYPE } from '../constants';
import { DescriptorApiLevel, PathInternal } from '../types';
export declare class UdpApi extends AbstractApi {
    chunkSize: number;
    protected devices: DescriptorApiLevel[];
    private listenAbortController;
    protected interface: UDP.Socket;
    private debugLink?;
    private readBuffer;
    constructor({ logger, debugLink, }: Omit<AbstractApiConstructorParams, 'type'> & {
        debugLink?: boolean;
    });
    listen(): void;
    private listenLoop;
    write(path: string, buffer: Buffer, signal?: AbortSignal): Promise<import("../types").Success<undefined> | {
        success: false;
        error: "Unable to open device" | "A transfer error has occurred." | "device not found" | "device disconnected during action" | "unexpected error" | "Aborted by signal" | "Aborted by timeout";
        message?: string;
    }>;
    read(path: string, signal?: AbortSignal): Promise<import("../types").Success<Buffer<ArrayBufferLike>> | {
        success: false;
        error: "A transfer error has occurred." | "Aborted by signal";
        message?: string;
    }>;
    private ping;
    enumerate(signal?: AbortSignal): Promise<{
        success: false;
        error: "Aborted by signal";
        message: string | undefined;
    } | import("../types").Success<{
        path: PathInternal;
        type: DEVICE_TYPE;
        product: number;
        vendor: number;
        id: PathInternal;
        apiType: import("../types").ApiType;
    }[]>>;
    private handleDevicesChange;
    openDevice(_path: string): Promise<import("../types").Success<undefined>>;
    closeDevice(path: string): Promise<import("../types").Success<undefined>>;
    dispose(): void;
}
//# sourceMappingURL=udp.d.ts.map