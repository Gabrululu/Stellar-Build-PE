import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class SetBusy extends AbstractMethod<'setBusy', PROTO.SetBusy> {
    init(): void;
    run(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=setBusy.d.ts.map