"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const protobuf_1 = require("@trezor/protobuf");
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../core/AbstractMethod");
const paramsValidator_1 = require("./common/paramsValidator");
class EvoluSignRegistrationRequest extends AbstractMethod_1.AbstractMethod {
  hasBundle;
  init() {
    this.requiredPermissions = ['read'];
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, null, this.firmwareRange);
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(protobuf_1.MessagesSchema.EvoluSignRegistrationRequest, payload);
    this.params = {
      challenge_from_server: payload.challenge_from_server,
      size_to_acquire: payload.size_to_acquire,
      proof_of_delegated_identity: payload.proof_of_delegated_identity
    };
  }
  get info() {
    return 'Evolu sign registration request';
  }
  async run() {
    const cmd = this.device.getCommands();
    const response = await cmd.typedCall('EvoluSignRegistrationRequest', 'EvoluRegistrationRequest', this.params);
    return response.message;
  }
}
exports.default = EvoluSignRegistrationRequest;
//# sourceMappingURL=evoluSignRegistrationRequest.js.map