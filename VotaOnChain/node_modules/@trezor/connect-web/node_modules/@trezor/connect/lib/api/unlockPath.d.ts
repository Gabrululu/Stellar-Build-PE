import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class UnlockPath extends AbstractMethod<'unlockPath', PROTO.UnlockPath> {
    init(): void;
    run(): Promise<{
        address_n: number[];
        mac: string;
    }>;
}
//# sourceMappingURL=unlockPath.d.ts.map