"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toCashAddress = exports.toLegacyAddress = exports.isCashAddress = void 0;
const tslib_1 = require("tslib");
const bs58check_1 = tslib_1.__importDefault(require("bs58check"));
const cashaddr = tslib_1.__importStar(require("cashaddrjs"));
const VERSION_BYTE = {
  legacy: {
    mainnet: {
      p2pkh: 0x00,
      p2sh: 0x05
    },
    testnet: {
      p2pkh: 0x6f,
      p2sh: 0xc4
    }
  },
  cashaddr: {
    mainnet: {
      p2pkh: 0,
      p2sh: 1
    },
    testnet: {
      p2pkh: 0,
      p2sh: 1
    }
  }
};
const decodeBase58Address = address => {
  const payload = bs58check_1.default.decode(address);
  if (payload.length !== 21) {
    throw new Error('Invalid base58 address payload length');
  }
  const version = payload[0];
  const hash = Array.prototype.slice.call(payload, 1);
  switch (version) {
    case 0x00:
      return {
        hash,
        format: 'legacy',
        network: 'mainnet',
        type: 'p2pkh'
      };
    case 0x05:
      return {
        hash,
        format: 'legacy',
        network: 'mainnet',
        type: 'p2sh'
      };
    case 0x6f:
      return {
        hash,
        format: 'legacy',
        network: 'testnet',
        type: 'p2pkh'
      };
    case 0xc4:
      return {
        hash,
        format: 'legacy',
        network: 'testnet',
        type: 'p2sh'
      };
    default:
      throw new Error('Unknown version byte: ' + version);
  }
};
const decodeCashAddressWithPrefix = address => {
  const decoded = cashaddr.decode(address);
  const hash = Array.prototype.slice.call(decoded.hash, 0);
  const type = decoded.type === 'P2PKH' ? 'p2pkh' : 'p2sh';
  switch (decoded.prefix) {
    case 'bitcoincash':
      return {
        hash,
        format: 'cashaddr',
        network: 'mainnet',
        type
      };
    case 'bchtest':
    case 'bchreg':
      return {
        hash,
        format: 'cashaddr',
        network: 'testnet',
        type
      };
    default:
      throw new Error('Unknown cashaddr prefix: ' + decoded.prefix);
  }
};
const decodeCashAddress = address => {
  if (address.indexOf(':') !== -1) {
    return decodeCashAddressWithPrefix(address);
  } else {
    const prefixes = ['bitcoincash', 'bchtest', 'bchreg'];
    for (const prefix of prefixes) {
      try {
        return decodeCashAddressWithPrefix(prefix + ':' + address);
      } catch {}
    }
  }
  throw new Error('Invalid cashaddr address');
};
const decodeAddress = address => {
  try {
    return decodeBase58Address(address);
  } catch {}
  try {
    return decodeCashAddress(address);
  } catch {}
  throw new Error('Invalid Bitcoin Cash address');
};
const isCashAddress = address => decodeAddress(address).format === 'cashaddr';
exports.isCashAddress = isCashAddress;
const toLegacyAddress = address => {
  const decoded = decodeAddress(address);
  if (decoded.format === 'legacy') {
    return address;
  }
  const version = VERSION_BYTE['legacy'][decoded.network][decoded.type];
  const buffer = Buffer.alloc(1 + decoded.hash.length);
  buffer[0] = version;
  buffer.set(decoded.hash, 1);
  return bs58check_1.default.encode(buffer);
};
exports.toLegacyAddress = toLegacyAddress;
const toCashAddress = address => {
  const decoded = decodeAddress(address);
  const prefix = decoded.network === 'mainnet' ? 'bitcoincash' : 'bchtest';
  const type = decoded.type === 'p2pkh' ? 'P2PKH' : 'P2SH';
  const hash = new Uint8Array(decoded.hash);
  return cashaddr.encode(prefix, type, hash);
};
exports.toCashAddress = toCashAddress;
//# sourceMappingURL=bchUtils.js.map