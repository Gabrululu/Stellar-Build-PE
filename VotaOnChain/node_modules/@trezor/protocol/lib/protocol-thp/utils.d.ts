import type { ThpState } from './ThpState';
import { ThpMessageSyncBit, ThpPairingMethod } from './messages';
export declare const addAckBit: (magic: number, ackBit: number) => Buffer<ArrayBuffer>;
export declare const addSequenceBit: (magic: number, seqBit: number) => Buffer<ArrayBuffer>;
export declare const clearControlBit: (magic: number) => number;
export declare const getControlBit: (magic: number) => {
    ackBit: ThpMessageSyncBit;
    sequenceBit: ThpMessageSyncBit;
};
export declare const readThpHeader: (bytes: Buffer) => {
    magic: number;
    ackBit: ThpMessageSyncBit;
    sequenceBit: ThpMessageSyncBit;
    channel: Buffer<ArrayBufferLike>;
};
export declare const isAckExpected: (bytesOrMagic: Buffer | number[]) => boolean;
export declare const getExpectedResponses: (bytes: Buffer) => number[];
export declare const getExpectedHeaders: (state: ThpState) => Buffer[];
export declare const isExpectedResponse: (bytes: Buffer, state: ThpState) => boolean;
export declare const isThpMessageName: (name: string) => boolean;
export declare const getThpPairingMethod: (dm: ThpPairingMethod | keyof typeof ThpPairingMethod) => ThpPairingMethod;
//# sourceMappingURL=utils.d.ts.map