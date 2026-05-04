"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isValidAddress = exports.isValidAssetCode = exports.getTokenMetadata = exports.buildRemoveTrustlineTransaction = exports.buildAddTrustlineTransaction = exports.buildSendTransaction = exports.transformTransaction = exports.BASE_INFO = exports.toStroops = exports.STELLAR_DECIMALS = void 0;
const stellar_sdk_1 = require("@stellar/stellar-sdk");
const env_utils_1 = require("@trezor/env-utils");
const bigNumber_1 = require("@trezor/utils/lib/bigNumber");
exports.STELLAR_DECIMALS = 7;
const toStroops = value => {
  const multiplier = new bigNumber_1.BigNumber(10).pow(exports.STELLAR_DECIMALS);
  const amount = new bigNumber_1.BigNumber(value).times(multiplier);
  return amount;
};
exports.toStroops = toStroops;
exports.BASE_INFO = {
  BASE_RESERVE: (0, exports.toStroops)('0.5'),
  MINIMUM_RESERVE: (0, exports.toStroops)('1')
};
const isoToTimestamp = isoDate => {
  const timestamp = Date.parse(isoDate);
  if (isNaN(timestamp)) {
    throw new Error('Invalid ISO date string');
  }
  return Math.floor(timestamp / 1000);
};
const convertMemo = memo => {
  switch (memo.type) {
    case 'text':
    case 'id':
      return memo.value?.toString();
    case 'hash':
    case 'return':
      return memo.value?.toString('hex');
    default:
      return undefined;
  }
};
const transformTransaction = (rawTx, descriptor, tokenDetailByMint) => {
  const parsedTx = new stellar_sdk_1.Transaction(rawTx.envelope_xdr, stellar_sdk_1.Networks.PUBLIC);
  const baseTx = {
    type: 'unknown',
    txid: rawTx.hash,
    amount: '0',
    fee: rawTx.fee_charged.toString(),
    blockTime: isoToTimestamp(rawTx.created_at),
    blockHeight: rawTx.ledger_attr,
    targets: [],
    tokens: [],
    internalTransfers: [],
    feeRate: undefined,
    details: {
      vin: [],
      vout: [],
      size: 0,
      totalInput: '0',
      totalOutput: '0'
    },
    stellarSpecific: {
      memo: convertMemo(parsedTx.memo),
      feeSource: (0, stellar_sdk_1.extractBaseAddress)(rawTx.source_account)
    }
  };
  if (!rawTx.successful) {
    return {
      ...baseTx,
      type: 'failed'
    };
  }
  if (parsedTx.operations.length !== 1) {
    return baseTx;
  }
  const rawOp = parsedTx.operations[0];
  const opSource = rawOp.source || rawTx.source_account;
  const fromAddress = (0, stellar_sdk_1.extractBaseAddress)(opSource);
  let toAddress;
  let nativeAmount;
  let isTokenTransfer = false;
  let tokenInfo;
  switch (rawOp.type) {
    case 'createAccount':
      toAddress = (0, stellar_sdk_1.extractBaseAddress)(rawOp.destination);
      nativeAmount = (0, exports.toStroops)(rawOp.startingBalance).toString();
      break;
    case 'payment':
      toAddress = (0, stellar_sdk_1.extractBaseAddress)(rawOp.destination);
      if (rawOp.asset.isNative()) {
        nativeAmount = (0, exports.toStroops)(rawOp.amount).toString();
      } else {
        isTokenTransfer = true;
        tokenInfo = {
          assetCode: rawOp.asset.getCode(),
          assetIssuer: rawOp.asset.getIssuer(),
          amount: (0, exports.toStroops)(rawOp.amount).toString()
        };
        nativeAmount = '0';
      }
      break;
    case 'changeTrust':
      {
        if (rawOp.line.getAssetType() !== 'credit_alphanum4' && rawOp.line.getAssetType() !== 'credit_alphanum12') {
          return baseTx;
        }
        if (descriptor !== fromAddress) {
          return baseTx;
        }
        const line = rawOp.line;
        const assetCode = line.getCode();
        const isRemoval = new bigNumber_1.BigNumber(rawOp.limit).isZero();
        return {
          ...baseTx,
          type: 'self',
          stellarSpecific: {
            ...baseTx.stellarSpecific,
            operationType: 'changeTrust',
            changeTrust: {
              assetCode,
              isRemoval
            }
          }
        };
      }
    default:
      return baseTx;
  }
  if (!toAddress) {
    return baseTx;
  }
  const isFrom = descriptor === fromAddress;
  const isTo = descriptor === toAddress;
  if (!descriptor || !isFrom && !isTo) {
    return baseTx;
  }
  const type = isFrom ? 'sent' : 'recv';
  if (isTokenTransfer && tokenInfo) {
    const {
      assetCode,
      assetIssuer,
      amount: tokenAmount
    } = tokenInfo;
    const contract = `${assetCode}-${assetIssuer}`;
    return {
      ...baseTx,
      type,
      amount: '0',
      tokens: [{
        type,
        standard: 'STELLAR-CLASSIC',
        from: fromAddress,
        to: toAddress,
        contract,
        name: tokenDetailByMint[contract]?.name || assetCode,
        symbol: assetCode,
        decimals: exports.STELLAR_DECIMALS,
        amount: tokenAmount
      }]
    };
  }
  if (nativeAmount) {
    return {
      ...baseTx,
      type,
      amount: nativeAmount,
      targets: [{
        n: 0,
        addresses: [toAddress],
        isAddress: true,
        amount: nativeAmount
      }],
      details: {
        vin: [{
          n: 0,
          addresses: [fromAddress],
          isAddress: true,
          value: nativeAmount
        }],
        vout: [{
          n: 0,
          addresses: [toAddress],
          isAddress: true,
          value: nativeAmount
        }],
        size: 0,
        totalInput: nativeAmount,
        totalOutput: nativeAmount
      }
    };
  }
  return baseTx;
};
exports.transformTransaction = transformTransaction;
const createTransactionBuilder = ({
  descriptor,
  sequence,
  fee,
  isTestnet = false
}) => {
  const source = new stellar_sdk_1.Account(descriptor, sequence);
  return new stellar_sdk_1.TransactionBuilder(source, {
    fee,
    networkPassphrase: isTestnet ? stellar_sdk_1.Networks.TESTNET : stellar_sdk_1.Networks.PUBLIC
  }).setTimebounds(0, 0);
};
const buildTrustlineTransaction = ({
  descriptor,
  sequence,
  fee,
  asset,
  limit,
  isTestnet
}) => {
  const txBuilder = createTransactionBuilder({
    descriptor,
    sequence,
    fee,
    isTestnet
  });
  txBuilder.addOperation(stellar_sdk_1.Operation.changeTrust({
    asset: new stellar_sdk_1.Asset(asset.code, asset.issuer),
    limit
  }));
  return txBuilder.build();
};
const buildSendTransaction = ({
  descriptor,
  sequence,
  fee,
  destinationActivated,
  destination,
  amount,
  asset,
  destinationTag,
  isTestnet
}) => {
  const txBuilder = createTransactionBuilder({
    descriptor,
    sequence,
    fee,
    isTestnet
  });
  if (destinationTag) {
    txBuilder.addMemo(stellar_sdk_1.Memo.text(destinationTag));
  }
  if (destinationActivated) {
    txBuilder.addOperation(stellar_sdk_1.Operation.payment({
      destination,
      amount,
      asset: new stellar_sdk_1.Asset(asset.code || 'XLM', asset.issuer)
    }));
  } else {
    txBuilder.addOperation(stellar_sdk_1.Operation.createAccount({
      destination,
      startingBalance: amount
    }));
  }
  return txBuilder.build();
};
exports.buildSendTransaction = buildSendTransaction;
const buildAddTrustlineTransaction = ({
  descriptor,
  sequence,
  fee,
  asset,
  isTestnet
}) => buildTrustlineTransaction({
  descriptor,
  sequence,
  fee,
  asset,
  isTestnet
});
exports.buildAddTrustlineTransaction = buildAddTrustlineTransaction;
const buildRemoveTrustlineTransaction = ({
  descriptor,
  sequence,
  fee,
  asset,
  isTestnet
}) => buildTrustlineTransaction({
  descriptor,
  sequence,
  fee,
  asset,
  limit: '0',
  isTestnet
});
exports.buildRemoveTrustlineTransaction = buildRemoveTrustlineTransaction;
const getTokenMetadata = async () => {
  const env = (0, env_utils_1.isCodesignBuild)() ? 'stable' : 'develop';
  const response = await fetch(`https://data.trezor.io/suite/definitions/${env}/stellar.advanced.coin.definitions.v1.json`);
  if (!response.ok) {
    throw Error(`Failed to fetch token metadata: ${response.statusText}`);
  }
  const data = await response.json();
  return data;
};
exports.getTokenMetadata = getTokenMetadata;
const isValidAssetCode = code => /^[a-zA-Z0-9]{1,12}$/.test(code);
exports.isValidAssetCode = isValidAssetCode;
const isValidAddress = address => stellar_sdk_1.StrKey.isValidEd25519PublicKey(address);
exports.isValidAddress = isValidAddress;
//# sourceMappingURL=stellar.js.map