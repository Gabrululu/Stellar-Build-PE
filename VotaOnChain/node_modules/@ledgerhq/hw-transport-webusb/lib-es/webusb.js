import { ledgerUSBVendorId } from "@ledgerhq/devices";
const ledgerDevices = [
    {
        vendorId: ledgerUSBVendorId,
    },
];
export async function requestLedgerDevice() {
    const device = await navigator.usb.requestDevice({
        filters: ledgerDevices,
    });
    return device;
}
export async function getLedgerDevices() {
    const devices = await navigator.usb.getDevices();
    return devices.filter(d => d.vendorId === ledgerUSBVendorId);
}
export async function getFirstLedgerDevice() {
    const existingDevices = await getLedgerDevices();
    if (existingDevices.length > 0)
        return existingDevices[0];
    return requestLedgerDevice();
}
export const isSupported = () => Promise.resolve(!!navigator && !!navigator.usb && typeof navigator.usb.getDevices === "function");
//# sourceMappingURL=webusb.js.map