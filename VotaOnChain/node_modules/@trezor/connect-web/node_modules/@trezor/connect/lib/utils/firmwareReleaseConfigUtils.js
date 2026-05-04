"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOnlyLocalFirmwareReleaseConfig = exports.getFirmwareReleaseConfig = void 0;
const jws_1 = require("jws");
const env_utils_1 = require("@trezor/env-utils");
const assetUtils_1 = require("./assetUtils");
const firmwareInfo_1 = require("../data/firmwareInfo");
const JWS_CONFIG = {
  SIGN_ALGORITHM: 'ES256',
  VERSION: 1,
  REMOTE_FILENAME: 'releases.v1.json',
  REQUEST_TIMEOUT_MS: 5000
};
const fetchRemoteJws = async () => {
  const {
    BASE_URL,
    MIDDLE_PATH,
    env
  } = (0, firmwareInfo_1.getOnlineFirmwareBaseUrl)();
  const path = `${MIDDLE_PATH}/${env === 'production' ? 'config/' : ''}${JWS_CONFIG.REMOTE_FILENAME}`;
  const remoteReleasesUrl = new URL(path, BASE_URL);
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort('Request timed out'), JWS_CONFIG.REQUEST_TIMEOUT_MS);
    const response = await fetch(remoteReleasesUrl.toString(), {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    if (typeof data.jws !== 'string') {
      throw new Error('Invalid response format: "jws" property missing or not a string.');
    }
    return {
      jws: data.jws,
      env
    };
  } catch (error) {
    throw new Error(`Failed to fetch remote JWS: ${error instanceof Error ? error.message : String(error)}`);
  }
};
const verifyAndDecodeJws = (jws, publicKey) => {
  const decoded = (0, jws_1.decode)(jws);
  if (!decoded || !decoded.payload || !decoded.header) {
    throw new Error('Invalid JWS structure.');
  }
  const parsedPayload = JSON.parse(decoded.payload);
  if (decoded.header.alg !== JWS_CONFIG.SIGN_ALGORITHM) {
    throw new Error('Invalid JWS algorithm');
  }
  if (parsedPayload.version !== JWS_CONFIG.VERSION) {
    throw new Error('Config version mismatch.');
  }
  if (!(0, jws_1.verify)(jws, JWS_CONFIG.SIGN_ALGORITHM, publicKey)) {
    throw new Error('JWS signature is invalid.');
  }
  return parsedPayload;
};
const getFirmwareReleaseConfig = async () => {
  try {
    const {
      jws,
      env
    } = await fetchRemoteJws();
    const useProductionKey = ['test-signed', 'production'].includes(env);
    const publicKey = (0, env_utils_1.getFirmwareReleaseJwsPublicKey)(useProductionKey);
    const remoteConfig = verifyAndDecodeJws(jws, publicKey);
    if (remoteConfig.sequence > assetUtils_1.firmwareReleaseConfigAssets.sequence) {
      return {
        config: remoteConfig,
        isRemote: true
      };
    }
  } catch {}
  return {
    config: assetUtils_1.firmwareReleaseConfigAssets,
    isRemote: false
  };
};
exports.getFirmwareReleaseConfig = getFirmwareReleaseConfig;
const getOnlyLocalFirmwareReleaseConfig = () => ({
  config: assetUtils_1.firmwareReleaseConfigAssets,
  isRemote: false
});
exports.getOnlyLocalFirmwareReleaseConfig = getOnlyLocalFirmwareReleaseConfig;
//# sourceMappingURL=firmwareReleaseConfigUtils.js.map