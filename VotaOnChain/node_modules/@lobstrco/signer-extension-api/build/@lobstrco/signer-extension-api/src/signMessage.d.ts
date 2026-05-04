export declare const signMessage: (message: string) => Promise<{
    signedMessage: string;
    signerAddress: string;
} | null>;
