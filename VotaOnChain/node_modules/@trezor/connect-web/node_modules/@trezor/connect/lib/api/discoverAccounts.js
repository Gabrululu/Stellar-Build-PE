"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
const utils_1 = require("@trezor/utils");
const BlockchainLink_1 = require("../backend/BlockchainLink");
const constants_1 = require("../constants");
const AbstractMethod_1 = require("../core/AbstractMethod");
const coinInfo_1 = require("../data/coinInfo");
const events_1 = require("../events");
const paramsValidator_1 = require("./common/paramsValidator");
const discoverAccounts_1 = require("../types/api/discoverAccounts");
const accountUtils_1 = require("../utils/accountUtils");
const pathUtils_1 = require("../utils/pathUtils");
const ACCOUNT_LIMIT = 10;
const TXS_PER_PAGE = 25;
const DETAILS = 'txs';
const isCardano = account => account.symbol === 'ada' || account.symbol === 'tada';
const isCardanoRequest = request => isCardano(request.account);
const isEvmLedger = (account, coinInfo) => coinInfo.type === 'ethereum' && account.type === 'ledger';
const getAccountTypeKey = ({
  symbol,
  type
}) => `${symbol}-${type}`;
const substituteBip43Path = (path, index) => path.replace('i', String(index));
class DiscoverAccounts extends AbstractMethod_1.AbstractMethod {
  disposed = false;
  init() {
    this.requiredPermissions = ['read'];
    this.useDevice = true;
    this.useDeviceState = true;
    this.useUi = false;
    const {
      payload
    } = this;
    (0, paramsValidator_1.validateParams)(payload, [{
      name: 'coins',
      type: 'array',
      required: true,
      allowEmpty: true
    }]);
    this.params = payload.coins.flatMap(coin => {
      (0, paramsValidator_1.validateParams)(coin, [{
        name: 'symbol',
        type: 'string',
        required: true
      }, {
        name: 'known',
        type: 'array',
        allowEmpty: true
      }, {
        name: 'knownOnly',
        type: 'boolean'
      }, {
        name: 'identity',
        type: 'string'
      }, {
        name: 'details',
        type: 'string'
      }, {
        name: 'pageSize',
        type: 'number'
      }]);
      const {
        symbol,
        known: knownAccs,
        knownOnly,
        ...rest
      } = coin;
      const coinInfo = (0, coinInfo_1.getCoinInfo)(symbol);
      if (!coinInfo) {
        throw constants_1.ERRORS.TypedError('Method_UnknownCoin');
      }
      (0, BlockchainLink_1.isBackendSupported)(coinInfo);
      const firmwareRange = (0, paramsValidator_1.getFirmwareRange)(this.name, coinInfo, AbstractMethod_1.DEFAULT_FIRMWARE_RANGE);
      const symbolAccounts = discoverAccounts_1.ACCOUNT_TYPES.filter(a => a.symbol === symbol);
      knownAccs?.forEach(account => {
        (0, paramsValidator_1.validateParams)(account, [{
          name: 'type',
          type: 'string',
          required: true
        }, {
          name: 'skip',
          type: 'number'
        }]);
        if (!symbolAccounts.some(a => a.type === account.type)) {
          throw new Error(`Unknown account type: ${symbol}/${account.type}`);
        }
      });
      return symbolAccounts.map(account => [account, knownAccs?.find(t => t.type === account.type)]).filter(([_, known]) => known ? typeof known.skip === 'number' : !knownOnly).map(([account, known]) => ({
        pageSize: isCardano(account) ? 8 : TXS_PER_PAGE,
        details: DETAILS,
        coinInfo,
        firmwareRange,
        skip: known?.skip ?? 0,
        account,
        ...rest,
        offset: isEvmLedger(account, coinInfo) ? 1 : 0,
        derivation: isCardano(account) ? discoverAccounts_1.CARDANO_DERIVATIONS[account.type] : undefined
      }));
    });
  }
  progress = {};
  updateProgress(account, done, last = false) {
    const progress = last ? 1 : done / Math.max(ACCOUNT_LIMIT, done + 1);
    const key = getAccountTypeKey(account);
    this.progress[key] = progress;
  }
  sendProgress(response) {
    const progress = Object.values(this.progress).reduce((sum, typeProgress) => sum + typeProgress, 0) / (Object.keys(this.progress).length || 1);
    this.postMessage((0, events_1.createUiMessage)(events_1.UI.BUNDLE_PROGRESS, {
      total: 100,
      progress: 100 * progress,
      response
    }));
  }
  async run() {
    const [unsupported, supported] = this.filterUnsupportedAccounts(this.params);
    unsupported.forEach(({
      account: {
        path: bip43,
        ...rest
      },
      error,
      coinInfo,
      skip,
      offset
    }) => {
      const path = substituteBip43Path(bip43, skip + offset);
      const backendType = coinInfo.blockchainLink?.type;
      this.sendProgress({
        ...rest,
        index: skip,
        failed: true,
        error,
        path,
        backendType
      });
    });
    const [cardanoAccounts, otherAccounts] = (0, utils_1.arrayPartition)(supported, isCardanoRequest);
    const [_, filteredCardanoAccounts] = await this.filterCardanoDerivations(cardanoAccounts);
    const accounts = [...otherAccounts, ...filteredCardanoAccounts];
    accounts.forEach(({
      account,
      skip
    }) => this.updateProgress(account, skip));
    const counts = await Promise.all(accounts.map(account => this.discoverAccount(account)));
    const nonempty = counts.reduce((sum, acc) => sum + acc.nonempty, 0);
    const failed = counts.filter(acc => acc.error).length;
    const empty = counts.length - failed;
    return {
      empty,
      nonempty,
      failed
    };
  }
  filterUnsupportedAccounts(accounts) {
    const version = this.device.getVersion();
    const model = this.device.features?.internal_model;
    if (!version || !model) return [[], accounts];
    return (0, utils_1.arrayPartition)(accounts.map(item => {
      const {
        min,
        max
      } = item.firmwareRange[model];
      let error;
      if (min === '0') {
        error = events_1.UI.FIRMWARE_NOT_SUPPORTED;
      } else if (!utils_1.versionUtils.isNewerOrEqual(version, min)) {
        error = events_1.UI.FIRMWARE_OLD;
      } else if (max !== '0' && utils_1.versionUtils.isNewer(version, max)) {
        error = events_1.UI.FIRMWARE_NOT_COMPATIBLE;
      }
      return error ? {
        ...item,
        error
      } : item;
    }), item => 'error' in item);
  }
  async filterCardanoDerivations(accounts) {
    const legacyRequest = accounts.find(a => a.account.type === 'legacy');
    const ledgerRequest = accounts.find(a => a.account.type === 'ledger');
    const filterableRequest = legacyRequest ?? ledgerRequest;
    const getDescriptor = derivation => filterableRequest && this.getDescriptor(filterableRequest.coinInfo, filterableRequest.account.path, discoverAccounts_1.CARDANO_DERIVATIONS[derivation], 0).then(({
      descriptor
    }) => descriptor);
    const normalDescriptor = await getDescriptor('normal');
    const omitLegacy = legacyRequest && (await getDescriptor('legacy')) === normalDescriptor;
    const omitLedger = ledgerRequest && (!legacyRequest || omitLegacy) && (await getDescriptor('ledger')) === normalDescriptor;
    return (0, utils_1.arrayPartition)(accounts.map(item => item.account.type === 'legacy' && omitLegacy || item.account.type === 'ledger' && omitLedger ? {
      ...item,
      error: 'ignored cardano derivation'
    } : item), item => 'error' in item);
  }
  descriptorLock = (0, utils_1.getSynchronize)();
  descriptorCache = {};
  async getDescriptor(coinInfo, bip43PathTemplate, derivationType, index) {
    const path = substituteBip43Path(bip43PathTemplate, index);
    const {
      address_n: _,
      ...descriptorRest
    } = await this.descriptorLock(async () => {
      const key = `${path}-${derivationType}`;
      if (!this.descriptorCache[key]) {
        const address_n = (0, pathUtils_1.validatePath)(path, 3);
        this.descriptorCache[key] = await this.device.getCommands().getAccountDescriptor(coinInfo, address_n, derivationType);
      }
      return this.descriptorCache[key];
    });
    return {
      path,
      ...descriptorRest
    };
  }
  async discoverAccount(request) {
    const {
      details,
      identity,
      pageSize,
      coinInfo,
      derivation,
      offset,
      skip
    } = request;
    const {
      path: bip43,
      ...accountKey
    } = request.account;
    const backendType = coinInfo.blockchainLink?.type;
    const utxoRequired = (0, accountUtils_1.isUtxoBased)(coinInfo) && details && details !== 'basic';
    let index = skip;
    let blockchain;
    try {
      blockchain = await (0, BlockchainLink_1.initBlockchain)(coinInfo, this.postMessage, identity);
    } catch (err) {
      const path = substituteBip43Path(bip43, offset + index);
      this.updateProgress(accountKey, index + 1, true);
      const error = err.message;
      this.sendProgress({
        ...accountKey,
        index,
        failed: true,
        error,
        path,
        backendType
      });
      return {
        nonempty: 0,
        error
      };
    }
    let descPromise = this.getDescriptor(coinInfo, bip43, derivation, offset + index);
    descPromise.catch(() => {});
    while (true) {
      try {
        const {
          descriptor,
          ...descRest
        } = await descPromise;
        descPromise = this.getDescriptor(coinInfo, bip43, derivation, offset + index + 1);
        descPromise.catch(() => {});
        const info = await blockchain.getAccountInfo({
          descriptor,
          details,
          pageSize
        });
        const utxo = !utxoRequired ? undefined : info.empty ? [] : await blockchain.getAccountUtxo(descriptor);
        this.updateProgress(accountKey, index + 1, info.empty);
        this.sendProgress({
          ...info,
          descriptor,
          ...descRest,
          utxo,
          ...accountKey,
          index,
          backendType,
          failed: false
        });
        if (info.empty) {
          await descPromise.catch(() => {});
          return {
            nonempty: index - skip
          };
        }
      } catch (err) {
        const path = substituteBip43Path(bip43, offset + index);
        const {
          message: error,
          code
        } = err;
        const failed = true;
        this.updateProgress(accountKey, index + 1, true);
        this.sendProgress({
          ...accountKey,
          index,
          failed,
          error,
          code,
          path,
          backendType
        });
        return {
          nonempty: index - skip,
          error
        };
      }
      index++;
    }
  }
  dispose() {
    this.disposed = true;
  }
}
exports.default = DiscoverAccounts;
//# sourceMappingURL=discoverAccounts.js.map