import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../../../core/AbstractMethod';
export default class EthereumVerifyMessage extends AbstractMethod<'ethereumVerifyMessage', PROTO.EthereumVerifyMessage> {
    init(): void;
    get info(): string;
    run(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=ethereumVerifyMessage.d.ts.map