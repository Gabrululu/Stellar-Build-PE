import type { IKitError, ISupportedWallet } from "../types/mod.js";
interface Subject<T> {
    next(v: T): void;
    error(err: unknown): void;
    complete(): void;
    subscribe(next?: (v: T) => void, error?: (err: unknown) => void, complete?: () => void): () => void;
    isCompleted(): boolean;
    hasError(): boolean;
}
export declare function createSubject<T>(): Subject<T>;
export declare const moduleSelectedEvent: Subject<ISupportedWallet | IKitError>;
export declare const addressUpdatedEvent: Subject<string | IKitError>;
export declare const closeEvent: Subject<void>;
export declare const disconnectEvent: Subject<void>;
export {};
//# sourceMappingURL=events.d.ts.map