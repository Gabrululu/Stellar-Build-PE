"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const protobuf_1 = require("@trezor/protobuf");
const protocol_1 = require("@trezor/protocol");
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../core/AbstractMethod");
const paramsValidator_1 = require("./common/paramsValidator");
class EvoluGetDelegatedIdentityKey extends AbstractMethod_1.AbstractMethod {
  hasBundle;
  init() {
    this.requiredPermissions = ['read'];
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, null, this.firmwareRange);
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(protobuf_1.MessagesSchema.EvoluGetDelegatedIdentityKey, payload);
    if (payload.thp !== undefined) {
      const staticKey = Buffer.from(payload.thp.staticHostKey, 'hex');
      const hostStaticKeys = protocol_1.thp.getCurve25519KeyPair(staticKey);
      this.params = {
        thp_credential: payload.thp.credential,
        host_static_public_key: hostStaticKeys.publicKey.toString('hex')
      };
    } else {
      this.params = {};
    }
  }
  get info() {
    return 'Evolu get delegated identity key';
  }
  async run() {
    const cmd = this.device.getCommands();
    const response = await cmd.typedCall('EvoluGetDelegatedIdentityKey', 'EvoluDelegatedIdentityKey', this.params);
    return response.message;
  }
}
exports.default = EvoluGetDelegatedIdentityKey;
//# sourceMappingURL=evoluGetDelegatedIdentityKey.js.map