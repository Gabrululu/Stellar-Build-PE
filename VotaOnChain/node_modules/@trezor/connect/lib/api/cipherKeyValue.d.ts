import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class CipherKeyValue extends AbstractMethod<'cipherKeyValue', PROTO.CipherKeyValue[]> {
    hasBundle?: boolean;
    init(): void;
    get info(): string;
    run(): Promise<{
        value: string;
    } | {
        value: string;
    }[]>;
}
//# sourceMappingURL=cipherKeyValue.d.ts.map