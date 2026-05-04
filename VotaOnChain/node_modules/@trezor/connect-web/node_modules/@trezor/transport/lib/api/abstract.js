"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AbstractApi = void 0;
const tslib_1 = require("tslib");
const utils_1 = require("@trezor/utils");
const constants_1 = require("../constants");
const ERRORS = tslib_1.__importStar(require("../errors"));
const result_1 = require("../utils/result");
class AbstractApi extends utils_1.TypedEmitter {
  logger;
  listening = false;
  lock = {};
  type;
  constructor({
    logger,
    type
  }) {
    super();
    this.type = type;
    this.logger = logger;
  }
  success(payload) {
    return (0, result_1.success)(payload);
  }
  error(payload) {
    return (0, result_1.error)(payload);
  }
  unknownError(err, expectedErrors = []) {
    this.logger?.error('transport: abstract api: unknown error', err);
    return (0, result_1.unknownError)(err, expectedErrors);
  }
  synchronize = (0, utils_1.getSynchronize)();
  requestAccess({
    lock,
    path
  }) {
    if (!this.lock[path]) {
      this.lock[path] = {
        read: false,
        write: false
      };
    }
    if (this.lock[path].read && lock.read || this.lock[path].write && lock.write) {
      return this.error({
        error: ERRORS.OTHER_CALL_IN_PROGRESS
      });
    }
    this.lock[path] = {
      read: this.lock[path].read || lock.read,
      write: this.lock[path].write || lock.write
    };
    return this.success(undefined);
  }
  runInIsolation = async ({
    lock,
    path
  }, fn) => {
    const accessRes = this.requestAccess({
      lock,
      path
    });
    if (!accessRes.success) {
      return accessRes;
    }
    try {
      return await this.synchronize(fn);
    } catch (err) {
      this.logger?.error('transport: abstract api: runInIsolation error', err);
      return this.unknownError(err);
    } finally {
      this.lock[path] = {
        read: lock.read ? false : this.lock[path].read,
        write: lock.write ? false : this.lock[path].write
      };
    }
  };
}
exports.AbstractApi = AbstractApi;
//# sourceMappingURL=abstract.js.map