"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenEntryCache = exports.TokenEntry = void 0;
const cache_1 = require("./cache");
/* 5 minutes in milliseconds */
const EXPIRATION_BUFFER_MS = 300000;
/* Default expiration is now for when no expiration provided */
const DEFAULT_EXPIRATION_SECS = 0;
/** @internal */
class TokenEntry {
    /**
     * Instantiate the entry.
     */
    constructor(tokenResult, serverInfo, expiration) {
        this.tokenResult = tokenResult;
        this.serverInfo = serverInfo;
        this.expiration = expiration;
    }
    /**
     * The entry is still valid if the expiration is more than
     * 5 minutes from the expiration time.
     */
    isValid() {
        return this.expiration - Date.now() > EXPIRATION_BUFFER_MS;
    }
}
exports.TokenEntry = TokenEntry;
/**
 * Cache of OIDC token entries.
 * @internal
 */
class TokenEntryCache extends cache_1.Cache {
    /**
     * Set an entry in the token cache.
     */
    addEntry(address, username, callbackHash, tokenResult, serverInfo) {
        const entry = new TokenEntry(tokenResult, serverInfo, expirationTime(tokenResult.expiresInSeconds));
        this.entries.set(this.cacheKey(address, username, callbackHash), entry);
        return entry;
    }
    /**
     * Delete an entry from the cache.
     */
    deleteEntry(address, username, callbackHash) {
        this.entries.delete(this.cacheKey(address, username, callbackHash));
    }
    /**
     * Get an entry from the cache.
     */
    getEntry(address, username, callbackHash) {
        return this.entries.get(this.cacheKey(address, username, callbackHash));
    }
    /**
     * Delete all expired entries from the cache.
     */
    deleteExpiredEntries() {
        for (const [key, entry] of this.entries) {
            if (!entry.isValid()) {
                this.entries.delete(key);
            }
        }
    }
}
exports.TokenEntryCache = TokenEntryCache;
/**
 * Get an expiration time in milliseconds past epoch. Defaults to immediate.
 */
function expirationTime(expiresInSeconds) {
    return Date.now() + (expiresInSeconds ?? DEFAULT_EXPIRATION_SECS) * 1000;
}
//# sourceMappingURL=token_entry_cache.js.map