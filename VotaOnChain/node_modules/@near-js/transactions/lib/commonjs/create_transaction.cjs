"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTransaction = void 0;
const schema_1 = require("./schema.cjs");
/**
 * Creates a new transaction object with the provided parameters.
 * @param signerId The NEAR account ID of the transaction signer.
 * @param publicKey The public key associated with the signer.
 * @param receiverId The NEAR account ID of the transaction receiver.
 * @param nonce The nonce value for the transaction, represented as a BN, string, or number.
 * @param actions An array of transaction actions to be performed.
 * @param blockHash The hash of the block where the transaction will be included.
 * @returns A new transaction object initialized with the provided parameters.
 */
function createTransaction(signerId, publicKey, receiverId, nonce, actions, blockHash) {
    const txNonce = typeof nonce === 'bigint' ? nonce : BigInt(nonce);
    return new schema_1.Transaction({
        signerId,
        publicKey,
        nonce: txNonce,
        receiverId,
        actions,
        blockHash,
    });
}
exports.createTransaction = createTransaction;
