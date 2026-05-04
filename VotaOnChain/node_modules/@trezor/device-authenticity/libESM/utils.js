import * as crypto from "crypto";
export const getRandomChallenge = () => crypto.randomBytes(32);
export const getRootPubKeyBlacklist = ({
  blacklistConfig,
  allowDebugKeys
}) => {
  const normalBlacklist = blacklistConfig.blacklistedCaPubKeys ?? [];
  const debugBlacklist = blacklistConfig.debug?.blacklistedCaPubKeys ?? [];
  return allowDebugKeys ? normalBlacklist.concat(debugBlacklist) : normalBlacklist;
};
export const getRootPubKeys = ({
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
//# sourceMappingURL=utils.js.map