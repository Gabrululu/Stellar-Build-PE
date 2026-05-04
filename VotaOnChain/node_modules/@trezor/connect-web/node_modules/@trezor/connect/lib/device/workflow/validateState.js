"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateState = void 0;
const constants_1 = require("../../constants");
const DataManager_1 = require("../../data/DataManager");
const events_1 = require("../../events");
const pathUtils_1 = require("../../utils/pathUtils");
const thp_1 = require("../thp");
const getStaticSessionId = device => device.getCurrentSession().typedCall('GetAddress', 'Address', {
  address_n: [(0, pathUtils_1.toHardened)(44), (0, pathUtils_1.toHardened)(1), (0, pathUtils_1.toHardened)(0), 0, 0],
  coin_name: 'Testnet',
  script_type: 'SPENDADDRESS'
}).then(({
  message
}) => `${message.address}@${device.features.device_id}:${device.getInstance()}`);
const preauthorizeState = ({
  device,
  method
}) => {
  if (!device.features.unlocked && method.preauthorized) {
    return device.getCommands().preauthorize(false);
  }
};
const isUnexpectedState = (expected, current) => expected && current && expected.split(':')[0] !== current.split(':')[0];
const getState = async context => {
  const {
    device
  } = context;
  if (!device.features) return;
  if (await preauthorizeState(context)) {
    return;
  }
  const expectedState = device.getState()?.staticSessionId;
  const uniqueState = await getStaticSessionId(device);
  if (device.features.session_id) {
    device.setState({
      sessionId: device.features.session_id
    });
  }
  if (isUnexpectedState(expectedState, uniqueState)) {
    return uniqueState;
  }
  if (!expectedState || expectedState !== uniqueState) {
    device.setState({
      staticSessionId: uniqueState
    });
  }
};
const MAX_PIN_TRIES = 3;
const getInvalidDeviceState = async context => {
  for (let i = 0; i < MAX_PIN_TRIES - 1; ++i) {
    try {
      return await getState(context);
    } catch (error) {
      if (error.message.includes('PIN invalid')) {
        context.method.postMessage((0, events_1.createUiMessage)(events_1.UI.INVALID_PIN, {
          device: context.device.toMessageObject()
        }));
      } else {
        throw error;
      }
    }
  }
  return getState(context).catch(error => {
    if (error.message.includes('PIN invalid')) {
      context.method.postMessage((0, events_1.createUiMessage)(events_1.UI.INVALID_PIN_ATTEMPTS_DEPLETED, {
        device: context.device.toMessageObject()
      }));
    }
    throw error;
  });
};
const getInvalidThpDeviceState = async context => {
  const {
    device,
    method
  } = context;
  const currentState = device.getState();
  const expectedState = currentState?.staticSessionId;
  const expectedSessionId = currentState?.sessionId ? Buffer.from(currentState.sessionId, 'hex') : undefined;
  if (await preauthorizeState(context)) {
    return;
  }
  let uniqueState;
  const thpState = device.getThpState();
  if (expectedSessionId) {
    thpState.setSessionId(expectedSessionId);
    uniqueState = await getStaticSessionId(device).catch(e => {
      switch (e.code) {
        case 'Failure_PinCancelled':
          throw e;
        case 'Failure_InvalidSession':
        default:
          return undefined;
      }
    });
    if (isUnexpectedState(expectedState, uniqueState)) {
      uniqueState = undefined;
    }
    if (!uniqueState) {
      device.setState({
        sessionId: undefined,
        deriveCardano: undefined
      });
      thpState?.setSessionId(Buffer.alloc(1));
    }
  }
  if (!uniqueState || !currentState?.deriveCardano && method.useCardanoDerivation) {
    const newSessionId = thpState.createNewSessionId();
    await (0, thp_1.createThpSession)(device, method.useCardanoDerivation);
    uniqueState = await getStaticSessionId(device);
    device.setState({
      sessionId: newSessionId.toString('hex'),
      deriveCardano: method.useCardanoDerivation
    });
  }
  if (isUnexpectedState(expectedState, uniqueState)) {
    return uniqueState;
  }
  if (!expectedState) {
    device.setState({
      staticSessionId: uniqueState
    });
  }
};
const validateState = async context => {
  const {
    device,
    method
  } = context;
  if (!method.useDeviceState) {
    return;
  }
  const validate = device.protocol.name === 'v2' ? getInvalidThpDeviceState : getInvalidDeviceState;
  const isDeviceUnlocked = device.features.unlocked;
  const isUsingPopup = DataManager_1.DataManager.getSettings('popup');
  try {
    let invalidDeviceState = await validate(context);
    if (isUsingPopup) {
      while (invalidDeviceState) {
        const uiPromise = method.createUiPromise(events_1.UI.INVALID_PASSPHRASE_ACTION, device);
        method.postMessage((0, events_1.createUiMessage)(events_1.UI.INVALID_PASSPHRASE, {
          device: device.toMessageObject()
        }));
        const uiResp = await uiPromise.promise;
        if (uiResp.payload) {
          device.setState({
            sessionId: undefined
          });
          await device.initialize(method.useCardanoDerivation);
          invalidDeviceState = await validate(context);
        } else {
          device.setState({
            staticSessionId: invalidDeviceState
          });
          break;
        }
      }
    } else if (invalidDeviceState) {
      throw constants_1.ERRORS.TypedError('Device_InvalidState');
    }
  } catch (error) {
    device.setState({
      sessionId: undefined
    });
    return Promise.reject(error);
  }
  if (!isDeviceUnlocked && device.features.unlocked) {
    method.postMessage((0, events_1.createDeviceMessage)(events_1.DEVICE.CHANGED, device.toMessageObject()));
  }
};
exports.validateState = validateState;
//# sourceMappingURL=validateState.js.map