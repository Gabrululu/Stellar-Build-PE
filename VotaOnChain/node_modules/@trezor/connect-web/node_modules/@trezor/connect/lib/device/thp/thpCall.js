"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.abortThpWorkflow = exports.thpCall = void 0;
const errors_1 = require("../../constants/errors");
const events_1 = require("../../events");
const thpCall = async (device, name, data) => {
  const thpState = device.getThpState();
  if (!thpState) {
    throw (0, errors_1.TypedError)('Device_ThpStateMissing');
  }
  const result = await device.getCurrentSession().call(name, data);
  if (!result.success) {
    throw result.error;
  }
  thpState.setCancelablePromise(false);
  if (result.payload.type === 'ButtonRequest') {
    thpState.setCancelablePromise(true);
    if (result.payload.message.code === 'ButtonRequest_PassphraseEntry') {
      device.emit(events_1.DEVICE.PASSPHRASE_ON_DEVICE);
    } else {
      device.emit(events_1.DEVICE.BUTTON, {
        device,
        payload: result.payload.message
      });
    }
    return (0, exports.thpCall)(device, 'ButtonAck', {});
  }
  if (result.payload.type === 'Failure') {
    const {
      code,
      message
    } = result.payload.message;
    throw (0, errors_1.TypedError)(code || 'Failure_UnknownCode', message);
  }
  if (result.payload.type === 'ThpError') {
    const {
      code,
      message
    } = result.payload.message;
    throw (0, errors_1.TypedError)(code, message);
  }
  return result.payload;
};
exports.thpCall = thpCall;
const abortThpWorkflow = async device => {
  const thpState = device.getThpState();
  if (!thpState || !device.currentRun) {
    return Promise.resolve();
  }
  if (thpState.pairingTagPromise) {
    await thpState.pairingTagPromise.abort();
    await device.getCurrentSession().cancelCall();
    thpState.resetState();
  } else if (thpState.cancelablePromise) {
    thpState.sync('send', 'Cancel');
    await device.getCurrentSession().send('Cancel', {});
    await device.currentRun;
  }
};
exports.abortThpWorkflow = abortThpWorkflow;
//# sourceMappingURL=thpCall.js.map