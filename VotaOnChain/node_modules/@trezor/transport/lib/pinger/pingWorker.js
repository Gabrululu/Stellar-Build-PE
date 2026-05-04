"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const pingCommon_1 = require("./pingCommon");
setTimeout(() => {
  postMessage({
    id: -1,
    payload: {
      success: true
    }
  });
}, 10);
onmessage = ({
  data
}) => {
  const {
    id,
    payload
  } = data;
  const {
    url
  } = payload;
  (0, pingCommon_1.ping)(url).then(success => postMessage({
    id,
    payload: {
      success
    }
  }));
};
exports.default = null;
//# sourceMappingURL=pingWorker.js.map