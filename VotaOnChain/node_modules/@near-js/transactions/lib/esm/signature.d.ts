import { KeyType } from '@near-js/crypto';
import { Enum } from '@near-js/types';
declare class ED25519Signature {
    keyType: KeyType;
    data: Uint8Array;
}
declare class SECP256K1Signature {
    keyType: KeyType;
    data: Uint8Array;
}
export declare class Signature extends Enum {
    enum: string;
    ed25519Signature?: ED25519Signature;
    secp256k1Signature?: SECP256K1Signature;
    constructor(signature: {
        keyType: KeyType;
        data: Uint8Array;
    });
    get signature(): ED25519Signature | SECP256K1Signature;
    get signatureType(): KeyType;
    get data(): Uint8Array;
}
export {};
//# sourceMappingURL=signature.d.ts.map