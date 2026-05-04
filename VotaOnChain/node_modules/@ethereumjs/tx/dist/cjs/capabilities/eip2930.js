"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDataGas = getDataGas;
exports.verifyAccessList = verifyAccessList;
const Legacy = require("./legacy.js");
const util_1 = require("@ethereumjs/util");
/**
 * The amount of gas paid for the data in this tx
 */
function getDataGas(tx) {
    const eip2930Gas = BigInt(getAccessListDataGas(tx));
    return Legacy.getDataGas(tx) + eip2930Gas;
}
/**
 * Calculates the data gas cost for the access list of a tx
 */
function getAccessListDataGas(tx) {
    const { common, accessList } = tx;
    const accessListStorageKeyCost = common.param('accessListStorageKeyGas');
    const accessListAddressCost = common.param('accessListAddressGas');
    const totalSlots = accessList.reduce((sum, item) => sum + item[1].length, 0);
    const addresses = accessList.length;
    return addresses * Number(accessListAddressCost) + totalSlots * Number(accessListStorageKeyCost);
}
/**
 * Verifies an access list. Throws if invalid.
 * @param tx - Transaction whose access list should be validated
 */
function verifyAccessList(tx) {
    const accessList = tx.accessList;
    for (const accessListItem of accessList) {
        if (accessListItem.length !== 2) {
            throw (0, util_1.EthereumJSErrorWithoutCode)('Invalid EIP-2930 transaction: access list item should have 2 elements');
        }
        const [address, storageSlots] = accessListItem;
        if (address.length !== 20) {
            throw (0, util_1.EthereumJSErrorWithoutCode)('Invalid EIP-2930 transaction: address length should be 20 bytes');
        }
        for (const slot of storageSlots) {
            if (slot.length !== 32) {
                throw (0, util_1.EthereumJSErrorWithoutCode)('Invalid EIP-2930 transaction: storage slot length should be 32 bytes');
            }
        }
    }
}
//# sourceMappingURL=eip2930.js.map