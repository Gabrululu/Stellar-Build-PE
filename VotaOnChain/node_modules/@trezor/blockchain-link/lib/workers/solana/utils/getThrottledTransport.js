"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getThrottledTransport = void 0;
const DEFAULT_MAX_RPS = 4;
const DEFAULT_INTERVAL = 1000;
const getThrottledTransport = (originalTransport, {
  maxRps = DEFAULT_MAX_RPS,
  interval = DEFAULT_INTERVAL,
  debug = false
} = {}) => {
  let requestBudgetRemaining = maxRps;
  let pendingQueueRunTimerId;
  const queuedRequests = [];
  const processQueue = () => {
    if (requestBudgetRemaining === 0) {
      return;
    }
    if (debug) {
      console.warn('[transport] Processing request queue', {
        numQueuedRequests: queuedRequests.length
      });
    }
    while (queuedRequests.length && requestBudgetRemaining > 0) {
      const request = queuedRequests.shift();
      if (debug) {
        console.warn(`[transport] Processing request ${request.requestNumber}`, {
          requestBudgetRemaining
        });
      }
      if (request.config.signal?.aborted) {
        if (debug) {
          console.warn(`[transport] Skipping aborted request ${request.requestNumber}`);
        }
        continue;
      }
      if (debug) {
        console.warn(`[transport] Starting request ${request.requestNumber}`);
      }
      originalTransport(request.config).then(request.resolve).catch(request.reject);
      requestBudgetRemaining--;
      if (pendingQueueRunTimerId === undefined) {
        if (debug) {
          console.warn(`[transport] Setting request budget reset deadline for ${interval} ms from now`);
        }
        pendingQueueRunTimerId = setTimeout(() => {
          if (debug) {
            console.warn('[transport] Replenishing request budget');
          }
          pendingQueueRunTimerId = undefined;
          requestBudgetRemaining = maxRps;
          processQueue();
        }, interval);
      }
    }
  };
  let requestCount = 0;
  const throttledTransport = config => new Promise((resolve, reject) => {
    queuedRequests.push({
      config,
      reject,
      requestNumber: ++requestCount,
      resolve
    });
    if (config.signal) {
      config.signal.addEventListener('abort', function () {
        reject(this.reason);
      });
    }
    processQueue();
  });
  return throttledTransport;
};
exports.getThrottledTransport = getThrottledTransport;
//# sourceMappingURL=getThrottledTransport.js.map