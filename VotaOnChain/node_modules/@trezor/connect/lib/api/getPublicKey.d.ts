import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
import type { BitcoinNetworkInfo } from '../types';
type Params = PROTO.GetPublicKey & {
    coinInfo?: BitcoinNetworkInfo;
    suppressBackupWarning?: boolean;
    unlockPath?: PROTO.UnlockPath;
};
export default class GetPublicKey extends AbstractMethod<'getPublicKey', Params[]> {
    hasBundle?: boolean;
    init(): void;
    get info(): string;
    get confirmation(): {
        view: "export-xpub";
        label: string;
    };
    run(): Promise<({
        path: number[];
        publicKey: string;
        serializedPath: string;
    } & {
        descriptor?: string | undefined;
        xpubSegwit?: string | undefined;
        descriptorChecksum?: string | undefined;
        depth: number;
        fingerprint: number;
        xpub: string;
        childNum: number;
        chainCode: string;
    }) | ({
        path: number[];
        publicKey: string;
        serializedPath: string;
    } & {
        descriptor?: string | undefined;
        xpubSegwit?: string | undefined;
        descriptorChecksum?: string | undefined;
        depth: number;
        fingerprint: number;
        xpub: string;
        childNum: number;
        chainCode: string;
    })[]>;
}
export {};
//# sourceMappingURL=getPublicKey.d.ts.map