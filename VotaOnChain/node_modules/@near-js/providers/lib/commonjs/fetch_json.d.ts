export declare function retryConfig(numOfAttempts?: number, timeMultiple?: number, startingDelay?: number): {
    numOfAttempts: number;
    timeMultiple: number;
    startingDelay: number;
    retry: (e: ProviderError) => boolean;
};
export interface ConnectionInfo {
    url: string;
    headers?: {
        [key: string]: string | number;
    };
}
export declare class ProviderError extends Error {
    cause: number;
    constructor(message: string, options: any);
}
interface JsonRpcRequest {
    id: number;
    jsonrpc: string;
    method: string;
    params: object;
}
/**
 * Performs an HTTP request to an RPC endpoint
 * @param url URL for the HTTP request
 * @param json Request body
 * @param headers HTTP headers to include with the request
 * @returns Promise<any> }arsed JSON response from the HTTP request.
 */
export declare function fetchJsonRpc(url: string, json: JsonRpcRequest, headers: object, retryConfig: object): Promise<any>;
export {};
//# sourceMappingURL=fetch_json.d.ts.map