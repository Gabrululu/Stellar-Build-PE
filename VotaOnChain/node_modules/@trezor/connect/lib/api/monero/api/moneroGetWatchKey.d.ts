import { PROTO } from '../../../constants';
import { AbstractMethod } from '../../../core/AbstractMethod';
import type { MoneroWatchKey } from '../../../types/api/monero';
type Params = PROTO.MoneroGetWatchKey & {
    address?: string;
};
export default class MoneroGetWatchKeyMethod extends AbstractMethod<'moneroGetWatchKey', Params> {
    init(): void;
    get info(): string;
    run(): Promise<MoneroWatchKey>;
}
export {};
//# sourceMappingURL=moneroGetWatchKey.d.ts.map