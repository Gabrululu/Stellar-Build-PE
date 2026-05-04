import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class AuthorizeCoinjoin extends AbstractMethod<'authorizeCoinjoin', PROTO.AuthorizeCoinJoin> {
    init(): void;
    run(): Promise<{
        message: string;
    }>;
}
//# sourceMappingURL=authorizeCoinjoin.d.ts.map