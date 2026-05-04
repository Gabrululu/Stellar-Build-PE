import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class EvoluGetNode extends AbstractMethod<'evoluGetNode', PROTO.EvoluGetNode> {
    hasBundle?: boolean;
    init(): void;
    get info(): string;
    run(): Promise<{
        data: string;
    }>;
}
//# sourceMappingURL=evoluGetNode.d.ts.map