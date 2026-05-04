import { PROTO } from '../../../constants';
import { AbstractMethod, MethodReturnType } from '../../../core/AbstractMethod';
type Params = {
    address_n: number[];
    network_type: PROTO.MoneroNetworkType;
    tsx_data: PROTO.MoneroTransactionData;
    inputs: PROTO.MoneroTransactionSourceEntry[];
};
export default class MoneroSignTransactionMethod extends AbstractMethod<'moneroSignTransaction', Params> {
    private state;
    init(): void;
    get info(): string;
    run(): Promise<MethodReturnType<typeof this.name>>;
}
export {};
//# sourceMappingURL=moneroSignTransaction.d.ts.map