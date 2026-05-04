export declare function curve25519(privateKey: Uint8Array, publicKey: Uint8Array): Buffer;
export declare function elligator2(point: Uint8Array): Uint8Array;
export declare const getCurve25519KeyPair: (randomBytes: Buffer) => {
    publicKey: Buffer<ArrayBufferLike>;
    privateKey: Buffer<ArrayBuffer>;
};
//# sourceMappingURL=curve25519.d.ts.map