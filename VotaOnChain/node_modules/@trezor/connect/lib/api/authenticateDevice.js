"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const device_authenticity_1 = require("@trezor/device-authenticity");
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../core/AbstractMethod");
const events_1 = require("../events");
const paramsValidator_1 = require("./common/paramsValidator");
const authenticateDevice_1 = require("../types/api/authenticateDevice");
class AuthenticateDevice extends AbstractMethod_1.AbstractMethod {
  init() {
    this.useEmptyPassphrase = true;
    this.allowDeviceMode = [events_1.UI.INITIALIZE, events_1.UI.SEEDLESS];
    this.requiredPermissions = ['management'];
    this.skipFinalReload = false;
    this.useDeviceState = false;
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, null, this.firmwareRange);
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(authenticateDevice_1.AuthenticateDeviceParams, payload);
    this.params = {
      config: payload.config,
      blacklistConfig: payload.blacklistConfig,
      allowDebugKeys: payload.allowDebugKeys
    };
  }
  async run() {
    const challenge = (0, device_authenticity_1.getRandomChallenge)();
    const {
      message
    } = await this.device.getCommands().typedCall('AuthenticateDevice', 'AuthenticityProof', {
      challenge: challenge.toString('hex')
    });
    const config = this.params.config || device_authenticity_1.deviceAuthenticityConfig;
    const blacklistConfig = this.params.blacklistConfig || device_authenticity_1.deviceAuthenticityBlacklistConfig;
    const commonParams = {
      challenge,
      deviceModel: this.device.features.internal_model,
      allowDebugKeys: this.params.allowDebugKeys,
      config,
      blacklistConfig
    };
    const getOptigaResult = async () => {
      const {
        optiga_signature: signature,
        optiga_certificates: certificates
      } = message;
      const isAvailable = signature !== undefined && certificates.length > 0;
      if (isAvailable) {
        return await (0, device_authenticity_1.verifyAuthenticityProof)({
          ...commonParams,
          certificates,
          signature
        });
      }
      return {
        valid: false,
        error: 'RESPONSE_PAYLOAD_MISSING'
      };
    };
    const getTropicResult = async () => {
      const {
        tropic_signature: signature,
        tropic_certificates: certificates
      } = message;
      const isAvailable = signature !== undefined && certificates.length > 0;
      const isRequired = !this.device.unavailableCapabilities['tropicDeviceAuthentication'];
      if (isAvailable) {
        return await (0, device_authenticity_1.verifyAuthenticityProof)({
          ...commonParams,
          certificates,
          signature
        });
      }
      if (isRequired) {
        return {
          valid: false,
          error: 'RESPONSE_PAYLOAD_MISSING'
        };
      }
      return null;
    };
    const optigaResult = await getOptigaResult();
    const tropicResult = await getTropicResult();
    return {
      optigaResult,
      tropicResult
    };
  }
}
exports.default = AuthenticateDevice;
//# sourceMappingURL=authenticateDevice.js.map