"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DeviceAuthenticityConfig = void 0;
const protobuf_1 = require("@trezor/protobuf");
const schema_utils_1 = require("@trezor/schema-utils");
const CertPubKeys = schema_utils_1.Type.Object({
  rootPubKeysOptiga: schema_utils_1.Type.Array(schema_utils_1.Type.String()),
  rootPubKeysTropic: schema_utils_1.Type.Optional(schema_utils_1.Type.Array(schema_utils_1.Type.String()))
});
const ModelsWithKeys = schema_utils_1.Type.Exclude(schema_utils_1.Type.KeyOfEnum(protobuf_1.MessagesSchema.DeviceModelInternal), schema_utils_1.Type.Union([schema_utils_1.Type.Literal('T1B1'), schema_utils_1.Type.Literal('T2T1'), schema_utils_1.Type.Literal('UNKNOWN')]));
const ModelsWithoutKeys = schema_utils_1.Type.Extract(schema_utils_1.Type.KeyOfEnum(protobuf_1.MessagesSchema.DeviceModelInternal), schema_utils_1.Type.Union([schema_utils_1.Type.Literal('T1B1'), schema_utils_1.Type.Literal('T2T1'), schema_utils_1.Type.Literal('UNKNOWN')]));
const ModelPubKeys = schema_utils_1.Type.Intersect([schema_utils_1.Type.Record(ModelsWithKeys, schema_utils_1.Type.Intersect([CertPubKeys, schema_utils_1.Type.Object({
  debug: schema_utils_1.Type.Optional(CertPubKeys)
})])), schema_utils_1.Type.Partial(schema_utils_1.Type.Record(ModelsWithoutKeys, schema_utils_1.Type.Undefined()))]);
exports.DeviceAuthenticityConfig = schema_utils_1.Type.Intersect([ModelPubKeys, schema_utils_1.Type.Object({
  version: schema_utils_1.Type.Number()
})]);
//# sourceMappingURL=deviceAuthenticityConfigTypes.js.map