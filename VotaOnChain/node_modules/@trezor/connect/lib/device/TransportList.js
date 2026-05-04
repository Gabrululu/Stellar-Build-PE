"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createTransportList = void 0;
const transport_1 = require("@trezor/transport");
const constants_1 = require("../constants");
const tryGetTransport = (transports, name) => transports.find(t => t.name === name);
const getOrCreateTransport = (transports, transportType, params) => {
  if (transportType === 'BridgeTransport') {
    const existing = transports.filter(t => t.name === transportType);
    return existing.length ? existing : [new transport_1.BridgeTransport({
      ...params,
      port: 21328
    }), new transport_1.BridgeTransport(params)];
  }
  if (typeof transportType === 'string') {
    const existing = tryGetTransport(transports, transportType);
    if (existing) return existing;
    switch (transportType) {
      case 'WebUsbTransport':
        return new transport_1.WebUsbTransport(params);
      case 'NodeUsbTransport':
        return new transport_1.NodeUsbTransport(params);
      case 'UdpTransport':
        return new transport_1.UdpTransport(params);
    }
  } else if (typeof transportType === 'function' && 'prototype' in transportType) {
    const transportInstance = new transportType(params);
    if ((0, transport_1.isTransportInstance)(transportInstance)) {
      return tryGetTransport(transports, transportInstance.name) ?? transportInstance;
    }
  } else if ((0, transport_1.isTransportInstance)(transportType)) {
    const existing = tryGetTransport(transports, transportType.name);
    if (existing) {
      return existing;
    }
    if (!transportType.getMessage()) {
      transportType.updateMessages(params.messages);
    }
    return transportType;
  }
  throw constants_1.ERRORS.TypedError('Runtime', `DeviceList.init: transports[] of unexpected type: ${transportType}`);
};
const createTransports = (existing, transports = [], params) => {
  const transportTypes = transports?.length ? transports : ['BridgeTransport'];
  return transportTypes.flatMap(type => getOrCreateTransport(existing, type, params));
};
const createTransportList = params => (existing, transports) => createTransports(existing, transports, params);
exports.createTransportList = createTransportList;
//# sourceMappingURL=TransportList.js.map