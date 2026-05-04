import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class ChangePin extends AbstractMethod<'changePin', PROTO.ChangePin> {
    init(): void;
    run(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=changePin.d.ts.map