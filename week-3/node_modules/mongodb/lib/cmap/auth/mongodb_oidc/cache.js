"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cache = void 0;
/**
 * Base class for OIDC caches.
 */
class Cache {
    /**
     * Create a new cache.
     */
    constructor() {
        this.entries = new Map();
    }
    /**
     * Clear the cache.
     */
    clear() {
        this.entries.clear();
    }
    /**
     * Create a cache key from the address and username.
     */
    cacheKey(address, username, callbackHash) {
        return JSON.stringify([address, username, callbackHash]);
    }
}
exports.Cache = Cache;
//# sourceMappingURL=cache.js.map