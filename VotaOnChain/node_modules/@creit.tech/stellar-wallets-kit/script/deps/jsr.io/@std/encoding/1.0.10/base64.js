"use strict";
// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase64 = encodeBase64;
exports.decodeBase64 = decodeBase64;
/**
 * Utilities for
 * {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4 | base64}
 * encoding and decoding.
 *
 * ```ts
 * import {
 *   encodeBase64,
 *   decodeBase64,
 * } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * const foobar = new TextEncoder().encode("foobar");
 *
 * assertEquals(encodeBase64(foobar), "Zm9vYmFy");
 * assertEquals(decodeBase64("Zm9vYmFy"), foobar);
 * ```
 *
 * @module
 */
const _common64_js_1 = require("./_common64.js");
const _common_detach_js_1 = require("./_common_detach.js");
const padding = "=".charCodeAt(0);
const alphabet = new TextEncoder()
    .encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/");
const rAlphabet = new Uint8Array(128).fill(64); // alphabet.length
alphabet.forEach((byte, i) => rAlphabet[byte] = i);
/**
 * Converts data into a base64-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @param data The data to encode.
 * @returns The base64-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase64 } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase64("foobar"), "Zm9vYmFy");
 * ```
 */
function encodeBase64(data) {
    if (typeof data === "string") {
        data = new TextEncoder().encode(data);
    }
    else if (data instanceof ArrayBuffer)
        data = new Uint8Array(data).slice();
    else
        data = data.slice();
    const [output, i] = (0, _common_detach_js_1.detach)(data, (0, _common64_js_1.calcSizeBase64)(data.length));
    (0, _common64_js_1.encode)(output, i, 0, alphabet, padding);
    return new TextDecoder().decode(output);
}
/**
 * Decodes a base64-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-4}
 *
 * @param b64 The base64-encoded string to decode.
 * @returns The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase64 } from "@std/encoding/base64";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase64("Zm9vYmFy"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 */
function decodeBase64(b64) {
    const output = new TextEncoder().encode(b64);
    // deno-lint-ignore no-explicit-any
    return new Uint8Array(output.buffer
        .transfer((0, _common64_js_1.decode)(output, 0, 0, rAlphabet, padding)));
}
