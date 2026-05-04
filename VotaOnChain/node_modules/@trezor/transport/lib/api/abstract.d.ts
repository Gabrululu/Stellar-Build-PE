import { TypedEmitter } from '@trezor/utils';
import { TRANSPORT } from '../constants';
import * as ERRORS from '../errors';
import type { AnyError, ApiType, AsyncResultWithTypedError, DescriptorApiLevel, Logger, PathInternal, Success } from '../types';
export interface AbstractApiConstructorParams {
    logger?: Logger;
    type: ApiType;
}
export type OpenDeviceChannel = 'read' | 'trezor-push-notification' | 'battery-level';
type AccessLock = {
    read: boolean;
    write: boolean;
};
export declare abstract class AbstractApi extends TypedEmitter<{
    'transport-interface-change': DescriptorApiLevel[];
    'transport-interface-error': {
        error: typeof ERRORS.API_DISCONNECTED;
    };
    [TRANSPORT.TREZOR_PUSH_NOTIFICATION]: {
        id: string;
        data: number[];
    };
    [TRANSPORT.BATTERY_LEVEL]: {
        id: string;
        data: number[];
    };
}> {
    protected logger?: Logger;
    protected listening: boolean;
    protected lock: Record<string, AccessLock>;
    type: ApiType;
    constructor({ logger, type }: AbstractApiConstructorParams);
    abstract enumerate(signal?: AbortSignal): AsyncResultWithTypedError<DescriptorApiLevel[], typeof ERRORS.ABORTED_BY_TIMEOUT | typeof ERRORS.ABORTED_BY_SIGNAL | typeof ERRORS.UNEXPECTED_ERROR>;
    abstract listen(): void;
    abstract read(path: PathInternal, signal?: AbortSignal): AsyncResultWithTypedError<Buffer, typeof ERRORS.DEVICE_NOT_FOUND | typeof ERRORS.INTERFACE_UNABLE_TO_OPEN_DEVICE | typeof ERRORS.INTERFACE_DATA_TRANSFER | typeof ERRORS.DEVICE_DISCONNECTED_DURING_ACTION | typeof ERRORS.UNEXPECTED_ERROR | typeof ERRORS.ABORTED_BY_TIMEOUT | typeof ERRORS.ABORTED_BY_SIGNAL>;
    abstract write(path: PathInternal, buffers: Buffer, signal?: AbortSignal): AsyncResultWithTypedError<undefined, typeof ERRORS.DEVICE_NOT_FOUND | typeof ERRORS.INTERFACE_UNABLE_TO_OPEN_DEVICE | typeof ERRORS.INTERFACE_DATA_TRANSFER | typeof ERRORS.DEVICE_DISCONNECTED_DURING_ACTION | typeof ERRORS.ABORTED_BY_TIMEOUT | typeof ERRORS.ABORTED_BY_SIGNAL | typeof ERRORS.UNEXPECTED_ERROR>;
    abstract openDevice(path: PathInternal, options?: {
        reset: boolean;
        signal?: AbortSignal;
        channel?: OpenDeviceChannel;
    }): AsyncResultWithTypedError<undefined, typeof ERRORS.DEVICE_NOT_FOUND | typeof ERRORS.INTERFACE_UNABLE_TO_OPEN_DEVICE | typeof ERRORS.UNEXPECTED_ERROR | typeof ERRORS.ABORTED_BY_TIMEOUT | typeof ERRORS.ABORTED_BY_SIGNAL | typeof ERRORS.LIBUSB_ERROR_ACCESS>;
    abstract closeDevice(path: PathInternal, options?: {
        channel?: OpenDeviceChannel;
    }): AsyncResultWithTypedError<undefined, typeof ERRORS.DEVICE_NOT_FOUND | typeof ERRORS.INTERFACE_UNABLE_TO_CLOSE_DEVICE | typeof ERRORS.UNEXPECTED_ERROR>;
    abstract dispose(): void;
    abstract chunkSize: number;
    protected success<T>(payload: T): Success<T>;
    protected error<E extends AnyError>(payload: {
        error: E;
        message?: string;
    }): {
        success: false;
        error: E;
        message: string | undefined;
    };
    protected unknownError<E extends AnyError = never>(err: Error, expectedErrors?: E[]): {
        success: false;
        error: E;
        message: string | undefined;
    } | {
        success: false;
        error: "unexpected error";
        message: string;
    };
    private synchronize;
    private requestAccess;
    runInIsolation: <T extends () => ReturnType<T>>({ lock, path }: {
        lock: AccessLock;
        path: string;
    }, fn: T) => Promise<{
        success: false;
        error: "other call in progress";
        message: string | undefined;
    } | (ReturnType<T> extends infer T_1 ? T_1 extends ReturnType<T> ? T_1 extends Promise<unknown> ? T_1 : Promise<T_1> : never : never) | {
        success: false;
        error: "unexpected error";
        message: string;
    }>;
}
export type AbstractApiAwaitedResult<K extends keyof AbstractApi> = AbstractApi[K] extends (...args: any[]) => any ? Awaited<ReturnType<AbstractApi[K]>> : never;
export {};
//# sourceMappingURL=abstract.d.ts.map