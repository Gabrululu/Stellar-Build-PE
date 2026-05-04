import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class EvoluGetDelegatedIdentityKey extends AbstractMethod<'evoluGetDelegatedIdentityKey', PROTO.EvoluGetDelegatedIdentityKey> {
    hasBundle?: boolean;
    init(): void;
    get info(): string;
    run(): Promise<{
        private_key: string;
    }>;
}
//# sourceMappingURL=evoluGetDelegatedIdentityKey.d.ts.map