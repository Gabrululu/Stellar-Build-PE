"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../../../core/AbstractMethod");
const tron_1 = require("../../../types/api/tron");
const pathUtils_1 = require("../../../utils/pathUtils");
class TronSignTransaction extends AbstractMethod_1.AbstractMethod {
  hasBundle;
  progress = 0;
  init() {
    this.requiredPermissions = ['read', 'write'];
    this.requiredDeviceCapabilities = ['Capability_Tron'];
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(tron_1.TronSignTransaction, payload);
    const path = (0, pathUtils_1.validatePath)(payload.path, 3);
    this.params = {
      tx: {
        address_n: path,
        ref_block_bytes: payload.ref_block_bytes,
        ref_block_hash: payload.ref_block_hash,
        expiration: payload.expiration,
        timestamp: payload.timestamp,
        fee_limit: payload.fee_limit,
        data: payload.data
      },
      contractType: payload.contract[0].type,
      contract: payload.contract[0].parameter.value
    };
  }
  get info() {
    return 'Sign Tron transaction';
  }
  async run() {
    const cmd = this.device.getCommands();
    await cmd.typedCall('TronSignTx', 'TronContractRequest', this.params.tx);
    const contractMapping = {
      TransferContract: 'TronTransferContract',
      TriggerSmartContract: 'TronTriggerSmartContract',
      FreezeBalanceV2Contract: 'TronFreezeBalanceV2Contract',
      UnfreezeBalanceV2Contract: 'TronUnfreezeBalanceV2Contract',
      WithdrawExpireUnfreezeContract: 'TronWithdrawUnfreeze'
    };
    const {
      message
    } = await cmd.typedCall(contractMapping[this.params.contractType], 'TronSignature', this.params.contract);
    return {
      signature: message.signature
    };
  }
}
exports.default = TronSignTransaction;
//# sourceMappingURL=tronSignTransaction.js.map