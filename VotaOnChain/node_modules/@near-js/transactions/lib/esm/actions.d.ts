import { PublicKey } from '@near-js/crypto';
import { Enum } from '@near-js/types';
import { DelegateAction } from './delegate';
import { Signature } from './signature';
export declare class FunctionCallPermission {
    allowance?: bigint;
    receiverId: string;
    methodNames: string[];
    constructor({ allowance, receiverId, methodNames }: {
        allowance: bigint;
        receiverId: string;
        methodNames: string[];
    });
}
export declare class FullAccessPermission {
}
export declare class AccessKeyPermission extends Enum {
    enum: string;
    functionCall?: FunctionCallPermission;
    fullAccess?: FullAccessPermission;
    constructor(props: any);
}
export declare class AccessKey {
    nonce: bigint;
    permission: AccessKeyPermission;
    constructor({ nonce, permission }: {
        nonce: bigint;
        permission: AccessKeyPermission;
    });
}
export declare class CreateAccount {
}
export declare class DeployContract {
    code: Uint8Array;
    constructor({ code }: {
        code: Uint8Array;
    });
}
export declare class FunctionCall {
    methodName: string;
    args: Uint8Array;
    gas: bigint;
    deposit: bigint;
    constructor({ methodName, args, gas, deposit }: {
        methodName: string;
        args: Uint8Array;
        gas: bigint;
        deposit: bigint;
    });
}
export declare class Transfer {
    deposit: bigint;
    constructor({ deposit }: {
        deposit: bigint;
    });
}
export declare class Stake {
    stake: bigint;
    publicKey: PublicKey;
    constructor({ stake, publicKey }: {
        stake: bigint;
        publicKey: PublicKey;
    });
}
export declare class AddKey {
    publicKey: PublicKey;
    accessKey: AccessKey;
    constructor({ publicKey, accessKey }: {
        publicKey: PublicKey;
        accessKey: AccessKey;
    });
}
export declare class DeleteKey {
    publicKey: PublicKey;
    constructor({ publicKey }: {
        publicKey: PublicKey;
    });
}
export declare class DeleteAccount {
    beneficiaryId: string;
    constructor({ beneficiaryId }: {
        beneficiaryId: string;
    });
}
export declare class SignedDelegate {
    delegateAction: DelegateAction;
    signature: Signature;
    constructor({ delegateAction, signature }: {
        delegateAction: DelegateAction;
        signature: Signature;
    });
}
/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export declare class Action extends Enum {
    enum: string;
    createAccount?: CreateAccount;
    deployContract?: DeployContract;
    functionCall?: FunctionCall;
    transfer?: Transfer;
    stake?: Stake;
    addKey?: AddKey;
    deleteKey?: DeleteKey;
    deleteAccount?: DeleteAccount;
    signedDelegate?: SignedDelegate;
    constructor(props: any);
}
//# sourceMappingURL=actions.d.ts.map