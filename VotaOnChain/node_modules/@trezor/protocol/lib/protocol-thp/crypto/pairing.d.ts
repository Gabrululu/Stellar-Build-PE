import { getCurve25519KeyPair } from './curve25519';
import { ThpState } from '../ThpState';
import { ThpCredentialResponse, ThpHandshakeCredentials, ThpHandshakeInitResponse } from '../messages';
export declare const getHandshakeHash: (deviceProperties: Buffer) => Buffer<ArrayBufferLike>;
export declare const findKnownPairingCredentials: (knownCredentials: ThpCredentialResponse[], trezorMaskedStaticPubkey: Buffer, trezorEphemeralPubkey: Buffer) => ThpCredentialResponse[];
export declare const getTrezorState: (credentials: ThpHandshakeCredentials, payload: Buffer) => 0 | 1;
type Curve25519KeyPair = ReturnType<typeof getCurve25519KeyPair>;
export declare const handleHandshakeInit: ({ handshakeInitResponse, thpState, knownCredentials, hostStaticKeys, hostEphemeralKeys, tryToUnlock, protobufEncoder, }: {
    handshakeInitResponse: ThpHandshakeInitResponse;
    thpState: ThpState;
    knownCredentials: ThpCredentialResponse[];
    hostEphemeralKeys: Curve25519KeyPair;
    hostStaticKeys: Curve25519KeyPair;
    tryToUnlock: 0 | 1;
    protobufEncoder: (name: string, data: Record<string, unknown>) => {
        message: Buffer;
    };
}) => {
    trezorMaskedStaticPubkey: Buffer<ArrayBuffer>;
    trezorEncryptedStaticPubkey: Buffer<ArrayBufferLike>;
    hostEncryptedStaticPubkey: Buffer<ArrayBuffer>;
    hostKey: Buffer<ArrayBufferLike>;
    trezorKey: Buffer<ArrayBufferLike>;
    handshakeHash: Buffer<ArrayBufferLike>;
    credentials: ThpCredentialResponse | undefined;
    allCredentials: ThpCredentialResponse[];
    encryptedPayload: Buffer<ArrayBuffer>;
};
export declare const getCpaceHostKeys: (code: Buffer, handshakeHash: Buffer) => {
    privateKey: Buffer<ArrayBufferLike>;
    publicKey: Buffer<ArrayBufferLike>;
};
export declare const getSharedSecret: (publicKey: Buffer, privateKey: Buffer) => Buffer<ArrayBufferLike>;
export declare const validateCodeEntryTag: (credentials: ThpHandshakeCredentials, value: string, secret: string) => void;
export declare const validateQrCodeTag: ({ handshakeHash }: ThpHandshakeCredentials, value: string, secret: string) => void;
export declare const validateNfcTag: ({ handshakeHash }: ThpHandshakeCredentials, value: string, secret: Buffer) => void;
export {};
//# sourceMappingURL=pairing.d.ts.map