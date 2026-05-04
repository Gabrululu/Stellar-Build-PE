"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyAuthenticityProof = exports.verifySignatureP256 = void 0;
const tslib_1 = require("tslib");
const ed25519_js_1 = require("@noble/curves/ed25519.js");
const crypto = tslib_1.__importStar(require("crypto"));
const crypto_utils_1 = require("@trezor/crypto-utils");
const utils_1 = require("@trezor/utils");
const utils_2 = require("./utils");
const x509certificate_1 = require("./x509certificate");
const verifySignatureP256 = async (rawKey, data, signature) => {
  const signer = crypto.createVerify('sha256');
  signer.update(Buffer.from(data));
  const SubtleCrypto = (0, crypto_utils_1.getSubtleCrypto)();
  try {
    const ecPubKey = await SubtleCrypto.importKey('raw', rawKey, {
      name: 'ECDSA',
      namedCurve: 'P-256'
    }, true, ['verify']);
    const spkiPubKey = await SubtleCrypto.exportKey('spki', ecPubKey);
    const key = `-----BEGIN PUBLIC KEY-----\n${Buffer.from(spkiPubKey).toString('base64')}\n-----END PUBLIC KEY-----`;
    return signer.verify({
      key
    }, Buffer.from(signature));
  } catch {
    return false;
  }
};
exports.verifySignatureP256 = verifySignatureP256;
const verifySignatureEd25519 = (rawKey, data, signature) => {
  try {
    return ed25519_js_1.ed25519.verify(signature, data, rawKey);
  } catch {
    return false;
  }
};
const getVerifyFn = algorithmName => {
  if (algorithmName === 'P-256') return exports.verifySignatureP256;
  if (algorithmName === 'Ed25519') return verifySignatureEd25519;
  throw new Error(`Unsupported signature algorithm.`);
};
const validateCaCertExtensions = (cert, pathLen) => {
  let hasKeyUsage,
    hasBasicConstraints = false;
  cert.tbsCertificate.extensions.forEach(ext => {
    if (ext.key === 'keyUsage') {
      if (ext.keyCertSign !== '1') {
        throw new Error(`CA keyCertSign not set`);
      }
      hasKeyUsage = true;
    } else if (ext.key === 'basicConstraints') {
      if (!ext.cA) {
        throw new Error(`CA basicConstraints.cA not set`);
      }
      if (typeof ext.pathLenConstraint != 'number') {
        throw new Error('CA basicConstraints.pathLenConstraint not set');
      }
      if (ext.pathLenConstraint < pathLen) {
        throw new Error('Issuer was not permitted to issue certificate');
      }
      hasBasicConstraints = true;
    } else if (ext.critical) {
      throw new Error(`Unknown critical extension ${ext.key} in CA certificate`);
    }
  });
  if (!hasKeyUsage || !hasBasicConstraints) {
    throw new Error(`CA missing extensions keyUsage: ${hasKeyUsage}, basicConstraints: ${hasBasicConstraints}`);
  }
};
const verifyAuthenticityProof = async ({
  challenge,
  certificates,
  signature,
  deviceModel,
  allowDebugKeys,
  config,
  blacklistConfig,
  challengePrefix = 'AuthenticateDevice:',
  bufferChunks = []
}) => {
  const allRootPubKeys = (0, utils_2.getRootPubKeys)({
    config,
    deviceModel,
    allowDebugKeys
  });
  const rootPubKeyBlacklist = (0, utils_2.getRootPubKeyBlacklist)({
    blacklistConfig,
    allowDebugKeys
  });
  const [deviceCert, caCert] = certificates.map((c, i) => {
    const cert = (0, x509certificate_1.parseCertificate)(new Uint8Array(Buffer.from(c, 'hex')));
    if (i === 0) {
      return cert;
    }
    validateCaCertExtensions(cert, i - 1);
    return cert;
  });
  const deviceCertAlgName = deviceCert.signatureAlgorithm.algorithmName;
  const caCertAlgName = caCert.signatureAlgorithm.algorithmName;
  if (deviceCertAlgName !== caCertAlgName) {
    throw new Error('Mismatched signature algorithms in device and CA certificates');
  }
  const verifySignatureFn = getVerifyFn(deviceCertAlgName);
  const caPubKey = Buffer.from(caCert.tbsCertificate.subjectPublicKeyInfo.bits.bytes).toString('hex');
  const isCertSignedByRootPubkey = await Promise.all(allRootPubKeys.map(rootPubKey => verifySignatureFn(Buffer.from(rootPubKey, 'hex'), caCert.tbsCertificate.asn1.raw, caCert.signatureValue.bits.bytes)));
  const rootPubKeyIndex = isCertSignedByRootPubkey.findIndex(valid => !!valid);
  const rootPubKeyMatch = allRootPubKeys[rootPubKeyIndex];
  const caCertValidityFrom = caCert.tbsCertificate.validity.from.getTime();
  if (caCertValidityFrom > new Date().getTime()) {
    throw new Error(`CA validity from ${caCertValidityFrom} can't be in the future!`);
  }
  if (rootPubKeyMatch === undefined) {
    return {
      valid: false,
      caPubKey,
      error: 'ROOT_PUBKEY_NOT_FOUND'
    };
  }
  const [subject] = deviceCert.tbsCertificate.subject;
  if (!subject.parameters || subject.algorithmOid !== '2.5.4.3') {
    throw new Error('Missing certificate subject');
  }
  const subjectValue = Buffer.from(subject.parameters.asn1.contents.subarray(0, 4)).toString();
  if (subjectValue !== deviceModel) {
    return {
      valid: false,
      caPubKey,
      rootPubKey: rootPubKeyMatch,
      error: 'INVALID_DEVICE_MODEL'
    };
  }
  const isDeviceCertValid = await verifySignatureFn(Buffer.from(caCert.tbsCertificate.subjectPublicKeyInfo.bits.bytes), deviceCert.tbsCertificate.asn1.raw, deviceCert.signatureValue.bits.bytes);
  const challengePrefixBuffer = Buffer.from(challengePrefix);
  const chunks = bufferChunks && bufferChunks.length > 0 ? [challengePrefixBuffer, ...bufferChunks] : [challengePrefixBuffer, challenge];
  const prefixedBuffer = Buffer.concat(chunks.flatMap(chunk => [utils_1.bufferUtils.getChunkSize(chunk.byteLength), chunk]));
  const isSignatureValid = await verifySignatureFn(Buffer.from(deviceCert.tbsCertificate.subjectPublicKeyInfo.bits.bytes), prefixedBuffer, Buffer.from(signature, 'hex'));
  if (isDeviceCertValid && isSignatureValid) {
    if (rootPubKeyBlacklist.includes(caPubKey)) {
      return {
        valid: false,
        caPubKey,
        rootPubKey: rootPubKeyMatch,
        error: 'CA_PUBKEY_BLACKLISTED'
      };
    }
    return {
      valid: true,
      caPubKey,
      rootPubKey: rootPubKeyMatch
    };
  }
  if (!isDeviceCertValid) {
    return {
      valid: false,
      caPubKey,
      rootPubKey: rootPubKeyMatch,
      error: 'INVALID_DEVICE_CERTIFICATE'
    };
  }
  return {
    valid: false,
    caPubKey,
    rootPubKey: rootPubKeyMatch,
    error: 'INVALID_DEVICE_SIGNATURE'
  };
};
exports.verifyAuthenticityProof = verifyAuthenticityProof;
//# sourceMappingURL=verifyAuthenticityProof.js.map