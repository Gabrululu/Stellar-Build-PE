import { AbstractMethod } from '../core/AbstractMethod';
import type { CoinInfo } from '../types';
import { PushTransaction as PushTransactionSchema } from '../types/api/pushTransaction';
type Params = {
    tx: PushTransactionSchema['tx'];
    coinInfo: CoinInfo;
    identity?: string;
};
export default class PushTransaction extends AbstractMethod<'pushTransaction', Params> {
    init(): void;
    run(): Promise<{
        txid: string;
    }>;
}
export {};
//# sourceMappingURL=pushTransaction.d.ts.map