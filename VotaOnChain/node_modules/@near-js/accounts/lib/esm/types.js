export var MultisigDeleteRequestRejectionError;
(function (MultisigDeleteRequestRejectionError) {
    MultisigDeleteRequestRejectionError["CANNOT_DESERIALIZE_STATE"] = "Cannot deserialize the contract state";
    MultisigDeleteRequestRejectionError["MULTISIG_NOT_INITIALIZED"] = "Smart contract panicked: Multisig contract should be initialized before usage";
    MultisigDeleteRequestRejectionError["NO_SUCH_REQUEST"] = "Smart contract panicked: panicked at 'No such request: either wrong number or already confirmed'";
    MultisigDeleteRequestRejectionError["REQUEST_COOLDOWN_ERROR"] = "Request cannot be deleted immediately after creation.";
    MultisigDeleteRequestRejectionError["METHOD_NOT_FOUND"] = "Contract method is not found";
})(MultisigDeleteRequestRejectionError || (MultisigDeleteRequestRejectionError = {}));
export var MultisigStateStatus;
(function (MultisigStateStatus) {
    MultisigStateStatus[MultisigStateStatus["INVALID_STATE"] = 0] = "INVALID_STATE";
    MultisigStateStatus[MultisigStateStatus["STATE_NOT_INITIALIZED"] = 1] = "STATE_NOT_INITIALIZED";
    MultisigStateStatus[MultisigStateStatus["VALID_STATE"] = 2] = "VALID_STATE";
    MultisigStateStatus[MultisigStateStatus["UNKNOWN_STATE"] = 3] = "UNKNOWN_STATE";
})(MultisigStateStatus || (MultisigStateStatus = {}));
