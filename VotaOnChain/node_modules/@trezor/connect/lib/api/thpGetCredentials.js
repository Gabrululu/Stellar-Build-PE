"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const constants_1 = require("../constants");
const AbstractMethod_1 = require("../core/AbstractMethod");
const DataManager_1 = require("../data/DataManager");
const thp_1 = require("../device/thp");
const events_1 = require("../events");
class ThpGetCredentials extends AbstractMethod_1.AbstractMethod {
  init() {
    this.allowDeviceMode = [events_1.UI.INITIALIZE, events_1.UI.SEEDLESS];
    this.requiredPermissions = ['management'];
    this.useDeviceState = false;
    this.skipFinalReload = true;
  }
  async run() {
    const thpState = this.device.getThpState();
    if (!thpState?.handshakeCredentials) {
      throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
    }
    const credentials = await (0, thp_1.getThpCredentials)(this.device, true);
    thpState.setPairingCredentials([credentials]);
    DataManager_1.DataManager.getSettings('thp')?.knownCredentials?.push(credentials);
    this.device.emit(events_1.DEVICE.THP_CREDENTIALS_CHANGED, {
      credentials,
      staticKey: thpState.handshakeCredentials.staticKey.toString('hex')
    });
    return credentials;
  }
}
exports.default = ThpGetCredentials;
//# sourceMappingURL=thpGetCredentials.js.map