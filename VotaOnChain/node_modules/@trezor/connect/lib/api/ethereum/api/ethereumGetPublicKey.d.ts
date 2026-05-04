import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../../../core/AbstractMethod';
import type { EthereumNetworkInfo } from '../../../types';
type Params = PROTO.EthereumGetPublicKey & {
    network?: EthereumNetworkInfo;
};
export default class EthereumGetPublicKey extends AbstractMethod<'ethereumGetPublicKey', Params[]> {
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
//# sourceMappingURL=ethereumGetPublicKey.d.ts.map