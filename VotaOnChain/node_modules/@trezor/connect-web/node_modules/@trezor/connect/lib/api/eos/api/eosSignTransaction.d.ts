import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../../../core/AbstractMethod';
type Params = {
    path: number[];
    chain_id: string;
    header: PROTO.EosTxHeader;
    ack: PROTO.EosTxActionAck[];
    chunkify: boolean;
};
export default class EosSignTransaction extends AbstractMethod<'eosSignTransaction', Params> {
    init(): void;
    get info(): string;
    run(): Promise<{
        signature: string;
    }>;
}
export {};
//# sourceMappingURL=eosSignTransaction.d.ts.map