"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSupported = exports.getFirstLedgerDevice = exports.getLedgerDevices = exports.requestLedgerDevice = void 0;
const devices_1 = require("@ledgerhq/devices");
const ledgerDevices = [
    {
        vendorId: devices_1.ledgerUSBVendorId,
    },
];
async function requestLedgerDevice() {
    const device = await navigator.usb.requestDevice({
        filters: ledgerDevices,
    });
    return device;
}
exports.requestLedgerDevice = requestLedgerDevice;
async function getLedgerDevices() {
    const devices = await navigator.usb.getDevices();
    return devices.filter(d => d.vendorId === devices_1.ledgerUSBVendorId);
}
exports.getLedgerDevices = getLedgerDevices;
async function getFirstLedgerDevice() {
    const existingDevices = await getLedgerDevices();
    if (existingDevices.length > 0)
        return existingDevices[0];
    return requestLedgerDevice();
}
exports.getFirstLedgerDevice = getFirstLedgerDevice;
const isSupported = () => Promise.resolve(!!navigator && !!navigator.usb && typeof navigator.usb.getDevices === "function");
exports.isSupported = isSupported;
//# sourceMappingURL=webusb.js.map