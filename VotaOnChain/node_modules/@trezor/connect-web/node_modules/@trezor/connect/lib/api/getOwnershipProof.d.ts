import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class GetOwnershipProof extends AbstractMethod<'getOwnershipProof', PROTO.GetOwnershipProof[]> {
    hasBundle?: boolean;
    init(): void;
    get info(): string;
    get confirmation(): {
        view: "export-address";
        label: string;
    };
    run(): Promise<import("../types/api/getOwnershipProof").OwnershipProof | import("../types/api/getOwnershipProof").OwnershipProof[]>;
}
//# sourceMappingURL=getOwnershipProof.d.ts.map