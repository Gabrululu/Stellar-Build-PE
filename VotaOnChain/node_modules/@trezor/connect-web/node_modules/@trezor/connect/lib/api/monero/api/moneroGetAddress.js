"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const constants_1 = require("../../../constants");
const AbstractMethod_1 = require("../../../core/AbstractMethod");
const coinInfo_1 = require("../../../data/coinInfo");
const pathUtils_1 = require("../../../utils/pathUtils");
const paramsValidator_1 = require("../../common/paramsValidator");
class MoneroGetAddress extends AbstractMethod_1.AbstractMethod {
  hasBundle;
  progress = 0;
  init() {
    this.noBackupConfirmationMode = 'always';
    this.requiredPermissions = ['read'];
    this.requiredDeviceCapabilities = ['Capability_Monero'];
    this.firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, (0, coinInfo_1.getMiscNetwork)('Monero'), this.firmwareRange);
    this.hasBundle = !!this.payload.bundle;
    const payload = !this.payload.bundle ? {
      ...this.payload,
      bundle: [this.payload]
    } : this.payload;
    const bundle = payload.bundle.map(batch => {
      const path = (0, pathUtils_1.validatePath)(batch.path, 3);
      const allHardened = path.every(component => (component & pathUtils_1.HD_HARDENED) !== 0);
      if (!allHardened) {
        throw constants_1.ERRORS.TypedError('Method_InvalidParameter', `Monero requires all path components to be hardened. Use m/44'/128'/0' format.`);
      }
      return {
        address_n: path,
        address: batch.address,
        show_display: typeof batch.showOnTrezor === 'boolean' ? batch.showOnTrezor : true,
        network_type: batch.networkType || constants_1.PROTO.MoneroNetworkType.MAINNET,
        account: batch.account,
        minor: batch.minor,
        payment_id: batch.paymentId,
        chunkify: typeof batch.chunkify === 'boolean' ? batch.chunkify : false
      };
    });
    this.params = bundle;
    const useEventListener = payload.useEventListener && this.params.length === 1 && typeof this.params[0].address === 'string' && this.params[0].show_display;
    this.useUi = !useEventListener;
  }
  get info() {
    return 'Export Monero address';
  }
  getButtonRequestData(code) {
    if (code === 'ButtonRequest_Address') {
      const {
        address_n,
        address
      } = this.params[this.progress];
      return {
        type: 'address',
        serializedPath: (0, pathUtils_1.getSerializedPath)(address_n),
        address: address || 'not-set'
      };
    }
  }
  get confirmation() {
    return {
      view: 'export-address',
      label: this.info
    };
  }
  async _call({
    address_n,
    show_display,
    network_type,
    account,
    minor,
    payment_id,
    chunkify
  }) {
    const cmd = this.device.getCommands();
    const response = await cmd.typedCall('MoneroGetAddress', 'MoneroAddress', {
      address_n,
      show_display,
      network_type,
      account,
      minor,
      payment_id,
      chunkify
    });
    const addressHex = response.message.address;
    const addressBytes = Buffer.from(addressHex, 'hex');
    const address = addressBytes.toString('utf8');
    return {
      address
    };
  }
  async run() {
    const responses = [];
    for (let i = 0; i < this.params.length; i++) {
      const batch = this.params[i];
      if (batch.show_display) {
        const silent = await this._call({
          ...batch,
          show_display: false
        });
        if (typeof batch.address === 'string') {
          if (batch.address !== silent.address) {
            throw constants_1.ERRORS.TypedError('Method_AddressNotMatch');
          }
        } else {
          batch.address = silent.address;
        }
      }
      const response = await this._call(batch);
      responses.push({
        address: response.address,
        path: batch.address_n,
        serializedPath: (0, pathUtils_1.getSerializedPath)(batch.address_n)
      });
      this.progress++;
    }
    return this.hasBundle ? responses : responses[0];
  }
}
exports.default = MoneroGetAddress;
//# sourceMappingURL=moneroGetAddress.js.map