"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const tslib_1 = require("tslib");
const cbor = tslib_1.__importStar(require("cbor"));
const schema_utils_1 = require("@trezor/schema-utils");
const constants_1 = require("../../../constants");
const AbstractMethod_1 = require("../../../core/AbstractMethod");
const coinInfo_1 = require("../../../data/coinInfo");
const cardano_1 = require("../../../types/api/cardano");
const formatUtils_1 = require("../../../utils/formatUtils");
const pathUtils_1 = require("../../../utils/pathUtils");
const paramsValidator_1 = require("../../common/paramsValidator");
const cardanoAddressParameters_1 = require("../cardanoAddressParameters");
const cardanoUtils_1 = require("../cardanoUtils");
class CardanoSignMessage extends AbstractMethod_1.AbstractMethod {
  static VERSION = 1;
  init() {
    this.requiredPermissions = ['read', 'write'];
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, (0, coinInfo_1.getMiscNetwork)('Cardano'), this.firmwareRange);
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(cardano_1.CardanoSignMessage, payload);
    if (!(0, formatUtils_1.isHexString)(payload.payload) || (0, formatUtils_1.hasHexPrefix)(payload.payload)) {
      throw constants_1.ERRORS.TypedError('Method_InvalidParameter', 'Message payload must be a hexadecimal string without a "0x" prefix.');
    }
    this.params = {
      path: (0, pathUtils_1.validatePath)(payload.path, 5),
      payload: payload.payload,
      preferHexDisplay: payload.preferHexDisplay ?? false,
      networkId: payload.networkId,
      protocolMagic: payload.protocolMagic,
      addressParameters: payload.addressParameters && (0, cardanoAddressParameters_1.addressParametersToProto)(payload.addressParameters),
      derivationType: payload.derivationType ?? constants_1.PROTO.CardanoDerivationType.ICARUS_TREZOR
    };
  }
  async run() {
    const typedCall = this.device.getCommands().typedCall.bind(this.device.getCommands());
    const payloadSize = (0, cardanoUtils_1.hexStringByteLength)(this.params.payload);
    let response = await typedCall('CardanoSignMessageInit', ['CardanoMessageSignature', 'CardanoMessageDataRequest'], {
      signing_path: this.params.path,
      payload_size: payloadSize,
      network_id: this.params.networkId,
      protocol_magic: this.params.protocolMagic,
      address_parameters: this.params.addressParameters,
      prefer_hex_display: this.params.preferHexDisplay,
      derivation_type: this.params.derivationType
    });
    while (response.type !== 'CardanoMessageSignature') {
      const {
        length,
        offset
      } = response.message;
      const data = this.params.payload.slice(offset * 2, (offset + length) * 2);
      response = await typedCall('CardanoMessageDataResponse', ['CardanoMessageSignature', 'CardanoMessageDataRequest'], {
        data
      });
    }
    const {
      signature,
      address,
      pub_key
    } = response.message;
    return {
      signature,
      payload: this.params.payload,
      headers: this._createHeaders(address),
      pubKey: pub_key,
      ...this._createCose(this.params.payload, signature, address, pub_key)
    };
  }
  _createHeaders(address) {
    return {
      protected: {
        1: constants_1.CARDANO.ALGORITHM_IDS.EdDSA,
        address
      },
      unprotected: {
        hashed: false,
        version: CardanoSignMessage.VERSION
      }
    };
  }
  _createCose(payload, signature, address, pubKey) {
    const coseSignature = cbor.encode([Buffer.from(cbor.encode(new Map().set(1, -8).set('address', Buffer.from(address, 'hex')))), new Map().set('hashed', false), Buffer.from(payload, 'hex'), Buffer.from(signature, 'hex')]);
    const coseKey = cbor.encode(new Map().set(1, 1).set(3, -8).set(-1, 6).set(-2, Buffer.from(pubKey, 'hex')));
    return {
      coseSignature: Buffer.from(coseSignature).toString('hex'),
      coseKey: Buffer.from(coseKey).toString('hex')
    };
  }
  get info() {
    return 'Sign Cardano message';
  }
}
exports.default = CardanoSignMessage;
//# sourceMappingURL=cardanoSignMessage.js.map