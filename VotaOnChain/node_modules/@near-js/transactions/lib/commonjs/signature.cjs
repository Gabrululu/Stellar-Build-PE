"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signature = void 0;
const crypto_1 = require("@near-js/crypto");
const types_1 = require("@near-js/types");
class ED25519Signature {
    keyType = crypto_1.KeyType.ED25519;
    data;
}
class SECP256K1Signature {
    keyType = crypto_1.KeyType.SECP256K1;
    data;
}
function resolveEnumKeyName(keyType) {
    switch (keyType) {
        case crypto_1.KeyType.ED25519: {
            return 'ed25519Signature';
        }
        case crypto_1.KeyType.SECP256K1: {
            return 'secp256k1Signature';
        }
        default: {
            throw Error(`unknown type ${keyType}`);
        }
    }
}
class Signature extends types_1.Enum {
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
exports.Signature = Signature;
