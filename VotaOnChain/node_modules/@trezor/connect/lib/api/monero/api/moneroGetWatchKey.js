"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const constants_1 = require("../../../constants");
const AbstractMethod_1 = require("../../../core/AbstractMethod");
const coinInfo_1 = require("../../../data/coinInfo");
const pathUtils_1 = require("../../../utils/pathUtils");
const paramsValidator_1 = require("../../common/paramsValidator");
class MoneroGetWatchKeyMethod extends AbstractMethod_1.AbstractMethod {
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
    this.params = {
      address_n: path,
      network_type: payload.networkType || constants_1.PROTO.MoneroNetworkType.MAINNET
    };
  }
  get info() {
    return 'Export Monero watch-only credentials';
  }
  async run() {
    const cmd = this.device.getCommands();
    const response = await cmd.typedCall('MoneroGetWatchKey', 'MoneroWatchKey', {
      address_n: this.params.address_n,
      network_type: this.params.network_type
    });
    const addressHex = response.message.address;
    const addressBytes = Buffer.from(addressHex, 'hex');
    const address = addressBytes.toString('utf8');
    return {
      watch_key: response.message.watch_key,
      address
    };
  }
}
exports.default = MoneroGetWatchKeyMethod;
//# sourceMappingURL=moneroGetWatchKey.js.map