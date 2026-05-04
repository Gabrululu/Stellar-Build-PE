import { PROTO } from '../../../constants';
import { AbstractMethod } from '../../../core/AbstractMethod';
import { Address } from '../../../types/params';
type Params = PROTO.MoneroGetAddress & {
    address?: string;
};
export default class MoneroGetAddress extends AbstractMethod<'moneroGetAddress', Params[]> {
    hasBundle?: boolean;
    progress: number;
    init(): void;
    get info(): string;
    getButtonRequestData(code: string): {
        type: "address";
        serializedPath: string;
        address: string;
    } | undefined;
    get confirmation(): {
        view: "export-address";
        label: string;
    };
    _call({ address_n, show_display, network_type, account, minor, payment_id, chunkify, }: Params): Promise<{
        address: string;
    }>;
    run(): Promise<Address | Address[]>;
}
export {};
//# sourceMappingURL=moneroGetAddress.d.ts.map