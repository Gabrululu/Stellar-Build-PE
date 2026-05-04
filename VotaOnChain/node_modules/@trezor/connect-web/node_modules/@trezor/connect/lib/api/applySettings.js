"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const schema_utils_1 = require("@trezor/schema-utils");
const AbstractMethod_1 = require("../core/AbstractMethod");
const applySettings_1 = require("../types/api/applySettings");
class ApplySettings extends AbstractMethod_1.AbstractMethod {
  init() {
    this.requiredPermissions = ['management'];
    this.useDeviceState = false;
    this.skipFinalReload = false;
    const {
      payload
    } = this;
    (0, schema_utils_1.Assert)(applySettings_1.ApplySettings, payload);
    this.params = {
      ...payload,
      _passphrase_source: payload.passphrase_source
    };
  }
  get confirmation() {
    return {
      view: 'device-management',
      customConfirmButton: {
        className: 'confirm',
        label: 'Proceed'
      },
      label: 'Do you really want to change device settings?'
    };
  }
  async run() {
    const cmd = this.device.getCommands();
    const homescreenBytes = this.params.homescreen ? Buffer.from(this.params.homescreen, 'hex') : undefined;
    if (this.device.atLeast('2.9.0') && homescreenBytes) {
      this.params.homescreen = undefined;
      this.params.homescreen_length = homescreenBytes.length;
    }
    let response = await cmd.typedCall('ApplySettings', ['DataChunkRequest', 'Success'], this.params);
    while (response.type !== 'Success') {
      const start = response.message.data_offset;
      const end = start + response.message.data_length;
      const data_chunk = homescreenBytes?.subarray(start, end).toString('hex') || '';
      response = await cmd.typedCall('DataChunkAck', ['DataChunkRequest', 'Success'], {
        data_chunk
      });
    }
    return response.message;
  }
}
exports.default = ApplySettings;
//# sourceMappingURL=applySettings.js.map