"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DataManager = void 0;
const tslib_1 = require("tslib");
const coins_eth_json_1 = tslib_1.__importDefault(require("@trezor/connect-common/files/coins-eth.json"));
const coins_json_1 = tslib_1.__importDefault(require("@trezor/connect-common/files/coins.json"));
const messages_json_1 = tslib_1.__importDefault(require("@trezor/protobuf/messages.json"));
const coinInfo_1 = require("./coinInfo");
const firmwareInfo_1 = require("./firmwareInfo");
const firmwareReleaseConfigUtils_1 = require("../utils/firmwareReleaseConfigUtils");
class DataManager {
  static assets = {};
  static settings;
  static messages = messages_json_1.default;
  static localFirmwares = {
    firmwareDir: '',
    firmwareList: []
  };
  static firmwareReleasesConfig = {};
  static firmwareIntermediaryReleasesConfig;
  static localFirmwareReleaseConfig;
  static async load(settings, withAssets = true, onlyLocalFirmwareConfig = false) {
    this.settings = settings;
    if (!withAssets) return;
    const assetsMap = {
      coins: coins_json_1.default,
      coinsEth: coins_eth_json_1.default
    };
    Object.assign(this.assets, assetsMap);
    (0, coinInfo_1.parseCoinsJson)({
      ...this.assets.coins,
      ...this.assets.coinsEth
    });
    this.prepareLocalFirmwareReleaseData();
    await this.loadFirmwareRelaseConfig(onlyLocalFirmwareConfig);
  }
  static prepareLocalFirmwareReleaseData() {
    const {
      config
    } = (0, firmwareReleaseConfigUtils_1.getOnlyLocalFirmwareReleaseConfig)();
    this.setLocalFirmwareReleaseConfig(config);
  }
  static async loadFirmwareRelaseConfig(onlyLocal) {
    let firmwareRelaseConfig;
    if (onlyLocal) {
      firmwareRelaseConfig = {
        config: this.getLocalFirmwareReleaseConfig(),
        isRemote: false
      };
    } else {
      firmwareRelaseConfig = await (0, firmwareReleaseConfigUtils_1.getFirmwareReleaseConfig)();
    }
    const {
      config,
      isRemote
    } = firmwareRelaseConfig;
    const firmwareconfig = await (0, firmwareInfo_1.initializeFirmwareConfig)(config, isRemote);
    this.setFirmwareReleaseConfig(firmwareconfig.releases);
    this.setFirmwareIntermediaryReleaseConfig(firmwareconfig.intermediaries);
  }
  static getProtobufMessages() {
    return this.messages;
  }
  static getSettings(key) {
    if (!this.settings) return null;
    if (typeof key === 'string') {
      return this.settings[key];
    }
    return this.settings;
  }
  static setLocalFirmwares(firmwares) {
    this.localFirmwares = firmwares;
  }
  static getLocalFirmwares() {
    return this.localFirmwares;
  }
  static setLocalFirmwareReleaseConfig(localFirmwareReleaseConfig) {
    this.localFirmwareReleaseConfig = localFirmwareReleaseConfig;
  }
  static getLocalFirmwareReleaseConfig() {
    return this.localFirmwareReleaseConfig;
  }
  static setFirmwareReleaseConfig(releaseConfig) {
    this.firmwareReleasesConfig = releaseConfig;
  }
  static getFirmwareReleaseConfig() {
    return this.firmwareReleasesConfig;
  }
  static setFirmwareIntermediaryReleaseConfig(intermediariesConfig) {
    this.firmwareIntermediaryReleasesConfig = intermediariesConfig;
  }
  static getFirmwareIntermediaryReleaseConfig() {
    return this.firmwareIntermediaryReleasesConfig;
  }
}
exports.DataManager = DataManager;
//# sourceMappingURL=DataManager.js.map