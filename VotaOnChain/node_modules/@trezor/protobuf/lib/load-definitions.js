"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.loadDefinitions = void 0;
const light_1 = require("protobufjs/light");
const loadDefinitions = async (messages, packageName, packageLoader) => {
  try {
    const pkg = messages.lookup(packageName);
    if (pkg) {
      return;
    }
  } catch {}
  let enumType;
  try {
    enumType = messages.lookupEnum('MessageType');
  } catch {}
  const packageMessages = await packageLoader();
  const pkg = messages.define(packageName, packageMessages);
  const packageEnumType = (() => {
    const {
      nested
    } = pkg;
    const candidate = nested?.['MessageType'];
    return candidate instanceof light_1.Enum ? candidate : undefined;
  })();
  if (enumType && packageEnumType) {
    try {
      Object.keys(packageEnumType.values).forEach(key => {
        enumType.add(key, packageEnumType.values[key]);
      });
      pkg.remove(packageEnumType);
    } catch (e) {
      messages.remove(pkg);
      throw e;
    }
  }
};
exports.loadDefinitions = loadDefinitions;
//# sourceMappingURL=load-definitions.js.map