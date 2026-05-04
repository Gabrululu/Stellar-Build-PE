"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handshakeCancel = void 0;
const protocol_1 = require("@trezor/protocol");
const transport_1 = require("@trezor/transport");
const utils_1 = require("@trezor/utils");
const errors_1 = require("../../constants/errors");
const CANCEL_TIMEOUT = 1_000;
const ATTEMPTS_LIMIT = 10;
const isLegacyBridge = transport => transport.name === 'BridgeTransport' && !utils_1.versionUtils.isNewerOrEqual(transport.version, '3.0.0');
const handshakeCancel = async ({
  device,
  logger,
  signal
}) => {
  if (device.features || device.getThpState()?.properties) {
    return;
  }
  const timeout = device.possibleT1 ? CANCEL_TIMEOUT : undefined;
  logger?.debug('handshake Cancel start');
  const send = await device.getCurrentSession().send('Cancel', {}, {
    signal,
    timeout
  });
  if (!send.success) {
    logger?.debug(`handshake Cancel send error ${send.error}`);
    return;
  }
  logger?.debug('handshake Cancel sent');
  for (let attempt = 0; attempt < ATTEMPTS_LIMIT; ++attempt) {
    logger?.debug(`handshake Cancel read attempt ${attempt}`);
    const result = await device.getCurrentSession().receive({
      signal,
      timeout
    });
    if (!result.success && result.error.message === transport_1.TRANSPORT_ERROR.ABORTED_BY_TIMEOUT) {
      if (isLegacyBridge(device.transport)) {
        await (0, utils_1.resolveAfter)(501);
      }
      await device.acquire();
    }
    if (!result.success && result.error.message !== protocol_1.PROTOCOL_MALFORMED) {
      logger?.debug(`handshake Cancel read error: ${result.error}`);
      return;
    } else if (result.success) {
      logger?.debug(`handshake Cancel read success: ${result.payload.type}`);
      if (result.payload.type === 'Failure' && result.payload.message.code === 'Failure_InvalidProtocol') {
        logger?.debug(`handshake Cancel protocol v2 detected`);
        await device.setupThp();
      }
      if (result.payload.type === 'Failure' && result.payload.message.code === 'Failure_Busy') {
        throw (0, errors_1.TypedError)(result.payload.message.code, result.payload.message.message);
      }
      return;
    }
  }
  logger?.debug(`handshake Cancel attempts limit reached`);
};
exports.handshakeCancel = handshakeCancel;
//# sourceMappingURL=handshake.js.map