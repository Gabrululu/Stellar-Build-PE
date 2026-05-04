"use strict";
// Copyright 2018-2025 the Deno authors. MIT license.
Object.defineProperty(exports, "__esModule", { value: true });
exports.rAlphabet = exports.alphabet = void 0;
exports.calcSizeHex = calcSizeHex;
exports.encode = encode;
exports.decode = decode;
exports.alphabet = new TextEncoder().encode("0123456789abcdef");
exports.rAlphabet = new Uint8Array(128).fill(16); // alphabet.Hex.length
exports.alphabet.forEach((byte, i) => exports.rAlphabet[byte] = i);
new TextEncoder()
    .encode("ABCDEF")
    .forEach((byte, i) => exports.rAlphabet[byte] = i + 10);
/**
 * Calculate the output size needed to encode a given input size for
 * {@linkcode encodeIntoHex}.
 *
 * @param originalSize The size of the input buffer.
 * @returns The size of the output buffer.
 *
 * @example Basic Usage
 * ```ts
 * import { assertEquals } from "@std/assert";
 * import { calcSizeHex } from "@std/encoding/unstable-hex";
 *
 * assertEquals(calcSizeHex(1), 2);
 * ```
 */
function calcSizeHex(originalSize) {
    return originalSize * 2;
}
function encode(buffer, i, o, alphabet) {
    for (; i < buffer.length; ++i) {
        const x = buffer[i];
        buffer[o++] = alphabet[x >> 4];
        buffer[o++] = alphabet[x & 0xF];
    }
    return o;
}
function decode(buffer, i, o, alphabet) {
    if ((buffer.length - o) % 2 === 1) {
        throw new RangeError(`Cannot decode input as hex: Length (${buffer.length - o}) must be divisible by 2`);
    }
    i += 1;
    for (; i < buffer.length; i += 2) {
        buffer[o++] = (getByte(buffer[i - 1], alphabet) << 4) |
            getByte(buffer[i], alphabet);
    }
    return o;
}
function getByte(char, alphabet) {
    const byte = alphabet[char] ?? 16;
    if (byte === 16) { // alphabet.Hex.length
        throw new TypeError(`Cannot decode input as hex: Invalid character (${String.fromCharCode(char)})`);
    }
    return byte;
}
