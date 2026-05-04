import { MessagesSchema as PROTO } from '@trezor/protobuf';
import { AbstractMethod } from '../core/AbstractMethod';
export default class RequestLogin extends AbstractMethod<'requestLogin', PROTO.SignIdentity> {
    init(): void;
    get info(): string;
    run(): Promise<{
        address: string;
        publicKey: string;
        signature: string;
    }>;
}
//# sourceMappingURL=requestLogin.d.ts.map