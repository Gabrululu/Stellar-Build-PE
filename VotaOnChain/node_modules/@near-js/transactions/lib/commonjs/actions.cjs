"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Action = exports.SignedDelegate = exports.DeleteAccount = exports.DeleteKey = exports.AddKey = exports.Stake = exports.Transfer = exports.FunctionCall = exports.DeployContract = exports.CreateAccount = exports.AccessKey = exports.AccessKeyPermission = exports.FullAccessPermission = exports.FunctionCallPermission = void 0;
const types_1 = require("@near-js/types");
class FunctionCallPermission {
    allowance;
    receiverId;
    methodNames;
    constructor({ allowance, receiverId, methodNames }) {
        this.allowance = allowance;
        this.receiverId = receiverId;
        this.methodNames = methodNames;
    }
}
exports.FunctionCallPermission = FunctionCallPermission;
class FullAccessPermission {
}
exports.FullAccessPermission = FullAccessPermission;
class AccessKeyPermission extends types_1.Enum {
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
exports.AccessKeyPermission = AccessKeyPermission;
class AccessKey {
    nonce;
    permission;
    constructor({ nonce, permission }) {
        this.nonce = nonce;
        this.permission = permission;
    }
}
exports.AccessKey = AccessKey;
class CreateAccount {
}
exports.CreateAccount = CreateAccount;
class DeployContract {
    code;
    constructor({ code }) {
        this.code = code;
    }
}
exports.DeployContract = DeployContract;
class FunctionCall {
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
exports.FunctionCall = FunctionCall;
class Transfer {
    deposit;
    constructor({ deposit }) {
        this.deposit = deposit;
    }
}
exports.Transfer = Transfer;
class Stake {
    stake;
    publicKey;
    constructor({ stake, publicKey }) {
        this.stake = stake;
        this.publicKey = publicKey;
    }
}
exports.Stake = Stake;
class AddKey {
    publicKey;
    accessKey;
    constructor({ publicKey, accessKey }) {
        this.publicKey = publicKey;
        this.accessKey = accessKey;
    }
}
exports.AddKey = AddKey;
class DeleteKey {
    publicKey;
    constructor({ publicKey }) {
        this.publicKey = publicKey;
    }
}
exports.DeleteKey = DeleteKey;
class DeleteAccount {
    beneficiaryId;
    constructor({ beneficiaryId }) {
        this.beneficiaryId = beneficiaryId;
    }
}
exports.DeleteAccount = DeleteAccount;
class SignedDelegate {
    delegateAction;
    signature;
    constructor({ delegateAction, signature }) {
        this.delegateAction = delegateAction;
        this.signature = signature;
    }
}
exports.SignedDelegate = SignedDelegate;
/**
 * Contains a list of the valid transaction Actions available with this API
 * @see {@link https://nomicon.io/RuntimeSpec/Actions.html | Actions Spec}
 */
class Action extends types_1.Enum {
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
exports.Action = Action;
