"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signDelegateAction = exports.signTransaction = void 0;
const sha256_1 = require("@noble/hashes/sha256");
const actions_1 = require("./actions.cjs");
const create_transaction_1 = require("./create_transaction.cjs");
const schema_1 = require("./schema.cjs");
const signature_1 = require("./signature.cjs");
const crypto_1 = require("@near-js/crypto");
/**
 * Signs a given transaction from an account with given keys, applied to the given network
 * @param transaction The Transaction object to sign
 * @param signer The {Signer} object that assists with signing keys
 * @param accountId The human-readable NEAR account name
 * @param networkId The targeted network. (ex. default, betanet, etc…)
 */
async function signTransactionObject(transaction, signer, accountId, networkId) {
    const message = (0, schema_1.encodeTransaction)(transaction);
    const hash = new Uint8Array((0, sha256_1.sha256)(message));
    const signature = await signer.signMessage(message, accountId, networkId);
    const keyType = transaction.publicKey.ed25519Key ? crypto_1.KeyType.ED25519 : crypto_1.KeyType.SECP256K1;
    const signedTx = new schema_1.SignedTransaction({
        transaction,
        signature: new signature_1.Signature({ keyType, data: signature.signature })
    });
    return [hash, signedTx];
}
async function signTransaction(...args) {
    if (args[0].constructor === schema_1.Transaction) {
        const [transaction, signer, accountId, networkId] = args;
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
    else {
        const [receiverId, nonce, actions, blockHash, signer, accountId, networkId] = args;
        const publicKey = await signer.getPublicKey(accountId, networkId);
        const transaction = (0, create_transaction_1.createTransaction)(accountId, publicKey, receiverId, nonce, actions, blockHash);
        return signTransactionObject(transaction, signer, accountId, networkId);
    }
}
exports.signTransaction = signTransaction;
/**
 * Sign a delegate action
 * @options SignDelegate options
 * @param options.delegateAction Delegate action to be signed by the meta transaction sender
 * @param options.signer Signer instance for the meta transaction sender
 */
async function signDelegateAction({ delegateAction, signer }) {
    const message = (0, schema_1.encodeDelegateAction)(delegateAction);
    const signature = await signer.sign(message);
    const keyType = delegateAction.publicKey.ed25519Key ? crypto_1.KeyType.ED25519 : crypto_1.KeyType.SECP256K1;
    const signedDelegateAction = new actions_1.SignedDelegate({
        delegateAction,
        signature: new signature_1.Signature({
            keyType,
            data: signature,
        }),
    });
    return {
        hash: new Uint8Array((0, sha256_1.sha256)(message)),
        signedDelegateAction,
    };
}
exports.signDelegateAction = signDelegateAction;
