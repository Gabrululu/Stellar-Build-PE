"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrezorConnect = exports.CoreInSuiteWeb = void 0;
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
const ERRORS = tslib_1.__importStar(require("@trezor/connect/lib/constants/errors"));
const events_2 = require("@trezor/connect/lib/events");
const factory_1 = require("@trezor/connect/lib/factory");
const debug_1 = require("@trezor/connect/lib/utils/debug");
const connectSettings_1 = require("../connectSettings");
const popup_1 = require("../popup");
class CoreInSuiteWeb {
  eventEmitter = new events_1.default();
  _settings;
  _popupManager;
  logger;
  constructor() {
    this._settings = (0, connectSettings_1.parseConnectSettings)();
    this.logger = (0, debug_1.initLog)('@trezor/connect-web');
  }
  manifest(data) {
    this._settings = (0, connectSettings_1.parseConnectSettings)({
      ...this._settings,
      manifest: data
    });
  }
  dispose() {
    this.eventEmitter.removeAllListeners();
    this._settings = (0, connectSettings_1.parseConnectSettings)();
    return Promise.resolve(undefined);
  }
  init(settings) {
    this._settings = (0, connectSettings_1.parseConnectSettings)({
      ...this._settings,
      ...settings
    });
    this.logger.enabled = !!this._settings.debug;
    if (!this._settings.manifest) {
      throw ERRORS.TypedError('Init_ManifestMissing');
    }
    if (!this._popupManager) {
      this._popupManager = new popup_1.PopupManager({
        ...this._settings,
        useCoreInPopup: true,
        popupSrc: this.getSuiteUrl()
      }, {
        logger: this.logger
      });
      this._popupManager.on(events_2.DEVICE_EVENT, event => {
        this.eventEmitter.emit(events_2.DEVICE_EVENT, event);
      });
    }
    this.logger.debug('initiated');
    return Promise.resolve();
  }
  getSuiteUrl() {
    if (this._settings.connectSrc?.startsWith('http://localhost')) {
      return 'http://localhost:8000/connect-popup';
    }
    if (this._settings.connectSrc?.startsWith('https://dev.suite.sldev.cz/connect/')) {
      const branch = this._settings.connectSrc?.replace('https://dev.suite.sldev.cz/connect/', '');
      return `https://dev.suite.sldev.cz/suite-web/${branch}web/connect-popup`;
    }
    return 'https://suite.trezor.io/web/connect-popup';
  }
  async call(params) {
    this.logger.debug('call', params);
    if (!this._popupManager) {
      return (0, events_2.createErrorMessage)(ERRORS.TypedError('Init_NotInitialized'));
    }
    await this._popupManager.request();
    await this._popupManager.channel.init();
    await this._popupManager.handshakePromise?.promise;
    try {
      const response = await this._popupManager.channel.postMessage({
        type: events_2.IFRAME.CALL,
        payload: params
      });
      this.logger.debug('call: response: ', response);
      if (!response?.payload) {
        throw ERRORS.TypedError('Method_NoResponse');
      }
      if (response.payload.error && response.payload.code) {
        throw response.payload;
      }
      return {
        success: response.payload.success,
        payload: response.payload.payload,
        device: response.payload.device
      };
    } catch (error) {
      this.logger.error('call: error', error);
      return (0, events_2.createErrorMessage)(error);
    }
  }
  cancel(_error) {
    this._popupManager?.channel?.postMessage({
      type: events_2.POPUP.CLOSED,
      payload: {
        error: _error
      }
    });
  }
  setTransports() {
    throw new Error('Method_InvalidPackage');
  }
  uiResponse(_response) {
    throw ERRORS.TypedError('Method_InvalidPackage');
  }
  disableWebUSB() {
    throw ERRORS.TypedError('Method_InvalidPackage');
  }
  requestWebUSBDevice() {
    throw ERRORS.TypedError('Method_InvalidPackage');
  }
  renderWebUSBButton() {}
}
exports.CoreInSuiteWeb = CoreInSuiteWeb;
const impl = new CoreInSuiteWeb();
exports.TrezorConnect = (0, factory_1.factory)({
  eventEmitter: impl.eventEmitter,
  init: impl.init.bind(impl),
  call: impl.call.bind(impl),
  setTransports: impl.setTransports.bind(impl),
  manifest: impl.manifest.bind(impl),
  uiResponse: impl.uiResponse.bind(impl),
  cancel: impl.cancel.bind(impl),
  dispose: impl.dispose.bind(impl)
});
//# sourceMappingURL=core-in-suite-web.js.map