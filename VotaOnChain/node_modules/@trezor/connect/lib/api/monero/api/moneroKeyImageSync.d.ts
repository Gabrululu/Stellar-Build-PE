import { PROTO } from '../../../constants';
import { AbstractMethod } from '../../../core/AbstractMethod';
import type { MoneroKeyImageSyncResult } from '../../../types/api/monero';
type Params = {
    address_n: number[];
    network_type: PROTO.MoneroNetworkType;
    subs: PROTO.MoneroSubAddressIndicesList[];
    tdis: PROTO.MoneroTransferDetails[];
};
export default class MoneroKeyImageSyncMethod extends AbstractMethod<'moneroKeyImageSync', Params> {
    init(): void;
    get info(): string;
    run(): Promise<MoneroKeyImageSyncResult>;
}
export {};
//# sourceMappingURL=moneroKeyImageSync.d.ts.map