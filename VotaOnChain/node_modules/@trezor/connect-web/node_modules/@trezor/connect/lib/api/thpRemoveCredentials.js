"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const constants_1 = require("../constants");
const AbstractMethod_1 = require("../core/AbstractMethod");
const DataManager_1 = require("../data/DataManager");
const events_1 = require("../events");
class ThpRemoveCredentials extends AbstractMethod_1.AbstractMethod {
  init() {
    this.allowDeviceMode = [events_1.UI.INITIALIZE, events_1.UI.SEEDLESS];
    this.requiredPermissions = ['management'];
    this.useDeviceState = false;
    this.skipFinalReload = true;
  }
  run() {
    const thpState = this.device.getThpState();
    if (!thpState) {
      throw constants_1.ERRORS.TypedError('Device_ThpStateMissing');
    }
    const knownCredentials = DataManager_1.DataManager.getSettings('thp')?.knownCredentials;
    if (knownCredentials) {
      const toRemoveCredentials = (this.payload.credentials || thpState.pairingCredentials).map(c => c.credential);
      const index = knownCredentials.findIndex(({
        credential
      }) => toRemoveCredentials.includes(credential));
      if (index >= 0) {
        knownCredentials.splice(index, 1);
      }
    }
    thpState.resetState();
    return Promise.resolve({
      message: 'Success'
    });
  }
}
exports.default = ThpRemoveCredentials;
//# sourceMappingURL=thpRemoveCredentials.js.map