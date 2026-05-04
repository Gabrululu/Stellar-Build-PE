import { AbstractMethod } from '../core/AbstractMethod';
export default class ThpGetCredentials extends AbstractMethod<'thpGetCredentials'> {
    init(): void;
    run(): Promise<{
        autoconnect: boolean;
        trezor_static_public_key: string;
        credential: string;
    }>;
}
//# sourceMappingURL=thpGetCredentials.d.ts.map