import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class EvoluSignRegistrationRequest extends AbstractMethod<'evoluSignRegistrationRequest', PROTO.EvoluSignRegistrationRequest> {
    hasBundle?: boolean;
    init(): void;
    get info(): string;
    run(): Promise<{
        signature: string;
        certificate_chain: string[];
    }>;
}
//# sourceMappingURL=evoluSignRegistrationRequest.d.ts.map