"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRootPubKeys = exports.getRootPubKeyBlacklist = exports.getRandomChallenge = void 0;
const tslib_1 = require("tslib");
const crypto = tslib_1.__importStar(require("crypto"));
const getRandomChallenge = () => crypto.randomBytes(32);
exports.getRandomChallenge = getRandomChallenge;
const getRootPubKeyBlacklist = ({
  blacklistConfig,
  allowDebugKeys
}) => {
  const normalBlacklist = blacklistConfig.blacklistedCaPubKeys ?? [];
  const debugBlacklist = blacklistConfig.debug?.blacklistedCaPubKeys ?? [];
  return allowDebugKeys ? normalBlacklist.concat(debugBlacklist) : normalBlacklist;
};
exports.getRootPubKeyBlacklist = getRootPubKeyBlacklist;
const getRootPubKeys = ({
  config,
  deviceModel,
  allowDebugKeys
}) => {
  const modelConfig = config[deviceModel];
  if (modelConfig === undefined) {
    throw new Error(`Pubkeys for ${deviceModel} not found in config`);
  }
  const rootPubKeysNormalOptiga = modelConfig.rootPubKeysOptiga ?? [];
  const rootPubKeysNormalTropic = modelConfig.rootPubKeysTropic ?? [];
  const rootPubKeysDebugOptiga = modelConfig.debug?.rootPubKeysOptiga ?? [];
  const rootPubKeysDebugTropic = modelConfig.debug?.rootPubKeysTropic ?? [];
  const rootPubKeysNormal = [...rootPubKeysNormalOptiga, ...rootPubKeysNormalTropic];
  if (!allowDebugKeys) return rootPubKeysNormal;
  return [...rootPubKeysNormal, ...rootPubKeysDebugOptiga, ...rootPubKeysDebugTropic];
};
exports.getRootPubKeys = getRootPubKeys;
//# sourceMappingURL=utils.js.map