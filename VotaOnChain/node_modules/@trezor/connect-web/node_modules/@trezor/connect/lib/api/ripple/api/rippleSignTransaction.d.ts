import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../../../core/AbstractMethod';
export default class RippleSignTransaction extends AbstractMethod<'rippleSignTransaction', PROTO.RippleSignTx> {
    init(): void;
    get info(): string;
    run(): Promise<{
        serializedTx: string;
        signature: string;
    }>;
}
//# sourceMappingURL=rippleSignTransaction.d.ts.map