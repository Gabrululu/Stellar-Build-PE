"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseThpSettings = void 0;
const parseThpSettings = ({
  manifest,
  thp
}) => {
  const settings = {
    pairingMethods: []
  };
  if (Array.isArray(thp?.pairingMethods)) {
    settings.pairingMethods = thp.pairingMethods;
  } else {
    settings.pairingMethods = ['CodeEntry'];
  }
  if (typeof thp?.hostName === 'string') {
    settings.hostName = thp.hostName;
  }
  if (typeof thp?.appName === 'string') {
    settings.appName = thp.appName;
  } else if (typeof manifest?.appName === 'string') {
    settings.appName = manifest?.appName;
  }
  if (typeof thp?.staticKey === 'string') {
    settings.staticKey = thp.staticKey;
  }
  if (Array.isArray(thp?.knownCredentials)) {
    settings.knownCredentials = thp.knownCredentials.flatMap(k => {
      if (k && typeof k === 'object' && typeof k.credential === 'string' && typeof k.trezor_static_public_key === 'string') {
        return k;
      }
      return [];
    });
  }
  return settings;
};
exports.parseThpSettings = parseThpSettings;
//# sourceMappingURL=thpSettings.js.map