import { Branded } from '@trezor/type-utils';
import { DEVICE_TYPE } from '../constants';
export * from './apiCall';
export type Session = `${number}` & Branded<'Session'>;
export declare const Session: (input: `${number}`) => Session;
export type PathInternal = string & Branded<'PathInternal'>;
export declare const PathInternal: (input: string) => PathInternal;
export type PathPublic = `${number}` & Branded<'PathPublic'>;
export declare const PathPublic: (input: `${number}`) => PathPublic;
export type ApiType = 'usb' | 'bluetooth' | 'udp';
export type DescriptorApiLevel = {
    path: PathInternal;
    type: DEVICE_TYPE;
    product?: number;
    vendor?: number;
    apiType: ApiType;
    id?: string;
};
export type Descriptor = Omit<DescriptorApiLevel, 'path'> & {
    path: PathPublic;
    session: null | Session;
    sessionOwner?: string;
    debugSession?: null | Session;
    debug?: boolean;
};
export interface Logger {
    info(...args: any): void;
    debug(...args: any): void;
    log(...args: any): void;
    warn(...args: any): void;
    error(...args: any): void;
}
//# sourceMappingURL=index.d.ts.map