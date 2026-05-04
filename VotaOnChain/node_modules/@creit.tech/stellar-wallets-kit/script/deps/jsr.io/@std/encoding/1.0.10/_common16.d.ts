import type { Uint8Array_ } from "./_types.js";
export type { Uint8Array_ };
export declare const alphabet: Uint8Array<ArrayBufferLike>;
export declare const rAlphabet: Uint8Array<ArrayBuffer>;
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
export declare function calcSizeHex(originalSize: number): number;
export declare function encode(buffer: Uint8Array_, i: number, o: number, alphabet: Uint8Array): number;
export declare function decode(buffer: Uint8Array_, i: number, o: number, alphabet: Uint8Array): number;
//# sourceMappingURL=_common16.d.ts.map