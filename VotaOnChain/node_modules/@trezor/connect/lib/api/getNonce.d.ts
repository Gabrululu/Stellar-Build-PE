import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class GetNonce extends AbstractMethod<'getNonce', PROTO.GetNonce> {
    init(): void;
    run(): Promise<{
        nonce: string;
    }>;
}
//# sourceMappingURL=getNonce.d.ts.map