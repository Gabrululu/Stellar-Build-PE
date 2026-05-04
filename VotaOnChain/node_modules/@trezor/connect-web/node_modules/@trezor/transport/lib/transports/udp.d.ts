import { AbstractTransportParams } from './abstract';
import { AbstractApiTransport } from './abstractApi';
export declare class UdpTransport extends AbstractApiTransport {
    name: "UdpTransport";
    private enumerateTimeout;
    constructor(params: AbstractTransportParams);
    stop(): void;
}
//# sourceMappingURL=udp.d.ts.map