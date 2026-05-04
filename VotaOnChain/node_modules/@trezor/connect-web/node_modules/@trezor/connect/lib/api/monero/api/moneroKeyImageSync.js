"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const sha3_1 = require("@noble/hashes/sha3");
const utils_1 = require("@noble/hashes/utils");
const constants_1 = require("../../../constants");
const AbstractMethod_1 = require("../../../core/AbstractMethod");
const coinInfo_1 = require("../../../data/coinInfo");
const pathUtils_1 = require("../../../utils/pathUtils");
const paramsValidator_1 = require("../../common/paramsValidator");
function encodeVarint(n) {
  const bytes = [];
  while (n >= 0x80) {
    bytes.push(n & 0x7f | 0x80);
    n >>= 7;
  }
  bytes.push(n & 0x7f);
  return new Uint8Array(bytes);
}
class MoneroKeyImageSyncMethod extends AbstractMethod_1.AbstractMethod {
  init() {
    this.requiredPermissions = ['read'];
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
    if (!payload.tdis || payload.tdis.length === 0) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', 'tdis (transfer details) array is required and cannot be empty');
    }
    const tdis = payload.tdis.map((tdi, index) => {
      if (tdi.out_key.length !== 64) {
        throw constants_1.ERRORS.TypedError('Method_InvalidParameter', `Invalid out_key length at index ${index}: expected 64 hex characters, got ${tdi.out_key.length}`);
      }
      if (tdi.tx_pub_key.length !== 64) {
        throw constants_1.ERRORS.TypedError('Method_InvalidParameter', `Invalid tx_pub_key length at index ${index}: expected 64 hex characters, got ${tdi.tx_pub_key.length}`);
      }
      let additionalKeys = [];
      const addlKeys = tdi.additional_tx_pub_keys;
      if (addlKeys) {
        if (Array.isArray(addlKeys)) {
          additionalKeys = addlKeys;
        } else if (typeof addlKeys === 'string') {
          const trimmed = addlKeys.trim();
          if (trimmed) {
            additionalKeys = trimmed.split(',').map(k => k.trim());
          }
        }
      }
      additionalKeys.forEach((key, keyIndex) => {
        if (key && key.length !== 64) {
          throw constants_1.ERRORS.TypedError('Method_InvalidParameter', `Invalid additional_tx_pub_keys[${keyIndex}] length at tdi index ${index}: expected 64 hex characters, got ${key.length}`);
        }
      });
      return {
        out_key: (0, utils_1.hexToBytes)(tdi.out_key),
        tx_pub_key: (0, utils_1.hexToBytes)(tdi.tx_pub_key),
        additional_tx_pub_keys: additionalKeys.map(k => (0, utils_1.hexToBytes)(k)),
        internal_output_index: tdi.internal_output_index,
        sub_addr_major: tdi.sub_addr_major,
        sub_addr_minor: tdi.sub_addr_minor
      };
    });
    this.params = {
      address_n: path,
      network_type: payload.networkType || constants_1.PROTO.MoneroNetworkType.MAINNET,
      subs: payload.subs || [],
      tdis
    };
  }
  get info() {
    return 'Export Monero key images for spent output tracking';
  }
  async run() {
    const cmd = this.device.getCommands();
    const tdHashes = [];
    for (const tdi of this.params.tdis) {
      const kck = sha3_1.keccak_256.create();
      kck.update(tdi.out_key);
      kck.update(tdi.tx_pub_key);
      if (tdi.additional_tx_pub_keys && tdi.additional_tx_pub_keys.length > 0) {
        for (const addKey of tdi.additional_tx_pub_keys) {
          kck.update(addKey);
        }
      }
      const indexVarint = encodeVarint(tdi.internal_output_index);
      kck.update(indexVarint);
      tdHashes.push(kck.digest());
    }
    const finalKck = sha3_1.keccak_256.create();
    for (const hash of tdHashes) {
      finalKck.update(hash);
    }
    const hashBytes = finalKck.digest();
    const numOutputs = this.params.tdis.length;
    await cmd.typedCall('MoneroKeyImageExportInitRequest', 'MoneroKeyImageExportInitAck', {
      num: numOutputs,
      hash: hashBytes,
      address_n: this.params.address_n,
      network_type: this.params.network_type,
      subs: this.params.subs
    });
    const allKeyImages = [];
    const stepResponse = await cmd.typedCall('MoneroKeyImageSyncStepRequest', 'MoneroKeyImageSyncStepAck', {
      tdis: this.params.tdis
    });
    allKeyImages.push(...stepResponse.message.kis);
    const finalResponse = await cmd.typedCall('MoneroKeyImageSyncFinalRequest', 'MoneroKeyImageSyncFinalAck', {});
    const encKey = finalResponse.message.enc_key;
    if (!encKey) {
      throw constants_1.ERRORS.TypedError('Runtime', 'Device did not return encryption key for key images');
    }
    const keyImages = allKeyImages.map(ki => ({
      iv: ki.iv || '',
      key_image: ki.blob || ''
    }));
    return {
      key_images: keyImages,
      signature: encKey
    };
  }
}
exports.default = MoneroKeyImageSyncMethod;
//# sourceMappingURL=moneroKeyImageSync.js.map