import { effect, signal } from "@preact/signals";
export function createSubject() {
    const trigger = signal(null);
    let status = "active";
    let storedError = null;
    const nextListeners = new Set();
    const errorListeners = new Set();
    const completeListeners = new Set();
    // Notify listeners whenever trigger changes
    effect(() => {
        if (status === "active" && trigger.value !== null) {
            const v = trigger.value;
            trigger.value = null; // Reset trigger so effect only fires once
            for (const cb of nextListeners)
                cb(v);
        }
    });
    function clearAll() {
        nextListeners.clear();
        errorListeners.clear();
        completeListeners.clear();
    }
    return {
        next(v) {
            if (status === "active")
                trigger.value = v;
        },
        error(err) {
            if (status !== "active")
                return;
            status = "error";
            storedError = err;
            for (const cb of errorListeners)
                cb(err);
            clearAll();
        },
        complete() {
            if (status !== "active")
                return;
            status = "completed";
            for (const cb of completeListeners)
                cb();
            clearAll();
        },
        subscribe(next, error, complete) {
            if (status === "error") {
                error?.(storedError);
                return () => { };
            }
            if (status === "completed") {
                complete?.();
                return () => { };
            }
            if (next)
                nextListeners.add(next);
            if (error)
                errorListeners.add(error);
            if (complete)
                completeListeners.add(complete);
            return () => {
                if (next)
                    nextListeners.delete(next);
                if (error)
                    errorListeners.delete(error);
                if (complete)
                    completeListeners.delete(complete);
            };
        },
        isCompleted() {
            return status === "completed";
        },
        hasError() {
            return status === "error";
        },
    };
}
export const moduleSelectedEvent = createSubject();
export const addressUpdatedEvent = createSubject();
export const closeEvent = createSubject();
export const disconnectEvent = createSubject();
