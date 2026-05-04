"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const pushTransaction = async (client, payload) => {
  const res = await client.request('blockchain.transaction.broadcast', payload.hex);
  return res;
};
exports.default = pushTransaction;
//# sourceMappingURL=pushTransaction.js.map