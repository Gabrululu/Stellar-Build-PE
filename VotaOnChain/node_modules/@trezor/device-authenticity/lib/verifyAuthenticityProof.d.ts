import { VerifyAuthenticityProofParams, VerifyAuthenticityProofResult, VerifySignature } from './types';
export declare const verifySignatureP256: VerifySignature;
export declare const verifyAuthenticityProof: ({ challenge, certificates, signature, deviceModel, allowDebugKeys, config, blacklistConfig, challengePrefix, bufferChunks, }: VerifyAuthenticityProofParams) => Promise<VerifyAuthenticityProofResult>;
//# sourceMappingURL=verifyAuthenticityProof.d.ts.map