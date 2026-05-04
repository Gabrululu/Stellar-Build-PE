import { getPublicKey } from "./getPublicKey";
import { signTransaction } from "./signTransaction";
import { isConnected } from "./isConnected";
import { signMessage } from "./signMessage";
export declare const isBrowser: boolean;
export { getPublicKey, signTransaction, isConnected, signMessage };
declare const _default: {
    getPublicKey: () => Promise<string>;
    signTransaction: (transactionXdr: string) => Promise<string>;
    isConnected: () => Promise<boolean>;
    signMessage: (message: string) => Promise<{
        signedMessage: string;
        signerAddress: string;
    } | null>;
};
export default _default;
