"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CancelablePromise_isResolved, _CancelablePromise_isRejected, _CancelablePromise_isCancelled, _CancelablePromise_cancelHandlers, _CancelablePromise_promise, _CancelablePromise_resolve, _CancelablePromise_reject;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CancelablePromise = exports.CancelError = void 0;
/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
class CancelError extends Error {
    constructor(message) {
        super(message);
        this.name = 'CancelError';
    }
    get isCancelled() {
        return true;
    }
}
exports.CancelError = CancelError;
class CancelablePromise {
    constructor(executor) {
        _CancelablePromise_isResolved.set(this, void 0);
        _CancelablePromise_isRejected.set(this, void 0);
        _CancelablePromise_isCancelled.set(this, void 0);
        _CancelablePromise_cancelHandlers.set(this, void 0);
        _CancelablePromise_promise.set(this, void 0);
        _CancelablePromise_resolve.set(this, void 0);
        _CancelablePromise_reject.set(this, void 0);
        __classPrivateFieldSet(this, _CancelablePromise_isResolved, false, "f");
        __classPrivateFieldSet(this, _CancelablePromise_isRejected, false, "f");
        __classPrivateFieldSet(this, _CancelablePromise_isCancelled, false, "f");
        __classPrivateFieldSet(this, _CancelablePromise_cancelHandlers, [], "f");
        __classPrivateFieldSet(this, _CancelablePromise_promise, new Promise((resolve, reject) => {
            __classPrivateFieldSet(this, _CancelablePromise_resolve, resolve, "f");
            __classPrivateFieldSet(this, _CancelablePromise_reject, reject, "f");
            const onResolve = (value) => {
                if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
                    return;
                }
                __classPrivateFieldSet(this, _CancelablePromise_isResolved, true, "f");
                if (__classPrivateFieldGet(this, _CancelablePromise_resolve, "f"))
                    __classPrivateFieldGet(this, _CancelablePromise_resolve, "f").call(this, value);
            };
            const onReject = (reason) => {
                if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
                    return;
                }
                __classPrivateFieldSet(this, _CancelablePromise_isRejected, true, "f");
                if (__classPrivateFieldGet(this, _CancelablePromise_reject, "f"))
                    __classPrivateFieldGet(this, _CancelablePromise_reject, "f").call(this, reason);
            };
            const onCancel = (cancelHandler) => {
                if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
                    return;
                }
                __classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f").push(cancelHandler);
            };
            Object.defineProperty(onCancel, 'isResolved', {
                get: () => __classPrivateFieldGet(this, _CancelablePromise_isResolved, "f"),
            });
            Object.defineProperty(onCancel, 'isRejected', {
                get: () => __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f"),
            });
            Object.defineProperty(onCancel, 'isCancelled', {
                get: () => __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f"),
            });
            return executor(onResolve, onReject, onCancel);
        }), "f");
    }
    get [(_CancelablePromise_isResolved = new WeakMap(), _CancelablePromise_isRejected = new WeakMap(), _CancelablePromise_isCancelled = new WeakMap(), _CancelablePromise_cancelHandlers = new WeakMap(), _CancelablePromise_promise = new WeakMap(), _CancelablePromise_resolve = new WeakMap(), _CancelablePromise_reject = new WeakMap(), Symbol.toStringTag)]() {
        return "Cancellable Promise";
    }
    then(onFulfilled, onRejected) {
        return __classPrivateFieldGet(this, _CancelablePromise_promise, "f").then(onFulfilled, onRejected);
    }
    catch(onRejected) {
        return __classPrivateFieldGet(this, _CancelablePromise_promise, "f").catch(onRejected);
    }
    finally(onFinally) {
        return __classPrivateFieldGet(this, _CancelablePromise_promise, "f").finally(onFinally);
    }
    cancel() {
        if (__classPrivateFieldGet(this, _CancelablePromise_isResolved, "f") || __classPrivateFieldGet(this, _CancelablePromise_isRejected, "f") || __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f")) {
            return;
        }
        __classPrivateFieldSet(this, _CancelablePromise_isCancelled, true, "f");
        if (__classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f").length) {
            try {
                for (const cancelHandler of __classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f")) {
                    cancelHandler();
                }
            }
            catch (error) {
                console.warn('Cancellation threw an error', error);
                return;
            }
        }
        __classPrivateFieldGet(this, _CancelablePromise_cancelHandlers, "f").length = 0;
        if (__classPrivateFieldGet(this, _CancelablePromise_reject, "f"))
            __classPrivateFieldGet(this, _CancelablePromise_reject, "f").call(this, new CancelError('Request aborted'));
    }
    get isCancelled() {
        return __classPrivateFieldGet(this, _CancelablePromise_isCancelled, "f");
    }
}
exports.CancelablePromise = CancelablePromise;
