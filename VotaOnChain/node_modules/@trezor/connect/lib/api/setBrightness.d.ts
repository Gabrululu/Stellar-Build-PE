import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class SetBrightness extends AbstractMethod<'setBrightness', PROTO.SetBrightness> {
    init(): void;
    run(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=setBrightness.d.ts.map