export function roundTo(value, precision = 2) {
  const x = 10 ** precision;
  return Math.round(value * x) / x;
}
//# sourceMappingURL=number.js.map