import { ClusterUrl, RpcTransportFromClusterUrl } from '@solana/kit';
export type ThrottledTransportOptions = {
    maxRps?: number;
    interval?: number;
    debug?: boolean;
};
export declare const getThrottledTransport: <TClusterUrl extends ClusterUrl>(originalTransport: RpcTransportFromClusterUrl<TClusterUrl>, { maxRps, interval, debug, }?: ThrottledTransportOptions) => RpcTransportFromClusterUrl<TClusterUrl>;
//# sourceMappingURL=getThrottledTransport.d.ts.map