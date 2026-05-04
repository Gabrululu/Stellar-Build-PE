import { PROTO } from '../../../constants';
import { AbstractMethod } from '../../../core/AbstractMethod';
import { TronContractsParameters, TronContractsTypes } from '../../../types/api/tron';
type Params = {
    tx: PROTO.TronSignTx;
    contractType: TronContractsTypes;
    contract: TronContractsParameters;
};
export default class TronSignTransaction extends AbstractMethod<'tronSignTransaction', Params> {
    hasBundle?: boolean;
    progress: number;
    init(): void;
    get info(): string;
    run(): Promise<{
        signature: string;
    }>;
}
export {};
//# sourceMappingURL=tronSignTransaction.d.ts.map