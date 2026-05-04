"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThpChannel = exports.createThpSession = exports.getThpCredentials = exports.abortThpWorkflow = void 0;
const device_1 = require("../../events/device");
const handshake_1 = require("./handshake");
const pairing_1 = require("./pairing");
var thpCall_1 = require("./thpCall");
Object.defineProperty(exports, "abortThpWorkflow", {
  enumerable: true,
  get: function () {
    return thpCall_1.abortThpWorkflow;
  }
});
var pairing_2 = require("./pairing");
Object.defineProperty(exports, "getThpCredentials", {
  enumerable: true,
  get: function () {
    return pairing_2.getThpCredentials;
  }
});
var session_1 = require("./session");
Object.defineProperty(exports, "createThpSession", {
  enumerable: true,
  get: function () {
    return session_1.createThpSession;
  }
});
const getThpChannel = async (device, withInteraction) => {
  const thpState = device.getThpState();
  if (!thpState) return;
  try {
    if (thpState.phase === 'handshake') {
      await (0, handshake_1.createThpChannel)(device);
      try {
        await (0, handshake_1.thpHandshake)(device);
      } catch (error) {
        const isPinLocked = error.code === 'ThpDeviceLocked';
        const isTransportBusy = error.message === 'ThpTransportBusy';
        if (!isPinLocked && !isTransportBusy) throw error;
        thpState.resetState();
        if (isPinLocked && !withInteraction) return 'pin-locked';
        if (isPinLocked) {
          device.emit(device_1.DEVICE.BUTTON, {
            device,
            payload: {
              code: 'ButtonRequest_PinEntry'
            }
          });
        }
        await (0, handshake_1.createThpChannel)(device);
        await (0, handshake_1.thpHandshake)(device, isPinLocked);
      }
    }
    if (thpState.phase === 'pairing' && withInteraction) {
      await (0, pairing_1.thpPairing)(device);
    }
    if (thpState.phase !== 'paired') {
      return 'thp-locked';
    }
  } catch (error) {
    thpState.resetState();
    throw error;
  }
};
exports.getThpChannel = getThpChannel;
//# sourceMappingURL=index.js.map