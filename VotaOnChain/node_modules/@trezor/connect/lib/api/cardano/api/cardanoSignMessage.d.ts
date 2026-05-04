import { PROTO } from '../../../constants';
import { AbstractMethod } from '../../../core/AbstractMethod';
import { CardanoMessageHeaders, CardanoSignedMessage } from '../../../types/api/cardano';
import { Path } from '../cardanoInputs';
export type CardanoSignMessageParams = {
    path: Path;
    payload: string;
    preferHexDisplay: boolean;
    networkId?: number;
    protocolMagic?: number;
    addressParameters?: PROTO.CardanoAddressParametersType;
    derivationType: PROTO.CardanoDerivationType;
};
export default class CardanoSignMessage extends AbstractMethod<'cardanoSignMessage', CardanoSignMessageParams> {
    static readonly VERSION = 1;
    init(): void;
    run(): Promise<CardanoSignedMessage>;
    _createHeaders(address: string): CardanoMessageHeaders;
    _createCose(payload: string, signature: string, address: string, pubKey: string): {
        coseSignature: string;
        coseKey: string;
    };
    get info(): string;
}
//# sourceMappingURL=cardanoSignMessage.d.ts.map