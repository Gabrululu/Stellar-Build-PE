import { Signer } from '@near-js/signers';
import { Provider } from '@near-js/providers';
import { IntoConnection } from './interface';
/**
 * Connects an account to a given network via a given provider
 */
export declare class Connection implements IntoConnection {
    readonly networkId: string;
    readonly provider: Provider;
    readonly signer: Signer;
    readonly jsvmAccountId: string;
    constructor(networkId: string, provider: Provider, signer: Signer, jsvmAccountId: string);
    getConnection(): Connection;
    /**
     * @param config Contains connection info details
     */
    static fromConfig(config: any): Connection;
}
//# sourceMappingURL=connection.d.ts.map