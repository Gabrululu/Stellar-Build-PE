"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.disconnectEvent = exports.closeEvent = exports.addressUpdatedEvent = exports.moduleSelectedEvent = void 0;
exports.createSubject = createSubject;
const signals_1 = require("@preact/signals");
function createSubject() {
    const trigger = (0, signals_1.signal)(null);
    let status = "active";
    let storedError = null;
    const nextListeners = new Set();
    const errorListeners = new Set();
    const completeListeners = new Set();
    // Notify listeners whenever trigger changes
    (0, signals_1.effect)(() => {
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
exports.moduleSelectedEvent = createSubject();
exports.addressUpdatedEvent = createSubject();
exports.closeEvent = createSubject();
exports.disconnectEvent = createSubject();
