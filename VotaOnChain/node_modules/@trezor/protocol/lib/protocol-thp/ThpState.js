"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThpState = void 0;
const messages_1 = require("./messages");
class ThpState {
  _properties;
  _pairingCredentials = [];
  _phase = 'handshake';
  _isPaired = false;
  _pairingTagPromise;
  _cancelablePromise = false;
  _handshakeCredentials;
  _channel = Buffer.alloc(0);
  _sendBit = 0;
  _sendAckBit = 0;
  _sendNonce = 0;
  _recvBit = 0;
  _recvAckBit = 0;
  _recvNonce = 1;
  _expectedResponses = [];
  _selectedMethod;
  _nfcSecret;
  _sessionId = Buffer.alloc(1);
  _sessionIdCounter = 0;
  get pairingTagPromise() {
    return this._pairingTagPromise;
  }
  setPairingTagPromise(p) {
    this._pairingTagPromise = p;
  }
  get cancelablePromise() {
    return this._cancelablePromise;
  }
  setCancelablePromise(p) {
    this._cancelablePromise = p;
  }
  get properties() {
    return this._properties;
  }
  setThpProperties(props) {
    this._properties = props;
  }
  get phase() {
    return this._phase;
  }
  setPhase(phase) {
    this._phase = phase;
  }
  get isPaired() {
    return this._isPaired;
  }
  get isAutoconnectPaired() {
    return this._isPaired && this._pairingCredentials[0]?.autoconnect;
  }
  setIsPaired(isPaired) {
    this._isPaired = isPaired;
  }
  get pairingMethod() {
    return this._selectedMethod;
  }
  setPairingMethod(method) {
    this._selectedMethod = method;
  }
  get pairingCredentials() {
    return this._pairingCredentials;
  }
  setPairingCredentials(credentials) {
    if (credentials) {
      this._pairingCredentials.push(...credentials);
    } else {
      this._pairingCredentials = [];
    }
  }
  removePairingCredential({
    credential
  }) {
    const index = this._pairingCredentials.findIndex(c => c.credential === credential);
    if (index >= 0) this._pairingCredentials.splice(index, 1);
  }
  setNfcSecret(secret) {
    this._nfcSecret = secret;
  }
  get nfcSecret() {
    return this._nfcSecret;
  }
  get nfcData() {
    if (this._selectedMethod === messages_1.ThpPairingMethod.NFC && this._nfcSecret) {
      return Buffer.concat([this._nfcSecret, this.handshakeCredentials.handshakeHash.subarray(0, 16)]);
    }
  }
  get channel() {
    return this._channel;
  }
  setChannel(channel) {
    this._channel = channel;
  }
  get sendBit() {
    return this._sendBit;
  }
  get sendAckBit() {
    return this._sendAckBit;
  }
  get sendNonce() {
    return this._sendNonce;
  }
  get recvBit() {
    return this._recvBit;
  }
  get recvAckBit() {
    return this._recvAckBit;
  }
  get recvNonce() {
    return this._recvNonce;
  }
  updateAckBit(type) {
    if (type === 'send') {
      this._sendAckBit = this._sendAckBit > 0 ? 0 : 1;
    } else {
      this._recvAckBit = this._recvAckBit > 0 ? 0 : 1;
    }
  }
  updateSyncBit(type) {
    if (type === 'send') {
      this._sendBit = this._sendBit > 0 ? 0 : 1;
    } else {
      this._recvBit = this._recvBit > 0 ? 0 : 1;
    }
  }
  updateNonce(type) {
    if (type === 'send') {
      this._sendNonce += 1;
    } else {
      this._recvNonce += 1;
    }
  }
  sync(type, messageType) {
    const updateSyncBit = !['ThpCreateChannelRequest', 'ThpCreateChannelResponse'].includes(messageType);
    if (updateSyncBit) {
      this.updateAckBit(type);
      this.updateSyncBit(type);
    }
    const updateNonce = updateSyncBit && !['ThpHandshakeInitRequest', 'ThpHandshakeInitResponse', 'ThpHandshakeCompletionRequest', 'ThpHandshakeCompletionResponse'].includes(messageType);
    if (updateNonce) {
      this.updateNonce(type);
    }
  }
  get handshakeCredentials() {
    return this._handshakeCredentials;
  }
  updateHandshakeCredentials(newCredentials) {
    if (!this._handshakeCredentials) {
      this._handshakeCredentials = {
        pairingMethods: [],
        handshakeHash: Buffer.alloc(0),
        handshakeCommitment: Buffer.alloc(0),
        codeEntryChallenge: Buffer.alloc(0),
        trezorEncryptedStaticPubkey: Buffer.alloc(0),
        hostEncryptedStaticPubkey: Buffer.alloc(0),
        staticKey: Buffer.alloc(0),
        hostStaticPublicKey: Buffer.alloc(0),
        hostKey: Buffer.alloc(0),
        trezorKey: Buffer.alloc(0),
        trezorCpacePublicKey: Buffer.alloc(0)
      };
    }
    this._handshakeCredentials = {
      ...this._handshakeCredentials,
      ...newCredentials
    };
  }
  get sessionId() {
    return this._sessionId;
  }
  createNewSessionId() {
    this._sessionIdCounter++;
    if (this._sessionIdCounter > 255) {
      this._sessionIdCounter = 1;
    }
    const sessionId = Buffer.alloc(1);
    sessionId.writeUint8(this._sessionIdCounter, 0);
    this.setSessionId(sessionId);
    return sessionId;
  }
  setSessionId(sessionId) {
    this._sessionId = sessionId;
  }
  serialize() {
    return {
      properties: this._properties,
      channel: this.channel.toString('hex'),
      sendBit: this.sendBit,
      recvBit: this.recvBit,
      sendAckBit: this.sendAckBit,
      recvAckBit: this.recvAckBit,
      sendNonce: this.sendNonce,
      recvNonce: this.recvNonce,
      expectedResponses: this._expectedResponses.slice(0),
      credentials: this._pairingCredentials.slice(0)
    };
  }
  deserialize(json) {
    const error = new Error('ThpState.deserialize invalid state');
    if (!json || typeof json !== 'object') {
      throw error;
    }
    if (!Array.isArray(json.expectedResponses)) {
      throw error;
    }
    if (typeof json.channel !== 'string') {
      throw error;
    }
    [json.sendBit, json.recvBit, json.sendAckBit, json.recvAckBit, json.sendNonce, json.recvNonce, ...json.expectedResponses].forEach(nr => {
      if (typeof nr !== 'number') {
        throw error;
      }
    });
    this._channel = Buffer.from(json.channel, 'hex');
    this._expectedResponses = json.expectedResponses;
    this._sendBit = json.sendBit;
    this._recvBit = json.recvBit;
    this._sendAckBit = json.sendAckBit;
    this._recvAckBit = json.recvAckBit;
    this._sendNonce = json.sendNonce;
    this._recvNonce = json.recvNonce;
  }
  get expectedResponses() {
    return this._expectedResponses;
  }
  setExpectedResponses(expected) {
    this._expectedResponses = expected;
  }
  resetState() {
    this._phase = 'handshake';
    this._isPaired = false;
    this._pairingTagPromise = undefined;
    this._cancelablePromise = false;
    this._handshakeCredentials = undefined;
    this._channel = Buffer.alloc(0);
    this._sendBit = 0;
    this._sendAckBit = 0;
    this._sendNonce = 0;
    this._recvBit = 0;
    this._recvAckBit = 0;
    this._recvNonce = 1;
    this._expectedResponses = [];
    this._pairingCredentials = [];
    this._selectedMethod = undefined;
    this._nfcSecret = undefined;
    this._sessionId = Buffer.alloc(1);
    this._sessionIdCounter = 0;
  }
  toString() {
    return JSON.stringify(this.serialize());
  }
}
exports.ThpState = ThpState;
//# sourceMappingURL=ThpState.js.map