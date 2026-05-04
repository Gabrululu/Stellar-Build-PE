"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SCHEMA = exports.SignedTransaction = exports.Transaction = exports.decodeSignedTransaction = exports.decodeTransaction = exports.encodeTransaction = exports.encodeSignedDelegate = exports.encodeDelegateAction = void 0;
const borsh_1 = require("borsh");
const prefix_1 = require("./prefix.cjs");
/**
 * Borsh-encode a delegate action for inclusion as an action within a meta transaction
 * NB per NEP-461 this requires a Borsh-serialized prefix specific to delegate actions, ensuring
 *  signed delegate actions may never be identical to signed transactions with the same fields
 * @param delegateAction Delegate action to be signed by the meta transaction sender
 */
function encodeDelegateAction(delegateAction) {
    return new Uint8Array([
        ...(0, borsh_1.serialize)(exports.SCHEMA.DelegateActionPrefix, new prefix_1.DelegateActionPrefix()),
        ...(0, borsh_1.serialize)(exports.SCHEMA.DelegateAction, delegateAction),
    ]);
}
exports.encodeDelegateAction = encodeDelegateAction;
/**
 * Borsh-encode a signed delegate for validation and execution by a relayer
 * @param signedDelegate Signed delegate to be executed in a meta transaction
 */
function encodeSignedDelegate(signedDelegate) {
    return (0, borsh_1.serialize)(exports.SCHEMA.SignedDelegate, signedDelegate);
}
exports.encodeSignedDelegate = encodeSignedDelegate;
/**
 * Borsh-encode a transaction or signed transaction into a serialized form.
 * @param transaction The transaction or signed transaction object to be encoded.
 * @returns A serialized representation of the input transaction.
 */
function encodeTransaction(transaction) {
    const schema = transaction instanceof SignedTransaction ? exports.SCHEMA.SignedTransaction : exports.SCHEMA.Transaction;
    return (0, borsh_1.serialize)(schema, transaction);
}
exports.encodeTransaction = encodeTransaction;
/**
 * Borsh-decode a Transaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
function decodeTransaction(bytes) {
    return new Transaction((0, borsh_1.deserialize)(exports.SCHEMA.Transaction, bytes));
}
exports.decodeTransaction = decodeTransaction;
/**
 * Borsh-decode a SignedTransaction instance from a buffer
 * @param bytes Uint8Array data to be decoded
 */
function decodeSignedTransaction(bytes) {
    return new SignedTransaction((0, borsh_1.deserialize)(exports.SCHEMA.SignedTransaction, bytes));
}
exports.decodeSignedTransaction = decodeSignedTransaction;
class Transaction {
    signerId;
    publicKey;
    nonce;
    receiverId;
    actions;
    blockHash;
    constructor({ signerId, publicKey, nonce, receiverId, actions, blockHash }) {
        this.signerId = signerId;
        this.publicKey = publicKey;
        this.nonce = nonce;
        this.receiverId = receiverId;
        this.actions = actions;
        this.blockHash = blockHash;
    }
    encode() {
        return encodeTransaction(this);
    }
    static decode(bytes) {
        return decodeTransaction(bytes);
    }
}
exports.Transaction = Transaction;
class SignedTransaction {
    transaction;
    signature;
    constructor({ transaction, signature }) {
        this.transaction = transaction;
        this.signature = signature;
    }
    encode() {
        return encodeTransaction(this);
    }
    static decode(bytes) {
        return decodeSignedTransaction(bytes);
    }
}
exports.SignedTransaction = SignedTransaction;
exports.SCHEMA = new class BorshSchema {
    Ed25519Signature = {
        struct: {
            data: { array: { type: 'u8', len: 64 } },
        }
    };
    Secp256k1Signature = {
        struct: {
            data: { array: { type: 'u8', len: 65 } },
        }
    };
    Signature = {
        enum: [
            { struct: { ed25519Signature: this.Ed25519Signature } },
            { struct: { secp256k1Signature: this.Secp256k1Signature } },
        ]
    };
    Ed25519Data = {
        struct: {
            data: { array: { type: 'u8', len: 32 } },
        }
    };
    Secp256k1Data = {
        struct: {
            data: { array: { type: 'u8', len: 64 } },
        }
    };
    PublicKey = {
        enum: [
            { struct: { ed25519Key: this.Ed25519Data } },
            { struct: { secp256k1Key: this.Secp256k1Data } },
        ]
    };
    FunctionCallPermission = {
        struct: {
            allowance: { option: 'u128' },
            receiverId: 'string',
            methodNames: { array: { type: 'string' } },
        }
    };
    FullAccessPermission = {
        struct: {}
    };
    AccessKeyPermission = {
        enum: [
            { struct: { functionCall: this.FunctionCallPermission } },
            { struct: { fullAccess: this.FullAccessPermission } },
        ]
    };
    AccessKey = {
        struct: {
            nonce: 'u64',
            permission: this.AccessKeyPermission,
        }
    };
    CreateAccount = {
        struct: {}
    };
    DeployContract = {
        struct: {
            code: { array: { type: 'u8' } },
        }
    };
    FunctionCall = {
        struct: {
            methodName: 'string',
            args: { array: { type: 'u8' } },
            gas: 'u64',
            deposit: 'u128',
        }
    };
    Transfer = {
        struct: {
            deposit: 'u128',
        }
    };
    Stake = {
        struct: {
            stake: 'u128',
            publicKey: this.PublicKey,
        }
    };
    AddKey = {
        struct: {
            publicKey: this.PublicKey,
            accessKey: this.AccessKey,
        }
    };
    DeleteKey = {
        struct: {
            publicKey: this.PublicKey,
        }
    };
    DeleteAccount = {
        struct: {
            beneficiaryId: 'string',
        }
    };
    DelegateActionPrefix = {
        struct: {
            prefix: 'u32',
        }
    };
    ClassicActions = {
        enum: [
            { struct: { createAccount: this.CreateAccount } },
            { struct: { deployContract: this.DeployContract } },
            { struct: { functionCall: this.FunctionCall } },
            { struct: { transfer: this.Transfer } },
            { struct: { stake: this.Stake } },
            { struct: { addKey: this.AddKey } },
            { struct: { deleteKey: this.DeleteKey } },
            { struct: { deleteAccount: this.DeleteAccount } },
        ]
    };
    DelegateAction = {
        struct: {
            senderId: 'string',
            receiverId: 'string',
            actions: { array: { type: this.ClassicActions } },
            nonce: 'u64',
            maxBlockHeight: 'u64',
            publicKey: this.PublicKey,
        }
    };
    SignedDelegate = {
        struct: {
            delegateAction: this.DelegateAction,
            signature: this.Signature,
        }
    };
    Action = {
        enum: [
            { struct: { createAccount: this.CreateAccount } },
            { struct: { deployContract: this.DeployContract } },
            { struct: { functionCall: this.FunctionCall } },
            { struct: { transfer: this.Transfer } },
            { struct: { stake: this.Stake } },
            { struct: { addKey: this.AddKey } },
            { struct: { deleteKey: this.DeleteKey } },
            { struct: { deleteAccount: this.DeleteAccount } },
            { struct: { signedDelegate: this.SignedDelegate } },
        ]
    };
    Transaction = {
        struct: {
            signerId: 'string',
            publicKey: this.PublicKey,
            nonce: 'u64',
            receiverId: 'string',
            blockHash: { array: { type: 'u8', len: 32 } },
            actions: { array: { type: this.Action } },
        }
    };
    SignedTransaction = {
        struct: {
            transaction: this.Transaction,
            signature: this.Signature,
        }
    };
};
