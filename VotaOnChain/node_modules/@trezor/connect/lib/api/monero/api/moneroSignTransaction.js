"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const constants_1 = require("../../../constants");
const AbstractMethod_1 = require("../../../core/AbstractMethod");
const coinInfo_1 = require("../../../data/coinInfo");
const pathUtils_1 = require("../../../utils/pathUtils");
const paramsValidator_1 = require("../../common/paramsValidator");
class MoneroSignTransactionMethod extends AbstractMethod_1.AbstractMethod {
  state = {
    hmacs: [],
    vinis: [],
    signatures: [],
    pseudo_outs: [],
    out_pks: [],
    ecdh_infos: [],
    tx_outs: [],
    rsig_parts: []
  };
  init() {
    this.requiredPermissions = ['read', 'write'];
    this.requiredDeviceCapabilities = ['Capability_Monero'];
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, (0, coinInfo_1.getMiscNetwork)('Monero'), this.firmwareRange);
    const {
      payload
    } = this;
    const path = (0, pathUtils_1.validatePath)(payload.path, 3);
    const allHardened = path.every(component => (component & pathUtils_1.HD_HARDENED) !== 0);
    if (!allHardened) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', `Monero requires all path components to be hardened. Use m/44'/128'/0' format.`);
    }
    if (payload.inputs.length < 1) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', 'At least one input is required');
    }
    if (payload.tsx_data.outputs.length < 2) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', 'At least 2 outputs are required');
    }
    const rsigData = payload.tsx_data.rsig_data;
    if (rsigData.grouping.length < 1) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', 'Missing required fields in rsig_data');
    }
    if (payload.inputs.length !== payload.tsx_data.num_inputs) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', 'Number of inputs does not match tsx_data.num_inputs');
    }
    const transformedTsxData = {};
    transformedTsxData.num_inputs = payload.tsx_data.num_inputs;
    transformedTsxData.mixin = payload.tsx_data.mixin;
    transformedTsxData.fee = payload.tsx_data.fee;
    transformedTsxData.account = payload.tsx_data.account;
    transformedTsxData.hard_fork = payload.tsx_data.hard_fork;
    transformedTsxData.unlock_time = payload.tsx_data.unlock_time;
    transformedTsxData.minor_indices = payload.tsx_data.minor_indices || [];
    transformedTsxData.integrated_indices = payload.tsx_data.integrated_indices || [];
    transformedTsxData.outputs = payload.tsx_data.outputs;
    transformedTsxData.client_version = 3;
    transformedTsxData.version = 1;
    if (payload.tsx_data.payment_id !== undefined && payload.tsx_data.payment_id !== '') {
      transformedTsxData.payment_id = payload.tsx_data.payment_id;
    }
    if (payload.tsx_data.monero_version !== undefined && payload.tsx_data.monero_version !== '') {
      transformedTsxData.monero_version = payload.tsx_data.monero_version;
    }
    if (payload.tsx_data.chunkify !== undefined) {
      transformedTsxData.chunkify = payload.tsx_data.chunkify;
    }
    if (payload.tsx_data.change_dts) {
      transformedTsxData.change_dts = payload.tsx_data.change_dts;
    }
    transformedTsxData.rsig_data = {
      rsig_type: rsigData.rsig_type,
      bp_version: rsigData.bp_version,
      grouping: rsigData.grouping,
      rsig_parts: rsigData.rsig_parts || []
    };
    if (rsigData.offload_type !== undefined) {
      transformedTsxData.rsig_data.offload_type = rsigData.offload_type;
    }
    if (rsigData.mask !== undefined && rsigData.mask !== '') {
      transformedTsxData.rsig_data.mask = rsigData.mask;
    }
    if (rsigData.rsig !== undefined && rsigData.rsig !== '') {
      transformedTsxData.rsig_data.rsig = rsigData.rsig;
    }
    const transformedInputs = payload.inputs.map(input => {
      const transformedInput = {};
      transformedInput.amount = input.amount;
      transformedInput.real_output = input.real_output;
      transformedInput.real_output_in_tx_index = input.real_output_in_tx_index;
      transformedInput.rct = input.rct;
      transformedInput.subaddr_minor = input.subaddr_minor;
      transformedInput.real_out_tx_key = input.real_out_tx_key;
      transformedInput.real_out_additional_tx_keys = input.real_out_additional_tx_keys || [];
      transformedInput.outputs = input.outputs;
      transformedInput.mask = input.mask;
      if (input.multisig_kLRki) {
        transformedInput.multisig_kLRki = input.multisig_kLRki;
      }
      return transformedInput;
    });
    this.params = {
      address_n: path,
      network_type: payload.networkType,
      tsx_data: transformedTsxData,
      inputs: transformedInputs
    };
  }
  get info() {
    return 'Sign Monero transaction';
  }
  async run() {
    const initResponse = await this.device.getCommands().typedCall('MoneroTransactionInitRequest', 'MoneroTransactionInitAck', {
      version: 0,
      address_n: this.params.address_n,
      network_type: this.params.network_type,
      tsx_data: this.params.tsx_data
    });
    this.state.hmacs = initResponse.message.hmacs;
    for (let i = 0; i < this.params.inputs.length; i++) {
      const setInputResponse = await this.device.getCommands().typedCall('MoneroTransactionSetInputRequest', 'MoneroTransactionSetInputAck', {
        src_entr: this.params.inputs[i]
      });
      this.state.vinis.push({
        vini: setInputResponse.message.vini,
        vini_hmac: setInputResponse.message.vini_hmac,
        pseudo_out: setInputResponse.message.pseudo_out,
        pseudo_out_hmac: setInputResponse.message.pseudo_out_hmac,
        pseudo_out_alpha: setInputResponse.message.pseudo_out_alpha,
        spend_key: setInputResponse.message.spend_key,
        src_entr: this.params.inputs[i],
        orig_idx: i
      });
    }
    for (let i = 0; i < this.state.vinis.length; i++) {
      const viniData = this.state.vinis[i];
      await this.device.getCommands().typedCall('MoneroTransactionInputViniRequest', 'MoneroTransactionInputViniAck', {
        src_entr: viniData.src_entr,
        vini: viniData.vini,
        vini_hmac: viniData.vini_hmac,
        pseudo_out: viniData.pseudo_out,
        pseudo_out_hmac: viniData.pseudo_out_hmac,
        orig_idx: viniData.orig_idx
      });
    }
    await this.device.getCommands().typedCall('MoneroTransactionAllInputsSetRequest', 'MoneroTransactionAllInputsSetAck', {});
    const outputs = this.params.tsx_data.outputs || [];
    for (let i = 0; i < outputs.length; i++) {
      const setOutputResponse = await this.device.getCommands().typedCall('MoneroTransactionSetOutputRequest', 'MoneroTransactionSetOutputAck', {
        dst_entr: outputs[i],
        dst_entr_hmac: this.state.hmacs[i]
      });
      if (setOutputResponse.message.out_pk) {
        this.state.out_pks.push(setOutputResponse.message.out_pk);
      }
      if (setOutputResponse.message.ecdh_info) {
        this.state.ecdh_infos.push(setOutputResponse.message.ecdh_info);
      }
      if (setOutputResponse.message.tx_out) {
        this.state.tx_outs.push(setOutputResponse.message.tx_out);
      }
      if (setOutputResponse.message.rsig_data?.rsig) {
        this.state.rsig_parts.push(setOutputResponse.message.rsig_data.rsig);
      }
    }
    const allOutSetResponse = await this.device.getCommands().typedCall('MoneroTransactionAllOutSetRequest', 'MoneroTransactionAllOutSetAck', {});
    this.state.tx_prefix_hash = allOutSetResponse.message.tx_prefix_hash;
    this.state.rv = allOutSetResponse.message.rv;
    this.state.extra = allOutSetResponse.message.extra;
    for (let i = 0; i < this.state.vinis.length; i++) {
      const viniData = this.state.vinis[i];
      const signResponse = await this.device.getCommands().typedCall('MoneroTransactionSignInputRequest', 'MoneroTransactionSignInputAck', {
        src_entr: viniData.src_entr,
        vini: viniData.vini,
        vini_hmac: viniData.vini_hmac,
        pseudo_out: viniData.pseudo_out,
        pseudo_out_hmac: viniData.pseudo_out_hmac,
        pseudo_out_alpha: viniData.pseudo_out_alpha,
        spend_key: viniData.spend_key,
        orig_idx: viniData.orig_idx
      });
      this.state.signatures.push(signResponse.message.signature);
      if (signResponse.message.pseudo_out) {
        this.state.pseudo_outs.push(signResponse.message.pseudo_out);
      }
    }
    const finalResponse = await this.device.getCommands().typedCall('MoneroTransactionFinalRequest', 'MoneroTransactionFinalAck', {});
    return {
      signatures: this.state.signatures,
      tx_prefix_hash: this.state.tx_prefix_hash,
      rv: this.state.rv,
      cout_key: finalResponse.message.cout_key,
      salt: finalResponse.message.salt,
      rand_mult: finalResponse.message.rand_mult,
      tx_enc_keys: finalResponse.message.tx_enc_keys,
      opening_key: finalResponse.message.opening_key,
      pseudo_outs: this.state.pseudo_outs,
      out_pks: this.state.out_pks,
      ecdh_infos: this.state.ecdh_infos,
      tx_outs: this.state.tx_outs,
      rsig_parts: this.state.rsig_parts,
      extra: this.state.extra
    };
  }
}
exports.default = MoneroSignTransactionMethod;
//# sourceMappingURL=moneroSignTransaction.js.map