"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const protobuf_1 = require("@trezor/protobuf");
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../core/AbstractMethod");
class ChangePin extends AbstractMethod_1.AbstractMethod {
  init() {
    this.requiredPermissions = ['management'];
    this.useDeviceState = false;
    this.skipFinalReload = false;
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(protobuf_1.MessagesSchema.ChangePin, payload);
    this.params = {
      remove: payload.remove
    };
  }
  async run() {
    const cmd = this.device.getCommands();
    const response = await cmd.typedCall('ChangePin', 'Success', this.params);
    return response.message;
  }
}
exports.default = ChangePin;
//# sourceMappingURL=changePin.js.map