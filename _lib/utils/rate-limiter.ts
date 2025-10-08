interface RateLimitEntry {
  count: number;
  resetTime: number;
  blocked: boolean;
  imageUploads: number; // Add tracking for image uploads
}

export class RateLimiter {
  private static cache = new Map<string, RateLimitEntry>();

  // Configuration
  private static readonly WINDOW_MS = 60 * 60 * 1000; // 1 hour
  private static readonly MAX_SUBMISSIONS = 5; // 5 form submissions per hour
  private static readonly MAX_IMAGES_PER_SUBMISSION = 10; // Maximum images per submission
  private static readonly BLOCK_DURATION_MS = 2 * 60 * 60 * 1000; // 2 hours

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
        count: isProgressiveUpload ? 0 : 1,
        imageUploads: isProgressiveUpload ? 1 : 0,
        resetTime: now + this.WINDOW_MS,
        blocked: false,
      });

      return {
        allowed: true,
        remaining: isProgressiveUpload
          ? this.MAX_IMAGES_PER_SUBMISSION - 1
          : this.MAX_SUBMISSIONS - 1,
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
      entry.count = isProgressiveUpload ? 0 : 1;
      entry.imageUploads = isProgressiveUpload ? 1 : 0;
      entry.resetTime = now + this.WINDOW_MS;
      entry.blocked = false;

      return {
        allowed: true,
        remaining: isProgressiveUpload
          ? this.MAX_IMAGES_PER_SUBMISSION - 1
          : this.MAX_SUBMISSIONS - 1,
        resetTime: entry.resetTime,
      };
    }

    if (isProgressiveUpload) {
      // Check if exceeded max images per submission BEFORE incrementing
      if (entry.imageUploads >= this.MAX_IMAGES_PER_SUBMISSION) {
        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          error: "Maximum number of images exceeded for this submission.",
        };
      }

      // Handle image upload
      entry.imageUploads++;

      return {
        allowed: true,
        remaining: this.MAX_IMAGES_PER_SUBMISSION - entry.imageUploads,
        resetTime: entry.resetTime,
      };
    } else {
      // Check if exceeded max submissions BEFORE incrementing
      if (entry.count >= this.MAX_SUBMISSIONS) {
        entry.blocked = true;
        entry.resetTime = now + this.BLOCK_DURATION_MS;

        return {
          allowed: false,
          remaining: 0,
          resetTime: entry.resetTime,
          error: "Too many submission attempts. Please try again later.",
        };
      }

      // Handle form submission
      entry.count++;
      entry.imageUploads = 0; // Reset image count for new submission
    }

    return {
      allowed: true,
      remaining: this.MAX_SUBMISSIONS - entry.count,
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
      return {
        count: 0,
        remaining: isProgressiveUpload
          ? this.MAX_IMAGES_PER_SUBMISSION
          : this.MAX_SUBMISSIONS,
        resetTime: now + this.WINDOW_MS,
        blocked: false,
      };
    }

    return {
      count: isProgressiveUpload ? entry.imageUploads : entry.count,
      remaining: Math.max(
        0,
        isProgressiveUpload
          ? this.MAX_IMAGES_PER_SUBMISSION - entry.imageUploads
          : this.MAX_SUBMISSIONS - entry.count
      ),
      resetTime: entry.resetTime,
      blocked: entry.blocked,
    };
  }
}
