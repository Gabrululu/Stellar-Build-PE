export type Result<T, E> = Ok<T> | Err<E>;
export interface Ok<T> {
    readonly ok: true;
    readonly value: T;
}
export interface Err<E> {
    readonly ok: false;
    readonly error: E;
}
export type InferOk<R extends Result<any, any>> = R extends Ok<infer T> ? T : never;
export type InferErr<R extends Result<any, any>> = R extends Err<infer E> ? E : never;
export declare function ok(): Ok<void>;
export declare function ok<T>(value: T): Ok<T>;
export declare const err: <E>(error: E) => Err<E>;
//# sourceMappingURL=result.d.ts.map