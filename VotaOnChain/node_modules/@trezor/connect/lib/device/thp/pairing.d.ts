import { thp as protocolThp } from '@trezor/protocol';
import type { Device } from '../Device';
export declare const getThpCredentials: (device: Device, autoconnect?: boolean) => Promise<{
    autoconnect: boolean;
    trezor_static_public_key: string;
    credential: string;
}>;
export declare const thpPairingEnd: (device: Device) => Promise<{
    type: "ThpEndResponse";
    message: protocolThp.ThpEndResponse;
}>;
export declare const thpPairing: (device: Device) => Promise<{
    type: "ThpEndResponse";
    message: protocolThp.ThpEndResponse;
} | undefined>;
//# sourceMappingURL=pairing.d.ts.map