"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Device = void 0;
const device_utils_1 = require("@trezor/device-utils");
const protocol_1 = require("@trezor/protocol");
const transport_1 = require("@trezor/transport");
const utils_1 = require("@trezor/utils");
const DeviceCommands_1 = require("./DeviceCommands");
const constants_1 = require("../constants");
const DeviceCurrentSession_1 = require("./DeviceCurrentSession");
const checkFirmwareRevision_1 = require("./checkFirmwareRevision");
const thp_1 = require("./thp");
const checkFirmwareHashWithRetries_1 = require("./workflow/checkFirmwareHashWithRetries");
const coinInfo_1 = require("../data/coinInfo");
const firmwareInfo_1 = require("../data/firmwareInfo");
const events_1 = require("../events");
const types_1 = require("../types");
const handshake_1 = require("./workflow/handshake");
const assetUtils_1 = require("../utils/assetUtils");
const debug_1 = require("../utils/debug");
const deviceFeaturesUtils_1 = require("../utils/deviceFeaturesUtils");
const firmwareUtils_1 = require("../utils/firmwareUtils");
const _log = (0, debug_1.initLog)('Device');
class Device extends utils_1.TypedEmitter {
  transport;
  thp;
  descriptor;
  sessionAcquired;
  _protocol;
  get protocol() {
    return this._protocol;
  }
  getThpState() {
    return this.thp;
  }
  unreadableError;
  _firmwareStatus;
  get firmwareStatus() {
    return this._firmwareStatus;
  }
  _currentRelease;
  get currentRelease() {
    return this._currentRelease;
  }
  _firmwareReleaseConfigInfo;
  get firmwareReleaseConfigInfo() {
    return this._firmwareReleaseConfigInfo;
  }
  _features;
  get features() {
    return this._features;
  }
  wasUsedElsewhere = false;
  acquirePromise;
  releasePromise;
  runAbort;
  runPromise;
  keepTransportSession = false;
  currentSession;
  instance = 0;
  state = [];
  stateStorage = undefined;
  busy;
  _unavailableCapabilities = {};
  get unavailableCapabilities() {
    return this._unavailableCapabilities;
  }
  _firmwareType;
  get firmwareType() {
    return this._firmwareType;
  }
  get possibleHIDdevice() {
    return this.descriptor.type === 0 || this.descriptor.type === 2;
  }
  get possibleT1() {
    return (this.descriptor.type ?? 0) <= 2;
  }
  name = 'Trezor';
  color;
  availableTranslations = {};
  authenticityChecks = {
    firmwareRevision: null,
    firmwareHash: null
  };
  uniquePath;
  lifecycle = new utils_1.TypedEmitter();
  sessionDfd;
  constructor({
    id,
    transport,
    descriptor
  }) {
    super();
    this._protocol = protocol_1.v1;
    this.uniquePath = id;
    this.transport = transport;
    this.descriptor = {
      id: descriptor.id,
      apiType: descriptor.apiType,
      type: descriptor.type,
      path: descriptor.path
    };
    this.sessionAcquired = null;
    transport.on(transport_1.TRANSPORT.STOPPED, this.onTransportStopped);
    transport.deviceEvents.on(this.descriptor.path, this.onTransportDeviceEvent);
  }
  get transportPath() {
    return this.descriptor.path;
  }
  onTransportStopped = () => this.disconnect();
  onTransportDeviceEvent = event => {
    switch (event.type) {
      case transport_1.TRANSPORT.DEVICE_SESSION_CHANGED:
        return this.updateDescriptor(event.descriptor);
      case transport_1.TRANSPORT.DEVICE_REQUEST_RELEASE:
        return this.usedElsewhere();
      case transport_1.TRANSPORT.DEVICE_DISCONNECTED:
        {
          return this.disconnect();
        }
    }
  };
  getSessionChangePromise() {
    if (!this.sessionDfd) {
      this.sessionDfd = (0, utils_1.createDeferred)();
      this.sessionDfd.promise.catch(() => {}).finally(() => {
        this.sessionDfd = undefined;
      });
    }
    return this.sessionDfd.promise;
  }
  async waitAndCompareSession(response, sessionPromise) {
    if (response.success) {
      try {
        if ((await sessionPromise) !== response.payload) {
          return {
            success: false,
            error: transport_1.TRANSPORT_ERROR.SESSION_WRONG_PREVIOUS
          };
        }
      } catch {
        return {
          success: false,
          error: transport_1.TRANSPORT_ERROR.DEVICE_DISCONNECTED_DURING_ACTION
        };
      }
    }
    return response;
  }
  acquire() {
    const sessionPromise = this.getSessionChangePromise();
    const previous = this.transport.getDescriptor(this.descriptor.path)?.session ?? null;
    this.acquirePromise = this.transport.acquire({
      input: {
        path: this.descriptor.path,
        previous
      }
    }).then(result => this.waitAndCompareSession(result, sessionPromise)).then(result => {
      if (result.success) {
        this.wasUsedElsewhere = false;
        this.sessionAcquired = result.payload;
        this.currentSession = new DeviceCurrentSession_1.DeviceCurrentSession(this, this.transport, this.sessionAcquired);
        return result;
      } else {
        throw new Error(result.error);
      }
    }).finally(() => {
      this.acquirePromise = undefined;
    });
    return this.acquirePromise;
  }
  reset() {
    _log.info(`Resetting Features and ThpState`);
    this._features = undefined;
    this._protocol = protocol_1.v1;
    this.thp?.resetState();
    this.thp = undefined;
  }
  setBusy(value) {
    this.busy = value;
  }
  release() {
    if (!this.sessionAcquired || this.keepTransportSession || this.releasePromise) {
      return;
    }
    const sessionPromise = this.getSessionChangePromise();
    this.releasePromise = this.transport.release({
      session: this.sessionAcquired,
      path: this.descriptor.path
    }).then(result => this.waitAndCompareSession(result, sessionPromise)).then(result => {
      if (result.success) {
        this.sessionAcquired = null;
      }
      return result;
    }).finally(() => {
      this.releasePromise = undefined;
    });
    return this.releasePromise;
  }
  async setupThp() {
    _log.info('Setup THP device');
    this._protocol = protocol_1.v2;
    if (this.transport.name === 'BridgeTransport' && !utils_1.versionUtils.isNewerOrEqual(this.transport.version, '3.0.0')) {
      this.unreadableError = 'THP incompatible with bridge ' + this.transport.version;
    } else {
      try {
        await this.transport.loadMessages('thp', protocol_1.thp.getProtobufDefinitions);
        this.thp = new protocol_1.thp.ThpState();
      } catch (error) {
        this.unreadableError = error.message;
      }
    }
  }
  async handshake() {
    if (this.isUsedElsewhere()) {
      return true;
    }
    try {
      await this.run();
    } catch (error) {
      _log.warn(`device.run error.message: ${error.message}, code: ${error.code}`);
      if (error.code === 'Device_NotFound' || error.code === 'Device_Disconnected' || error.message === transport_1.TRANSPORT_ERROR.DEVICE_NOT_FOUND || error.message === transport_1.TRANSPORT_ERROR.DEVICE_DISCONNECTED_DURING_ACTION || error.message === transport_1.TRANSPORT_ERROR.HTTP_ERROR) {
        return false;
      }
      if (this.possibleHIDdevice && error.message === transport_1.TRANSPORT_ERROR.INTERFACE_UNABLE_TO_OPEN_DEVICE || error.message === transport_1.TRANSPORT_ERROR.LIBUSB_ERROR_ACCESS) {
        this.unreadableError = error.message;
      }
    }
    return true;
  }
  async updateDescriptor(descriptor) {
    this.sessionDfd?.resolve(descriptor.session);
    await Promise.all([this.acquirePromise, this.releasePromise]);
    if (descriptor.session && descriptor.session !== this.sessionAcquired) {
      this.usedElsewhere();
    }
    if (!descriptor.session) {
      this.keepTransportSession = false;
    }
    this.lifecycle.emit(events_1.DEVICE.CHANGED);
  }
  run(fn, options = {}) {
    if (this.runPromise) {
      _log.warn('Previous call is still running');
      throw constants_1.ERRORS.TypedError('Device_CallInProgress');
    }
    const wasUnacquired = this.isUnacquired();
    this.runAbort = new AbortController();
    const {
      signal
    } = this.runAbort;
    this.runPromise = Promise.race([this._runInner(fn, options, signal), new Promise((_, reject) => {
      signal.addEventListener('abort', () => reject(signal.reason));
    })]).catch(async err => {
      this.keepTransportSession = false;
      await this.acquirePromise;
      await this.release();
      throw err;
    }).finally(() => {
      this.runAbort = undefined;
      this.runPromise = undefined;
    }).then(() => {
      if (wasUnacquired && !this.isUnacquired()) {
        this.lifecycle.emit(events_1.DEVICE.CONNECT);
      }
    });
    return this.runPromise;
  }
  async interrupt(reason) {
    await (0, thp_1.abortThpWorkflow)(this);
    await this.currentSession?.abort(reason);
    this.runAbort?.abort(reason);
    await this.currentRun;
  }
  get currentRun() {
    return this.runPromise?.catch(() => {});
  }
  usedElsewhere() {
    this.wasUsedElsewhere = true;
    if (!this.sessionAcquired) {
      return;
    }
    this.transport.releaseDevice(this.sessionAcquired);
    this.sessionAcquired = null;
    _log.debug('interruptionFromOutside');
    this.runAbort?.abort(constants_1.ERRORS.TypedError('Device_UsedElsewhere'));
  }
  async _runInner(fn, options, abortSignal) {
    if (this.releasePromise) {
      await this.releasePromise;
    }
    const acquireNeeded = !this.isUsedHere() || this.currentSession?.isDisposed();
    if (acquireNeeded) {
      await this.acquire();
    }
    if (abortSignal.aborted) throw abortSignal.reason;
    const {
      staticSessionId,
      deriveCardano
    } = this.getState() || {};
    if (acquireNeeded || !staticSessionId || !deriveCardano && options.useCardanoDerivation) {
      try {
        await (0, handshake_1.handshakeCancel)({
          device: this,
          logger: _log,
          signal: abortSignal
        });
        if (this.protocol.name === 'v2') {
          const withInteraction = !!fn;
          this.busy = await (0, thp_1.getThpChannel)(this, withInteraction);
          if (!this.busy) {
            await this.getFeatures();
          }
        } else if (fn) {
          await this.initialize(!!options.useCardanoDerivation);
        } else {
          await this.getFeatures();
        }
      } catch (error) {
        _log.warn('Device._runInner error: ', error.message);
        if (error.code === 'Failure_Busy') {
          this.busy = 'busy';
        }
        if (error.code === 'ThpDeviceLocked') {
          this.busy = 'pin-locked';
        }
        if (error.code === 'Device_ThpPairingTagInvalid') {
          return Promise.reject(error);
        }
        return Promise.reject(constants_1.ERRORS.TypedError('Device_InitializeFailed', `Initialize failed: ${error.message}${error.code ? `, code: ${error.code}` : ''}`));
      }
    }
    if (!options.skipFirmwareChecks) {
      await (0, checkFirmwareHashWithRetries_1.checkFirmwareHashWithRetries)({
        device: this,
        logger: _log
      });
      await this.checkFirmwareRevisionWithRetries();
    }
    if (!options.skipLanguageChecks && this.features?.language && !this.features.language_version_matches && this.atLeast('2.7.0')) {
      _log.info('language version mismatch. silently updating...');
      try {
        await this.changeLanguage({
          language: this.features.language
        });
      } catch (err) {
        _log.error('change language failed silently', err);
      }
    }
    if (options.keepSession) {
      this.keepTransportSession = true;
    }
    if (fn) {
      await fn();
      if (!options.skipFinalReload) {
        await this.getFeatures();
      }
    }
    if (!this.keepTransportSession && typeof options.keepSession !== 'boolean' || options.keepSession === false) {
      this.keepTransportSession = false;
      await this.release();
    }
  }
  getCurrentSession() {
    if (!this.currentSession) {
      throw constants_1.ERRORS.TypedError('Runtime', `Device: commands not defined`);
    }
    return this.currentSession;
  }
  getCommands() {
    return (0, DeviceCommands_1.DeviceCommands)(this.getCurrentSession());
  }
  setInstance(instance = 0) {
    if (this.instance !== instance) {
      if (this.keepTransportSession) {
        this.sessionAcquired = null;
        this.keepTransportSession = false;
      }
    }
    this.instance = instance;
  }
  getInstance() {
    return this.instance;
  }
  getState() {
    return this.state[this.instance];
  }
  setState(state) {
    if (!state) {
      delete this.state[this.instance];
    } else {
      const prevState = this.state[this.instance];
      const newState = {
        ...prevState,
        ...state
      };
      this.state[this.instance] = newState;
      this.stateStorage?.saveState(this, newState);
    }
  }
  async initialize(useCardanoDerivation) {
    let payload;
    if (this.features) {
      const {
        sessionId,
        deriveCardano
      } = this.getState() || {};
      payload = {
        derive_cardano: deriveCardano || useCardanoDerivation
      };
      if (sessionId) {
        payload.session_id = sessionId;
      }
    }
    const {
      message
    } = await this.getCurrentSession().typedCall('Initialize', 'Features', payload);
    this._updateFeatures(message);
    this._updateCurrentRelease(message);
    this.setState({
      deriveCardano: payload?.derive_cardano
    });
  }
  initStorage(storage) {
    this.stateStorage = storage;
    this.setState(storage.loadState(this));
  }
  async getFeatures() {
    const {
      message
    } = await this.getCurrentSession().typedCall('GetFeatures', 'Features', {});
    this._updateFeatures(message);
    this._updateCurrentRelease(message);
  }
  getAuthenticityChecks() {
    return this.authenticityChecks;
  }
  setAuthenticityChecks(firmwareHash) {
    this.authenticityChecks.firmwareHash = firmwareHash;
  }
  async checkFirmwareRevisionWithRetries() {
    const lastResult = this.authenticityChecks.firmwareRevision;
    const notDoneYet = lastResult === null;
    const wasError = lastResult !== null && !lastResult.success;
    const wasErrorRetriable = wasError && (0, utils_1.isArrayMember)(lastResult.error, constants_1.FIRMWARE.REVISION_CHECK_RETRIABLE_ERRORS);
    if (notDoneYet || wasErrorRetriable) {
      await this.checkFirmwareRevision();
    }
  }
  async checkFirmwareRevision() {
    const firmwareVersion = this.getVersion();
    if (!firmwareVersion || !this.features || !this.firmwareType) {
      return;
    }
    if (this.features && this.features.bootloader_mode === true) {
      return;
    }
    const release = (0, assetUtils_1.getReleaseAsset)(this.features.internal_model, firmwareVersion, this.firmwareType);
    const result = await (0, checkFirmwareRevision_1.checkFirmwareRevision)({
      internalModel: this.features.internal_model,
      deviceRevision: this.features.revision,
      firmwareVersion,
      expectedRevision: release?.firmware_revision,
      firmwareType: this.firmwareType
    });
    this.authenticityChecks = {
      ...this.authenticityChecks,
      firmwareRevision: result
    };
  }
  async changeLanguage({
    language,
    binary
  }) {
    if (language === 'en-US') {
      return this._uploadTranslationData(null);
    }
    if (binary) {
      return this._uploadTranslationData(binary);
    }
    const version = this.getVersion();
    if (!version) {
      throw constants_1.ERRORS.TypedError('Runtime', 'changeLanguage: device version unknown');
    }
    if (!this.firmwareType) {
      throw constants_1.ERRORS.TypedError('Runtime', 'changeLanguage: firmware type unknown');
    }
    if (!this._currentRelease) {
      throw constants_1.ERRORS.TypedError('Runtime', 'changeLanguage: release not found');
    }
    const languageBinPath = this._currentRelease.translations[language];
    const downloadedBinary = await (0, firmwareInfo_1.getLanguage)(languageBinPath);
    if (!downloadedBinary) {
      throw constants_1.ERRORS.TypedError('Runtime', 'changeLanguage: translation not found');
    }
    let dataToSend;
    if (Buffer.isBuffer(downloadedBinary)) {
      dataToSend = new Uint8Array(downloadedBinary).buffer;
    } else {
      dataToSend = downloadedBinary;
    }
    return this._uploadTranslationData(dataToSend);
  }
  async _uploadTranslationData(payload) {
    if (payload === null) {
      const response = await this.getCurrentSession().typedCall('ChangeLanguage', ['Success'], {
        data_length: 0
      });
      return response.message;
    }
    const length = payload.byteLength;
    let response = await this.getCurrentSession().typedCall('ChangeLanguage', ['DataChunkRequest', 'Success'], {
      data_length: length
    });
    while (response.type !== 'Success') {
      const start = response.message.data_offset;
      const end = response.message.data_offset + response.message.data_length;
      const chunk = payload.slice(start, end);
      response = await this.getCurrentSession().typedCall('DataChunkAck', ['DataChunkRequest', 'Success'], {
        data_chunk: Buffer.from(chunk).toString('hex')
      });
    }
    return response.message;
  }
  async _updateCurrentRelease(feat) {
    const {
      firmwareVersion
    } = (0, firmwareInfo_1.getCurrentVersion)(feat);
    const newFirmwareType = (0, firmwareUtils_1.getFirmwareType)(feat);
    if (!firmwareVersion) {
      return;
    }
    if (this._currentRelease && newFirmwareType === this.firmwareType && utils_1.versionUtils.isEqual(this._currentRelease.version, firmwareVersion)) {
      return;
    }
    const release = await (0, firmwareInfo_1.getReleaseByVersion)(feat, firmwareVersion, newFirmwareType);
    this._currentRelease = release;
    this.availableTranslations = this._currentRelease?.translations ?? {};
  }
  _updateFeatures(feat) {
    const capabilities = (0, deviceFeaturesUtils_1.parseCapabilities)(feat);
    feat.capabilities = capabilities;
    if (this.features && this.features.session_id && !feat.session_id) {
      feat.session_id = this.features.session_id;
    }
    feat.unlocked = feat.unlocked ?? true;
    const revision = (0, deviceFeaturesUtils_1.parseRevision)(feat);
    feat.revision = revision;
    if (!feat.model && feat.major_version === 1) {
      feat.model = '1';
    }
    if (!feat.internal_model || !device_utils_1.DeviceModelInternal[feat.internal_model]) {
      feat.internal_model = (0, deviceFeaturesUtils_1.ensureInternalModelFeature)(feat.model);
    }
    const version = this.getVersion();
    const newVersion = [feat.major_version, feat.minor_version, feat.patch_version];
    if (!version || !utils_1.versionUtils.isEqual(version, newVersion)) {
      if (version) {
        this.emit(events_1.DEVICE.FIRMWARE_VERSION_CHANGED, {
          oldVersion: version,
          newVersion,
          device: this.toMessageObject()
        });
      }
      this._unavailableCapabilities = (0, deviceFeaturesUtils_1.getUnavailableCapabilities)(feat, (0, coinInfo_1.getAllNetworks)());
      this._firmwareStatus = (0, firmwareInfo_1.getFirmwareStatus)(feat, (0, firmwareUtils_1.getFirmwareType)(feat));
      this._firmwareReleaseConfigInfo = (0, firmwareInfo_1.getFirmwareReleaseConfigInfo)(feat, (0, firmwareUtils_1.getFirmwareType)(feat));
      this._currentRelease = (0, assetUtils_1.getReleaseAsset)(feat.internal_model, newVersion, (0, firmwareUtils_1.getFirmwareType)(feat));
      this.availableTranslations = this._currentRelease?.translations ?? {};
    }
    this._features = feat;
    this._firmwareType = (0, firmwareUtils_1.getFirmwareType)(feat);
    const deviceInfo = device_utils_1.models[feat.internal_model] ?? {
      name: `Unknown ${feat.internal_model}`,
      colors: {}
    };
    this.name = deviceInfo.name;
    this.busy = undefined;
    if (feat?.unit_color) {
      const deviceUnitColor = feat.unit_color.toString();
      if (deviceUnitColor in deviceInfo.colors) {
        this.color = deviceInfo.colors[deviceUnitColor];
      }
    }
  }
  updateFeature(key, value) {
    if (this._features) {
      this._features = {
        ...this._features,
        [key]: value
      };
      this.lifecycle.emit(events_1.DEVICE.CHANGED);
    }
  }
  prompt(type, args) {
    return new Promise(callback => {
      if (!this.listenerCount(type)) {
        const payload = {
          success: false,
          error: new Error(`${type} callback not configured`)
        };
        callback(payload);
      } else {
        this.emit(type, {
          callback,
          ...args
        });
      }
    });
  }
  isUnacquired() {
    return this.features === undefined;
  }
  isUnreadable() {
    return !!this.unreadableError;
  }
  disconnect() {
    _log.debug('Disconnect cleanup');
    this.transport.off(transport_1.TRANSPORT.STOPPED, this.onTransportStopped);
    this.transport.deviceEvents.off(this.descriptor.path, this.onTransportDeviceEvent);
    this.removeAllListeners();
    this.sessionDfd?.reject(new Error());
    if (this.sessionAcquired) {
      this.transport.releaseSync(this.sessionAcquired);
      this.sessionAcquired = null;
    }
    this.lifecycle.emit(events_1.DEVICE.DISCONNECT);
    return this.interrupt(constants_1.ERRORS.TypedError('Device_Disconnected'));
  }
  isBootloader() {
    return this.features && !!this.features.bootloader_mode;
  }
  isInitialized() {
    return this.features && !!this.features.initialized;
  }
  isSeedless() {
    return this.features && !!this.features.no_backup;
  }
  getVersion() {
    if (!this.features) return;
    return [this.features.major_version, this.features.minor_version, this.features.patch_version];
  }
  atLeast(versions) {
    const version = this.getVersion();
    if (!this.features || !version) return false;
    const modelVersion = typeof versions === 'string' ? versions : versions[this.features.major_version - 1];
    return utils_1.versionUtils.isNewerOrEqual(version, modelVersion);
  }
  isUsed() {
    return !!this.transport.getDescriptor(this.descriptor.path)?.session;
  }
  isUsedHere() {
    return !!this.sessionAcquired;
  }
  isUsedElsewhere() {
    return this.isUsed() && !this.isUsedHere();
  }
  getUniquePath() {
    return this.uniquePath;
  }
  isT1() {
    return this.features ? this.features.major_version === 1 : false;
  }
  hasUnexpectedMode(allow, require) {
    if (this.features) {
      if (this.isBootloader() && !allow.includes(events_1.UI.BOOTLOADER)) {
        return events_1.UI.BOOTLOADER;
      }
      if (!this.isInitialized() && !allow.includes(events_1.UI.INITIALIZE)) {
        return events_1.UI.INITIALIZE;
      }
      if (this.isSeedless() && !allow.includes(events_1.UI.SEEDLESS)) {
        return events_1.UI.SEEDLESS;
      }
      if (!this.isBootloader() && require.includes(events_1.UI.BOOTLOADER)) {
        return events_1.UI.NOT_IN_BOOTLOADER;
      }
    }
    return null;
  }
  getStatus() {
    if (this.isUsedElsewhere()) return 'occupied';
    if (this.wasUsedElsewhere) return 'used';
    if (this.busy) return this.busy;
    return 'available';
  }
  getDeviceThp() {
    const state = this.thp?.serialize();
    return state ? {
      properties: state.properties,
      credentials: state.credentials,
      channel: state.channel
    } : undefined;
  }
  toMessageObject() {
    const {
      name,
      uniquePath: path,
      descriptor
    } = this;
    const {
      apiType,
      id
    } = descriptor;
    const base = {
      path,
      name,
      descriptor: {
        apiType,
        id
      }
    };
    const bluetoothProps = this.descriptor.id && this.descriptor.apiType === 'bluetooth' ? {
      id: (0, types_1.asBluetoothDeviceId)(this.descriptor.id)
    } : undefined;
    if (this.unreadableError) {
      return {
        ...base,
        type: 'unreadable',
        error: this.unreadableError,
        label: 'Unreadable device',
        hid: this.possibleHIDdevice
      };
    }
    if (this.isUnacquired()) {
      const sessionOwner = this.transport.getDescriptor(this.descriptor.path)?.sessionOwner;
      return {
        ...base,
        type: 'unacquired',
        label: 'Unacquired device',
        name: this.name,
        transportSessionOwner: this.sessionAcquired ? undefined : sessionOwner,
        bluetoothProps,
        thp: this.getDeviceThp(),
        status: this.busy ? this.busy : undefined
      };
    }
    const defaultLabel = 'My Trezor';
    const label = this.features.label === '' || !this.features.label ? defaultLabel : this.features.label;
    return {
      ...base,
      type: 'acquired',
      id: this.features.device_id,
      label,
      _state: this.getState(),
      state: this.getState()?.staticSessionId,
      status: this.getStatus(),
      mode: (0, firmwareUtils_1.getFirmwareMode)(this.features),
      color: this.color,
      firmware: this.firmwareStatus,
      firmwareReleaseConfigInfo: this.firmwareReleaseConfigInfo,
      firmwareType: this.firmwareType,
      features: this.features,
      unavailableCapabilities: this.unavailableCapabilities,
      availableTranslations: this.availableTranslations,
      authenticityChecks: this.authenticityChecks,
      bluetoothProps,
      thp: this.getDeviceThp()
    };
  }
}
exports.Device = Device;
//# sourceMappingURL=Device.js.map