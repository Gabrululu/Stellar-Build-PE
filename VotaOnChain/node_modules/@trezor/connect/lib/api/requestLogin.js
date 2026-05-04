"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../core/AbstractMethod");
const paramsValidator_1 = require("./common/paramsValidator");
const DataManager_1 = require("../data/DataManager");
const requestLogin_1 = require("../types/api/requestLogin");
class RequestLogin extends AbstractMethod_1.AbstractMethod {
  init() {
    this.requiredPermissions = ['read', 'write'];
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, null, this.firmwareRange);
    this.useEmptyPassphrase = true;
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(requestLogin_1.RequestLoginSchema, payload);
    const identity = {};
    const settings = DataManager_1.DataManager.getSettings();
    let origin;
    if (settings.trustedHost && payload.origin) {
      origin = payload.origin;
    } else if (settings.origin) {
      origin = settings.origin;
    }
    if (origin) {
      const [proto, host, port] = origin.split(':');
      identity.proto = proto;
      identity.host = host.substring(2);
      if (port) {
        identity.port = port;
      }
      identity.index = 0;
    }
    this.params = {
      identity,
      challenge_hidden: payload.challengeHidden || '',
      challenge_visual: payload.challengeVisual || ''
    };
  }
  get info() {
    return 'Login';
  }
  async run() {
    const cmd = this.device.getCommands();
    const {
      message
    } = await cmd.typedCall('SignIdentity', 'SignedIdentity', this.params);
    return {
      address: message.address,
      publicKey: message.public_key,
      signature: message.signature
    };
  }
}
exports.default = RequestLogin;
//# sourceMappingURL=requestLogin.js.map