export interface RateLimitStatus {
  success: boolean;
  limit: number;
  remaining: number;
  resetMs: number;
}

class MemoryRateLimiter {
  private requests: Map<string, number[]> = new Map();

  check(key: string, limit: number = 60, windowMs: number = 60000): RateLimitStatus {
    const now = Date.now();
    const timestamps = this.requests.get(key) || [];
    
    // Filter out old timestamps outside the window
    const validTimestamps = timestamps.filter(t => now - t < windowMs);

    if (validTimestamps.length >= limit) {
      return {
        success: false,
        limit,
        remaining: 0,
        resetMs: windowMs - (now - validTimestamps[0]),
      };
    }

    validTimestamps.push(now);
    this.requests.set(key, validTimestamps);

    return {
      success: true,
      limit,
      remaining: limit - validTimestamps.length,
      resetMs: windowMs,
    };
  }
}

export const rateLimiter = new MemoryRateLimiter();
