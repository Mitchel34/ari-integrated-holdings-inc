/**
 * Simple in-memory rate limiter for API endpoints.
 * For production with multiple instances, use Redis or database-backed storage.
 */

interface RateLimitEntry {
    count: number;
    windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries periodically
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (now - entry.windowStart > 3600000) { // 1 hour
            store.delete(key);
        }
    }
}, 60000); // Every minute

export interface RateLimitResult {
    allowed: boolean;
    remaining: number;
    resetAt: Date;
}

/**
 * Check if a request is allowed under rate limiting.
 * @param key Unique identifier (e.g., "broadcast:userId")
 * @param limit Maximum requests allowed in the window
 * @param windowMs Time window in milliseconds
 */
export function checkRateLimit(
    key: string,
    limit: number,
    windowMs: number
): RateLimitResult {
    const now = Date.now();
    const entry = store.get(key);

    if (!entry || now - entry.windowStart >= windowMs) {
        // Start a new window
        store.set(key, { count: 1, windowStart: now });
        return {
            allowed: true,
            remaining: limit - 1,
            resetAt: new Date(now + windowMs),
        };
    }

    if (entry.count >= limit) {
        return {
            allowed: false,
            remaining: 0,
            resetAt: new Date(entry.windowStart + windowMs),
        };
    }

    entry.count++;
    return {
        allowed: true,
        remaining: limit - entry.count,
        resetAt: new Date(entry.windowStart + windowMs),
    };
}
