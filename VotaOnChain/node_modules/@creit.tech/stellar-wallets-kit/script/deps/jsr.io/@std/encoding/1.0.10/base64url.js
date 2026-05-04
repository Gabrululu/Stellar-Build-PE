"use strict";
// Copyright 2018-2025 the Deno authors. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeBase64Url = encodeBase64Url;
exports.decodeBase64Url = decodeBase64Url;
/**
 * Utilities for
 * {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5 | base64url}
 * encoding and decoding.
 *
 * @module
 */
const _common64_js_1 = require("./_common64.js");
const _common_detach_js_1 = require("./_common_detach.js");
const padding = "=".charCodeAt(0);
const alphabet = new TextEncoder()
    .encode("ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_");
const rAlphabet = new Uint8Array(128).fill(64); // alphabet.length
alphabet.forEach((byte, i) => rAlphabet[byte] = i);
/**
 * Convert data into a base64url-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @param data The data to encode.
 * @returns The base64url-encoded string.
 *
 * @example Usage
 * ```ts
 * import { encodeBase64Url } from "@std/encoding/base64url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(encodeBase64Url("foobar"), "Zm9vYmFy");
 * ```
 */
function encodeBase64Url(data) {
    if (typeof data === "string") {
        data = new TextEncoder().encode(data);
    }
    else if (data instanceof ArrayBuffer)
        data = new Uint8Array(data).slice();
    else
        data = data.slice();
    const [output, i] = (0, _common_detach_js_1.detach)(data, (0, _common64_js_1.calcSizeBase64)(data.length));
    let o = (0, _common64_js_1.encode)(output, i, 0, alphabet, padding);
    o = output.indexOf(padding, o - 2);
    return new TextDecoder().decode(
    // deno-lint-ignore no-explicit-any
    o > 0 ? new Uint8Array(output.buffer.transfer(o)) : output);
}
/**
 * Decodes a given base64url-encoded string.
 *
 * @see {@link https://www.rfc-editor.org/rfc/rfc4648.html#section-5}
 *
 * @param b64url The base64url-encoded string to decode.
 * @returns The decoded data.
 *
 * @example Usage
 * ```ts
 * import { decodeBase64Url } from "@std/encoding/base64url";
 * import { assertEquals } from "@std/assert";
 *
 * assertEquals(
 *   decodeBase64Url("Zm9vYmFy"),
 *   new TextEncoder().encode("foobar")
 * );
 * ```
 */
function decodeBase64Url(b64url) {
    const output = new TextEncoder().encode(b64url);
    // deno-lint-ignore no-explicit-any
    return new Uint8Array(output.buffer
        .transfer((0, _common64_js_1.decode)(output, 0, 0, rAlphabet, padding)));
}
