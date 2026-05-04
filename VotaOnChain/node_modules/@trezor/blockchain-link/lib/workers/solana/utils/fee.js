"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getPriorityFee = exports.getBaseFee = void 0;
const kit_1 = require("@solana/kit");
const compute_budget_1 = require("@solana-program/compute-budget");
const solana_1 = require("@trezor/blockchain-link-utils/lib/solana");
const utils_1 = require("@trezor/utils");
const bigNumber_1 = require("@trezor/utils/lib/bigNumber");
const DEFAULT_COMPUTE_UNIT_PRICE_MICROLAMPORTS = BigInt(300_000);
const stripComputeBudgetInstructions = message => ({
  ...message,
  instructions: message.instructions.filter(instruction => message.staticAccounts[instruction.programAddressIndex] !== solana_1.COMPUTE_BUDGET_PROGRAM_ID)
});
const bumpUnitLimitComputeBudgetInstructions = message => ({
  ...message,
  instructions: message.instructions.map(ix => {
    if (message.staticAccounts[ix.programAddressIndex] === solana_1.COMPUTE_BUDGET_PROGRAM_ID && ix.data?.[0] === compute_budget_1.SET_COMPUTE_UNIT_LIMIT_DISCRIMINATOR) {
      const data = (0, compute_budget_1.getSetComputeUnitLimitInstructionDataEncoder)().encode({
        units: compute_budget_1.MAX_COMPUTE_UNIT_LIMIT
      });
      return {
        ...ix,
        data
      };
    }
    return ix;
  })
});
const getBaseFee = async (api, message) => {
  const messageWithoutComputeBudget = (0, kit_1.pipe)(stripComputeBudgetInstructions(message), (0, kit_1.getCompiledTransactionMessageEncoder)().encode, (0, kit_1.getBase64Decoder)().decode);
  const result = await api.getFeeForMessage(messageWithoutComputeBudget).send();
  if (result.value == null) {
    throw new Error('Could not estimate fee for transaction.');
  }
  return result.value;
};
exports.getBaseFee = getBaseFee;
const getPriorityFee = async (api, decompiledMessage, compiledMessage, signatures) => {
  const affectedAccounts = new Set(decompiledMessage.instructions.flatMap(instruction => instruction.accounts ?? []).filter(({
    role
  }) => (0, kit_1.isWritableRole)(role)).map(({
    address
  }) => address));
  const messageBytes = (0, kit_1.pipe)(bumpUnitLimitComputeBudgetInstructions(compiledMessage), (0, kit_1.getCompiledTransactionMessageEncoder)().encode);
  const rawTx = (0, kit_1.pipe)({
    messageBytes,
    signatures
  }, (0, kit_1.getTransactionEncoder)().encode, (0, kit_1.getBase64Decoder)().decode);
  const simulated = await api.simulateTransaction(rawTx, {
    commitment: 'confirmed',
    encoding: 'base64',
    sigVerify: false,
    replaceRecentBlockhash: true
  }).send();
  if (simulated.value.err != null || simulated.value.unitsConsumed == null) {
    const stringifiedError = (0, utils_1.safeBigIntStringify)(simulated.value.err);
    console.error('Could not simulate transaction:', stringifiedError);
    throw new Error(`Could not simulate transaction: ${stringifiedError}`);
  }
  const computeUnitLimit = new bigNumber_1.BigNumber(simulated.value.unitsConsumed.toString()).times(1.2).decimalPlaces(0, bigNumber_1.BigNumber.ROUND_UP);
  const recentFees = await api.getRecentPrioritizationFees(Array.from(affectedAccounts)).send();
  const networkPriorityFee = recentFees.map(a => a.prioritizationFee).sort((a, b) => Number(b - a))[Math.floor(recentFees.length / 4)];
  const computeUnitPrice = networkPriorityFee > DEFAULT_COMPUTE_UNIT_PRICE_MICROLAMPORTS ? networkPriorityFee : DEFAULT_COMPUTE_UNIT_PRICE_MICROLAMPORTS;
  const fee = new bigNumber_1.BigNumber(computeUnitPrice.toString()).times(10 ** -6).times(computeUnitLimit).decimalPlaces(0, bigNumber_1.BigNumber.ROUND_UP).toString(10);
  return {
    computeUnitPrice: computeUnitPrice.toString(10),
    computeUnitLimit: computeUnitLimit.toString(10),
    fee
  };
};
exports.getPriorityFee = getPriorityFee;
//# sourceMappingURL=fee.js.map