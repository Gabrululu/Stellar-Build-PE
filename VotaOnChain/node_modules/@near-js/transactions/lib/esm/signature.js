import { KeyType } from '@near-js/crypto';
import { Enum } from '@near-js/types';
class ED25519Signature {
    keyType = KeyType.ED25519;
    data;
}
class SECP256K1Signature {
    keyType = KeyType.SECP256K1;
    data;
}
function resolveEnumKeyName(keyType) {
    switch (keyType) {
        case KeyType.ED25519: {
            return 'ed25519Signature';
        }
        case KeyType.SECP256K1: {
            return 'secp256k1Signature';
        }
        default: {
            throw Error(`unknown type ${keyType}`);
        }
    }
}
export class Signature extends Enum {
    enum;
    ed25519Signature;
    secp256k1Signature;
    constructor(signature) {
        const keyName = resolveEnumKeyName(signature.keyType);
        super({ [keyName]: signature });
        this[keyName] = signature;
        this.enum = keyName;
    }
    get signature() {
        return this.ed25519Signature || this.secp256k1Signature;
    }
    get signatureType() {
        return this.signature.keyType;
    }
    get data() {
        return this.signature.data;
    }
}
