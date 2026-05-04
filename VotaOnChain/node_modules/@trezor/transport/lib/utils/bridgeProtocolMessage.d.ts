import type { ThpChannelState, TransportProtocol } from '@trezor/protocol';
import type { BridgeProtocolMessage } from '../types';
export declare function validateProtocolMessage(body: unknown, withData?: boolean): BridgeProtocolMessage;
export declare function createProtocolMessage(body: unknown, protocol?: TransportProtocol | TransportProtocol['name'], thpState?: ThpChannelState): string;
//# sourceMappingURL=bridgeProtocolMessage.d.ts.map