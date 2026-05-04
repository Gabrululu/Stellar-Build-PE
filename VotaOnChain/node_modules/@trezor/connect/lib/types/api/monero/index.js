"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.MoneroSignedTransaction = exports.MoneroRingCtSig = exports.MoneroSignTransaction = exports.MoneroTransactionData = exports.MoneroTransactionRsigData = exports.MoneroTransactionDestinationEntry = exports.MoneroAccountPublicAddress = exports.MoneroTransactionSourceEntry = exports.MoneroMultisigKLRki = exports.MoneroOutputEntry = exports.MoneroKeyImageSyncResult = exports.MoneroExportedKeyImage = exports.MoneroKeyImageSync = exports.MoneroSubAddressIndicesList = exports.MoneroTransferDetails = exports.MoneroWatchKey = exports.MoneroGetWatchKey = exports.MoneroGetAddress = void 0;
const schema_utils_1 = require("@trezor/schema-utils");
const constants_1 = require("../../../constants");
const params_1 = require("../../params");
exports.MoneroGetAddress = schema_utils_1.Type.Object({
  path: params_1.DerivationPath,
  address: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  showOnTrezor: schema_utils_1.Type.Optional(schema_utils_1.Type.Boolean()),
  networkType: schema_utils_1.Type.Optional(constants_1.PROTO.EnumMoneroNetworkType),
  account: schema_utils_1.Type.Optional(schema_utils_1.Type.Number()),
  minor: schema_utils_1.Type.Optional(schema_utils_1.Type.Number()),
  paymentId: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  chunkify: schema_utils_1.Type.Optional(schema_utils_1.Type.Boolean())
}, {
  $id: 'MoneroGetAddress'
});
exports.MoneroGetWatchKey = schema_utils_1.Type.Object({
  path: params_1.DerivationPath,
  networkType: schema_utils_1.Type.Optional(constants_1.PROTO.EnumMoneroNetworkType)
}, {
  $id: 'MoneroGetWatchKey'
});
exports.MoneroWatchKey = schema_utils_1.Type.Object({
  watch_key: schema_utils_1.Type.String(),
  address: schema_utils_1.Type.String()
}, {
  $id: 'MoneroWatchKey'
});
exports.MoneroTransferDetails = schema_utils_1.Type.Object({
  out_key: schema_utils_1.Type.String(),
  tx_pub_key: schema_utils_1.Type.String(),
  additional_tx_pub_keys: schema_utils_1.Type.Optional(schema_utils_1.Type.Union([schema_utils_1.Type.Array(schema_utils_1.Type.String()), schema_utils_1.Type.String()])),
  internal_output_index: schema_utils_1.Type.Number(),
  sub_addr_major: schema_utils_1.Type.Optional(schema_utils_1.Type.Number()),
  sub_addr_minor: schema_utils_1.Type.Optional(schema_utils_1.Type.Number())
}, {
  $id: 'MoneroTransferDetails'
});
exports.MoneroSubAddressIndicesList = schema_utils_1.Type.Object({
  account: schema_utils_1.Type.Number(),
  minor_indices: schema_utils_1.Type.Array(schema_utils_1.Type.Number())
}, {
  $id: 'MoneroSubAddressIndicesList'
});
exports.MoneroKeyImageSync = schema_utils_1.Type.Object({
  path: params_1.DerivationPath,
  networkType: schema_utils_1.Type.Optional(constants_1.PROTO.EnumMoneroNetworkType),
  subs: schema_utils_1.Type.Optional(schema_utils_1.Type.Array(exports.MoneroSubAddressIndicesList)),
  tdis: schema_utils_1.Type.Array(exports.MoneroTransferDetails)
}, {
  $id: 'MoneroKeyImageSync'
});
exports.MoneroExportedKeyImage = schema_utils_1.Type.Object({
  iv: schema_utils_1.Type.String(),
  key_image: schema_utils_1.Type.String()
}, {
  $id: 'MoneroExportedKeyImage'
});
exports.MoneroKeyImageSyncResult = schema_utils_1.Type.Object({
  key_images: schema_utils_1.Type.Array(exports.MoneroExportedKeyImage),
  signature: schema_utils_1.Type.String()
}, {
  $id: 'MoneroKeyImageSyncResult'
});
exports.MoneroOutputEntry = schema_utils_1.Type.Object({
  idx: schema_utils_1.Type.Number(),
  key: schema_utils_1.Type.Object({
    dest: schema_utils_1.Type.String(),
    commitment: schema_utils_1.Type.String()
  })
}, {
  $id: 'MoneroOutputEntry'
});
exports.MoneroMultisigKLRki = schema_utils_1.Type.Object({
  K: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  L: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  R: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  ki: schema_utils_1.Type.Optional(schema_utils_1.Type.String())
}, {
  $id: 'MoneroMultisigKLRki'
});
exports.MoneroTransactionSourceEntry = schema_utils_1.Type.Object({
  outputs: schema_utils_1.Type.Array(exports.MoneroOutputEntry),
  real_output: schema_utils_1.Type.Number(),
  real_out_tx_key: schema_utils_1.Type.String(),
  real_out_additional_tx_keys: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  real_output_in_tx_index: schema_utils_1.Type.Number(),
  amount: schema_utils_1.Type.Number(),
  rct: schema_utils_1.Type.Boolean(),
  mask: schema_utils_1.Type.String(),
  subaddr_minor: schema_utils_1.Type.Number(),
  multisig_kLRki: schema_utils_1.Type.Optional(exports.MoneroMultisigKLRki)
}, {
  $id: 'MoneroTransactionSourceEntry'
});
exports.MoneroAccountPublicAddress = schema_utils_1.Type.Object({
  spend_public_key: schema_utils_1.Type.String(),
  view_public_key: schema_utils_1.Type.String()
});
exports.MoneroTransactionDestinationEntry = schema_utils_1.Type.Object({
  amount: schema_utils_1.Type.Number(),
  addr: exports.MoneroAccountPublicAddress,
  is_subaddress: schema_utils_1.Type.Boolean(),
  original: schema_utils_1.Type.String(),
  is_integrated: schema_utils_1.Type.Boolean()
}, {
  $id: 'MoneroTransactionDestinationEntry'
});
exports.MoneroTransactionRsigData = schema_utils_1.Type.Object({
  rsig_type: schema_utils_1.Type.Number(),
  offload_type: schema_utils_1.Type.Optional(schema_utils_1.Type.Number()),
  grouping: schema_utils_1.Type.Array(schema_utils_1.Type.Number()),
  mask: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  rsig: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  rsig_parts: schema_utils_1.Type.Optional(schema_utils_1.Type.Array(schema_utils_1.Type.String())),
  bp_version: schema_utils_1.Type.Number()
}, {
  $id: 'MoneroTransactionRsigData'
});
exports.MoneroTransactionData = schema_utils_1.Type.Object({
  version: schema_utils_1.Type.Number(),
  payment_id: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  unlock_time: schema_utils_1.Type.Number(),
  outputs: schema_utils_1.Type.Array(exports.MoneroTransactionDestinationEntry),
  change_dts: schema_utils_1.Type.Optional(exports.MoneroTransactionDestinationEntry),
  num_inputs: schema_utils_1.Type.Number(),
  mixin: schema_utils_1.Type.Number(),
  fee: schema_utils_1.Type.Number(),
  account: schema_utils_1.Type.Number(),
  rsig_data: exports.MoneroTransactionRsigData,
  minor_indices: schema_utils_1.Type.Optional(schema_utils_1.Type.Array(schema_utils_1.Type.Number())),
  integrated_indices: schema_utils_1.Type.Optional(schema_utils_1.Type.Array(schema_utils_1.Type.Number())),
  client_version: schema_utils_1.Type.Number(),
  hard_fork: schema_utils_1.Type.Number(),
  monero_version: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  chunkify: schema_utils_1.Type.Optional(schema_utils_1.Type.Boolean())
}, {
  $id: 'MoneroTransactionData'
});
exports.MoneroSignTransaction = schema_utils_1.Type.Object({
  path: params_1.DerivationPath,
  networkType: constants_1.PROTO.EnumMoneroNetworkType,
  tsx_data: exports.MoneroTransactionData,
  inputs: schema_utils_1.Type.Array(exports.MoneroTransactionSourceEntry)
}, {
  $id: 'MoneroSignTransaction'
});
exports.MoneroRingCtSig = schema_utils_1.Type.Object({
  txn_fee: schema_utils_1.Type.Optional(schema_utils_1.Type.Number()),
  message: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  rv_type: schema_utils_1.Type.Optional(schema_utils_1.Type.Number())
}, {
  $id: 'MoneroRingCtSig'
});
exports.MoneroSignedTransaction = schema_utils_1.Type.Object({
  signatures: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  tx_prefix_hash: schema_utils_1.Type.String(),
  rv: exports.MoneroRingCtSig,
  cout_key: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  salt: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  rand_mult: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  tx_enc_keys: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  opening_key: schema_utils_1.Type.Optional(schema_utils_1.Type.String()),
  pseudo_outs: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  out_pks: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  ecdh_infos: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  tx_outs: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  rsig_parts: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  extra: schema_utils_1.Type.Optional(schema_utils_1.Type.String())
}, {
  $id: 'MoneroSignedTransaction'
});
//# sourceMappingURL=index.js.map