import { MessagesSchema as PROTO } from "@trezor/protobuf";
import { Type } from "@trezor/schema-utils";
const CertPubKeys = Type.Object({
  rootPubKeysOptiga: Type.Array(Type.String()),
  rootPubKeysTropic: Type.Optional(Type.Array(Type.String()))
});
const ModelsWithKeys = Type.Exclude(Type.KeyOfEnum(PROTO.DeviceModelInternal), Type.Union([Type.Literal('T1B1'), Type.Literal('T2T1'), Type.Literal('UNKNOWN')]));
const ModelsWithoutKeys = Type.Extract(Type.KeyOfEnum(PROTO.DeviceModelInternal), Type.Union([Type.Literal('T1B1'), Type.Literal('T2T1'), Type.Literal('UNKNOWN')]));
const ModelPubKeys = Type.Intersect([Type.Record(ModelsWithKeys, Type.Intersect([CertPubKeys, Type.Object({
  debug: Type.Optional(CertPubKeys)
})])), Type.Partial(Type.Record(ModelsWithoutKeys, Type.Undefined()))]);
export const DeviceAuthenticityConfig = Type.Intersect([ModelPubKeys, Type.Object({
  version: Type.Number()
})]);
//# sourceMappingURL=deviceAuthenticityConfigTypes.js.map