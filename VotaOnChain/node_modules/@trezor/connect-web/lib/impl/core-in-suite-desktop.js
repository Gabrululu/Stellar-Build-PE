"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TrezorConnect = exports.CoreInSuiteDesktop = void 0;
const tslib_1 = require("tslib");
const events_1 = tslib_1.__importDefault(require("events"));
const ERRORS = tslib_1.__importStar(require("@trezor/connect/lib/constants/errors"));
const events_2 = require("@trezor/connect/lib/events");
const factory_1 = require("@trezor/connect/lib/factory");
const websocket_client_1 = require("@trezor/websocket-client");
const client_1 = require("@trezor/websocket-client/lib/client");
const connectSettings_1 = require("../connectSettings");
class CoreInSuiteDesktop {
  eventEmitter = new events_1.default();
  _settings;
  ws;
  localNetworkPermissionState = 'unknown';
  constructor() {
    this._settings = (0, connectSettings_1.parseConnectSettings)();
    this.ws = new websocket_client_1.WebsocketClient({
      url: 'ws://127.0.0.1:21335/connect-ws'
    });
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
    this.ws.dispose();
    return Promise.resolve(undefined);
  }
  cancel(_error) {
    this.ws.sendMessage({
      type: events_2.POPUP.CLOSED,
      payload: {
        error: _error
      }
    });
  }
  async handshake() {
    if (!this.ws) {
      throw ERRORS.TypedError('Desktop_ConnectionMissing', 'No websocket connection');
    }
    try {
      const response = await this.ws.sendMessage({
        type: events_2.POPUP.HANDSHAKE,
        payload: {
          settings: this._settings
        }
      }, {
        timeout: 3000
      });
      if (!response) {
        throw ERRORS.TypedError('Desktop_ConnectionMissing', 'No response');
      }
      return response;
    } catch (err) {
      throw ERRORS.TypedError('Desktop_ConnectionMissing', err.message);
    }
  }
  async init(settings) {
    const permission = await navigator.permissions.query({
      name: 'local-network-access'
    }).catch(() => undefined);
    if (permission) {
      this.localNetworkPermissionState = permission.state;
      permission.onchange = () => {
        this.localNetworkPermissionState = permission.state;
      };
    }
    const newSettings = (0, connectSettings_1.parseConnectSettings)({
      ...this._settings,
      ...settings
    });
    if (!newSettings.manifest || !newSettings.manifest.appName) {
      throw ERRORS.TypedError('Init_ManifestMissing', 'Manifest is missing or manifest.appName is not set');
    }
    if (!newSettings.transports?.length) {
      newSettings.transports = ['BridgeTransport', 'WebUsbTransport'];
    }
    this._settings = newSettings;
    return await this.connect();
  }
  error(err) {
    if (err instanceof client_1.WebsocketError) {
      if (this.localNetworkPermissionState === 'denied') {
        return ERRORS.TypedError('Browser_LocalNetworkPermissionMissing');
      } else {
        return ERRORS.TypedError('Desktop_ConnectionMissing', err.message);
      }
    }
    return err;
  }
  async connect() {
    try {
      await this.ws.connect();
    } catch (err) {
      throw this.error(err);
    }
  }
  setTransports() {
    throw new Error('Method_InvalidPackage');
  }
  async call(params) {
    try {
      if (!this.ws.isConnected()) {
        await this.connect();
      }
      await this.handshake();
      const response = await this.ws.sendMessage({
        type: events_2.IFRAME.CALL,
        payload: params
      }, {
        timeout: 0
      });
      if (!response) {
        throw ERRORS.TypedError('Desktop_ConnectionMissing', 'No response');
      }
      return response;
    } catch (err) {
      return {
        success: false,
        payload: ERRORS.serializeError(this.error(err))
      };
    }
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
exports.CoreInSuiteDesktop = CoreInSuiteDesktop;
const impl = new CoreInSuiteDesktop();
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
//# sourceMappingURL=core-in-suite-desktop.js.map