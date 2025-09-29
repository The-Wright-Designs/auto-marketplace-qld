interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
}

export class RateLimiter {
  private static cache = new Map<string, RateLimitEntry>();

  // Configuration
  private static readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour
  private static readonly MAX_REQUESTS = 3; // 3 submissions per hour (increased for progressive uploads)
  private static readonly MAX_PROGRESSIVE_REQUESTS = 30; // 30 progressive image uploads per hour
  private static readonly BLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

  static async checkRateLimit(
    identifier: string,
    isProgressiveUpload = false
  ): Promise<{
    allowed: boolean;
    remaining: number;
    resetTime: number;
    error?: string;
  }> {
    const now = Date.now();
    const entry = this.cache.get(identifier);

    // Clean up expired entries
    this.cleanup();

    if (!entry) {
      // First request
      this.cache.set(identifier, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
        blocked: false,
      });

      const maxRequests = isProgressiveUpload
        ? this.MAX_PROGRESSIVE_REQUESTS
        : this.MAX_REQUESTS;
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: now + this.WINDOW_MS,
      };
    }

    // Check if blocked
    if (entry.blocked && now < entry.resetTime) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        error: "Too many requests. Please try again later.",
      };
    }

    // Reset window if expired
    if (now >= entry.resetTime) {
      entry.count = 1;
      entry.resetTime = now + this.WINDOW_MS;
      entry.blocked = false;

      const maxRequests = isProgressiveUpload
        ? this.MAX_PROGRESSIVE_REQUESTS
        : this.MAX_REQUESTS;
      return {
        allowed: true,
        remaining: maxRequests - 1,
        resetTime: entry.resetTime,
      };
    }

    // Increment count
    entry.count++;

    // Use appropriate limit based on request type
    const maxRequests = isProgressiveUpload
      ? this.MAX_PROGRESSIVE_REQUESTS
      : this.MAX_REQUESTS;

    // Check if limit exceeded
    if (entry.count > maxRequests) {
      entry.blocked = true;
      entry.resetTime = now + this.BLOCK_DURATION_MS; // Block for 24 hours

      return {
        allowed: false,
        remaining: 0,
        resetTime: entry.resetTime,
        error:
          "Too many submission attempts. Please contact our support team for assistance.",
      };
    }

    return {
      allowed: true,
      remaining: maxRequests - entry.count,
      resetTime: entry.resetTime,
    };
  }

  private static cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now >= entry.resetTime && !entry.blocked) {
        this.cache.delete(key);
      }
    }
  }

  // Get client identifier (IP + User Agent hash)
  static getClientIdentifier(headers: Headers): string {
    const forwarded = headers.get("x-forwarded-for");
    const ip = forwarded
      ? forwarded.split(",")[0]
      : headers.get("x-real-ip") || "unknown";

    const userAgent = headers.get("user-agent") || "";

    // Create a hash of IP + User Agent for privacy
    const crypto = require("crypto");
    return crypto
      .createHash("sha256")
      .update(ip + userAgent)
      .digest("hex")
      .substring(0, 16);
  }

  // Format time remaining for user display
  static formatTimeRemaining(resetTime: number): string {
    const now = Date.now();
    const remaining = resetTime - now;

    if (remaining <= 0) return "now";

    const hours = Math.floor(remaining / (60 * 60 * 1000));
    const minutes = Math.floor((remaining % (60 * 60 * 1000)) / (60 * 1000));

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} and ${minutes} minute${
        minutes !== 1 ? "s" : ""
      }`;
    }

    return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
  }

  // Clear rate limit for testing purposes (use with caution)
  static clearRateLimit(identifier: string): void {
    this.cache.delete(identifier);
  }

  // Get current status without incrementing
  static getRateLimitStatus(
    identifier: string,
    isProgressiveUpload = false
  ): {
    count: number;
    remaining: number;
    resetTime: number;
    blocked: boolean;
  } {
    const entry = this.cache.get(identifier);
    const now = Date.now();

    if (!entry || now >= entry.resetTime) {
      const maxRequests = isProgressiveUpload
        ? this.MAX_PROGRESSIVE_REQUESTS
        : this.MAX_REQUESTS;
      return {
        count: 0,
        remaining: maxRequests,
        resetTime: now + this.WINDOW_MS,
        blocked: false,
      };
    }

    const maxRequests = isProgressiveUpload
      ? this.MAX_PROGRESSIVE_REQUESTS
      : this.MAX_REQUESTS;
    return {
      count: entry.count,
      remaining: Math.max(0, maxRequests - entry.count),
      resetTime: entry.resetTime,
      blocked: entry.blocked,
    };
  }
}
