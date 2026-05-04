"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ping = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@trezor/utils");
const pingWorker_1 = tslib_1.__importDefault(require("./pingWorker"));
const init = async () => {
  const worker = (0, pingWorker_1.default)();
  await new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('worker_timeout')), 5000);
    worker.onmessage = message => {
      if (message?.data?.payload?.success) {
        resolve();
      }
    };
    worker.onerror = error => {
      try {
        worker.terminate();
      } catch {}
      reject(new Error(error.message));
    };
  });
  const deferred = (0, utils_1.createDeferredManager)();
  worker.onmessage = ({
    data: {
      id,
      payload
    }
  }) => {
    deferred.resolve(id, payload.success);
  };
  worker.onerror = error => {
    deferred.rejectAll(error);
  };
  const post = url => {
    const {
      promiseId: id,
      promise
    } = deferred.create();
    worker.postMessage({
      id,
      payload: {
        url
      }
    });
    return promise;
  };
  return {
    post
  };
};
const lazy = (0, utils_1.createLazy)(init);
const ping = url => lazy.getOrInit().then(({
  post
}) => post(url));
exports.ping = ping;
//# sourceMappingURL=ping.browser.js.map