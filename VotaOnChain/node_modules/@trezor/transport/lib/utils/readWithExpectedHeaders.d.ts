import { thp as protocolThp } from '@trezor/protocol';
import { AbstractApi } from '../api/abstract';
import { Logger } from '../types';
type Receiver = (attemptSignal?: AbortSignal) => ReturnType<AbstractApi['read']>;
type Options = {
    signal?: AbortSignal;
    attempts?: number;
    timeout?: number;
    logger?: Logger;
    graceful?: boolean;
};
export declare function readWithExpectedHeaders<T extends Receiver>(receiver: T, options?: Options): (thpState?: protocolThp.ThpState, signal?: AbortSignal) => Promise<import("../types").Success<Buffer<ArrayBufferLike>> | {
    success: false;
    error: "Unable to open device" | "A transfer error has occurred." | "device not found" | "device disconnected during action" | "unexpected error" | "Aborted by signal" | "Aborted by timeout";
    message?: string;
}>;
export {};
//# sourceMappingURL=readWithExpectedHeaders.d.ts.map