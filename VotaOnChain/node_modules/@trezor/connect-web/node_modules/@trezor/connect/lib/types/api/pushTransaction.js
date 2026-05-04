"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PushTransaction = void 0;
const schema_utils_1 = require("@trezor/schema-utils");
exports.PushTransaction = schema_utils_1.Type.Object({
  tx: schema_utils_1.Type.Union([schema_utils_1.Type.String(), schema_utils_1.Type.Object({
    hex: schema_utils_1.Type.String(),
    disableAlternativeRPC: schema_utils_1.Type.Optional(schema_utils_1.Type.Boolean())
  })]),
  coin: schema_utils_1.Type.String(),
  identity: schema_utils_1.Type.Optional(schema_utils_1.Type.String())
});
//# sourceMappingURL=pushTransaction.js.map