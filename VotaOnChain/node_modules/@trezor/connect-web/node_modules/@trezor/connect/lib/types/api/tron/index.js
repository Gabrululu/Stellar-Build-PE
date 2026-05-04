"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TronSignedTx = exports.TronSignTransaction = exports.TronContracts = void 0;
const schema_utils_1 = require("@trezor/schema-utils");
const constants_1 = require("../../../constants");
const params_1 = require("../../params");
const TronTransferContract = schema_utils_1.Type.Object({
  type: schema_utils_1.Type.Literal('TransferContract'),
  parameter: schema_utils_1.Type.Object({
    value: constants_1.PROTO.TronTransferContract
  })
});
const TronTriggerSmartContract = schema_utils_1.Type.Object({
  type: schema_utils_1.Type.Literal('TriggerSmartContract'),
  parameter: schema_utils_1.Type.Object({
    value: constants_1.PROTO.TronTriggerSmartContract
  })
});
const TronFreezeBalanceV2Contract = schema_utils_1.Type.Object({
  type: schema_utils_1.Type.Literal('FreezeBalanceV2Contract'),
  parameter: schema_utils_1.Type.Object({
    value: constants_1.PROTO.TronFreezeBalanceV2Contract
  })
});
const TronUnfreezeBalanceV2Contract = schema_utils_1.Type.Object({
  type: schema_utils_1.Type.Literal('UnfreezeBalanceV2Contract'),
  parameter: schema_utils_1.Type.Object({
    value: constants_1.PROTO.TronUnfreezeBalanceV2Contract
  })
});
const TronWithdrawExpireUnfreezeContract = schema_utils_1.Type.Object({
  type: schema_utils_1.Type.Literal('WithdrawExpireUnfreezeContract'),
  parameter: schema_utils_1.Type.Object({
    value: constants_1.PROTO.TronWithdrawUnfreeze
  })
});
exports.TronContracts = schema_utils_1.Type.Union([TronTransferContract, TronTriggerSmartContract, TronFreezeBalanceV2Contract, TronUnfreezeBalanceV2Contract, TronWithdrawExpireUnfreezeContract]);
exports.TronSignTransaction = schema_utils_1.Type.Object({
  path: params_1.DerivationPath,
  ref_block_bytes: schema_utils_1.Type.String(),
  ref_block_hash: schema_utils_1.Type.String(),
  expiration: schema_utils_1.Type.Number(),
  timestamp: schema_utils_1.Type.Number(),
  fee_limit: schema_utils_1.Type.Optional(schema_utils_1.Type.Number()),
  data: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  contract: schema_utils_1.Type.Array(exports.TronContracts, {
    length: 1
  })
});
exports.TronSignedTx = schema_utils_1.Type.Object({
  signature: schema_utils_1.Type.String()
});
//# sourceMappingURL=index.js.map