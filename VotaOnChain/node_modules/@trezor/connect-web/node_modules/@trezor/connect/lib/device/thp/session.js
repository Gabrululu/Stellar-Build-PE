"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createThpSession = void 0;
const thpCall_1 = require("./thpCall");
const createThpSession = async (device, deriveCardano) => {
  let passphrase;
  if (device.features.passphrase_protection === false) {
    passphrase = {
      passphrase: ''
    };
  } else {
    passphrase = await device.prompt('passphrase', {}).then(promptRes => {
      if (!promptRes.success) {
        return {
          passphrase: ''
        };
      }
      return promptRes.payload.passphraseOnDevice ? {
        on_device: true
      } : {
        passphrase: promptRes.payload.value.normalize('NFKD')
      };
    });
  }
  await (0, thpCall_1.thpCall)(device, 'ThpCreateNewSession', {
    ...passphrase,
    derive_cardano: deriveCardano
  });
  return 0;
};
exports.createThpSession = createThpSession;
//# sourceMappingURL=session.js.map