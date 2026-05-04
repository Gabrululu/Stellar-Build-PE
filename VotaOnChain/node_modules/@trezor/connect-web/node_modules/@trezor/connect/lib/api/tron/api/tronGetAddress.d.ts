import { PROTO } from '../../../constants';
import { AbstractMethod } from '../../../core/AbstractMethod';
type Params = PROTO.TronGetAddress & {
    address?: string;
};
export default class TronGetAddress extends AbstractMethod<'tronGetAddress', Params[]> {
    hasBundle?: boolean;
    progress: number;
    init(): void;
    get info(): "Export Tron address" | "Export multiple Tron addresses";
    getButtonRequestData(code: string): {
        type: "address";
        serializedPath: string;
        address: string;
    } | undefined;
    get confirmation(): {
        view: "export-address";
        label: string;
    };
    _call({ address_n, show_display, chunkify }: Params): Promise<{
        mac?: string | undefined;
        address: string;
    }>;
    run(): Promise<import("../../../types").Address | import("../../../types").Address[]>;
}
export {};
//# sourceMappingURL=tronGetAddress.d.ts.map