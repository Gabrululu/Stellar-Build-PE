import { Enum } from '@near-js/types';
export class FunctionCallPermission {
    allowance;
    receiverId;
    methodNames;
    constructor({ allowance, receiverId, methodNames }) {
        this.allowance = allowance;
        this.receiverId = receiverId;
        this.methodNames = methodNames;
    }
}
export class FullAccessPermission {
}
export class AccessKeyPermission extends Enum {
    enum;
    functionCall;
    fullAccess;
    constructor(props) {
        super(props);
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
            this.enum = k;
        }
    }
}
export class AccessKey {
    nonce;
    permission;
    constructor({ nonce, permission }) {
        this.nonce = nonce;
        this.permission = permission;
    }
}
export class CreateAccount {
}
export class DeployContract {
    code;
    constructor({ code }) {
        this.code = code;
    }
}
export class FunctionCall {
    methodName;
    args;
    gas;
    deposit;
    constructor({ methodName, args, gas, deposit }) {
        this.methodName = methodName;
        this.args = args;
        this.gas = gas;
        this.deposit = deposit;
    }
}
export class Transfer {
    deposit;
    constructor({ deposit }) {
        this.deposit = deposit;
    }
}
export class Stake {
    stake;
    publicKey;
    constructor({ stake, publicKey }) {
        this.stake = stake;
        this.publicKey = publicKey;
    }
}
export class AddKey {
    publicKey;
    accessKey;
    constructor({ publicKey, accessKey }) {
        this.publicKey = publicKey;
        this.accessKey = accessKey;
    }
}
export class DeleteKey {
    publicKey;
    constructor({ publicKey }) {
        this.publicKey = publicKey;
    }
}
export class DeleteAccount {
    beneficiaryId;
    constructor({ beneficiaryId }) {
        this.beneficiaryId = beneficiaryId;
    }
}
export class SignedDelegate {
    delegateAction;
    signature;
    constructor({ delegateAction, signature }) {
        this.delegateAction = delegateAction;
        this.signature = signature;
    }
}
/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
export class Action extends Enum {
    enum;
    createAccount;
    deployContract;
    functionCall;
    transfer;
    stake;
    addKey;
    deleteKey;
    deleteAccount;
    signedDelegate;
    constructor(props) {
        super(props);
        for (const [k, v] of Object.entries(props || {})) {
            this[k] = v;
            this.enum = k;
        }
    }
}
