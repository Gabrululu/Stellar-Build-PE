"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchJsonRpc = exports.ProviderError = exports.retryConfig = void 0;
const types_1 = require("@near-js/types");
const exponential_backoff_1 = require("exponential-backoff");
const BACKOFF_MULTIPLIER = 1.5;
const RETRY_NUMBER = 10;
const RETRY_DELAY = 0;
function retryConfig(numOfAttempts = RETRY_NUMBER, timeMultiple = BACKOFF_MULTIPLIER, startingDelay = RETRY_DELAY) {
    return {
        numOfAttempts: numOfAttempts,
        timeMultiple: timeMultiple,
        startingDelay: startingDelay,
        retry: (e) => {
            if ([503, 500, 408].includes(e.cause)) {
                return true;
            }
            if (e.toString().includes('FetchError') || e.toString().includes('Failed to fetch')) {
                return true;
            }
            return false;
        }
    };
}
exports.retryConfig = retryConfig;
class ProviderError extends Error {
    cause;
    constructor(message, options) {
        super(message, options);
        if (options.cause) {
            this.cause = options.cause;
        }
    }
}
exports.ProviderError = ProviderError;
/**
 * Performs an HTTP request to an RPC endpoint
 * @param url URL for the HTTP request
 * @param json Request body
 * @param headers HTTP headers to include with the request
 * @returns Promise<any> }arsed JSON response from the HTTP request.
 */
async function fetchJsonRpc(url, json, headers, retryConfig) {
    const response = await (0, exponential_backoff_1.backOff)(async () => {
        const res = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(json),
            headers: { ...headers, 'Content-Type': 'application/json' }
        });
        const { ok, status } = res;
        if (status === 500) {
            throw new ProviderError('Internal server error', { cause: status });
        }
        else if (status === 408) {
            throw new ProviderError('Timeout error', { cause: status });
        }
        else if (status === 400) {
            throw new ProviderError('Request validation error', { cause: status });
        }
        else if (status === 503) {
            throw new ProviderError(`${url} unavailable`, { cause: status });
        }
        if (!ok) {
            throw new ProviderError(await res.text(), { cause: status });
        }
        return res;
    }, retryConfig);
    if (!response) {
        throw new types_1.TypedError(`Exceeded ${RETRY_NUMBER} attempts for ${url}.`, 'RetriesExceeded');
    }
    return await response.json();
}
exports.fetchJsonRpc = fetchJsonRpc;
