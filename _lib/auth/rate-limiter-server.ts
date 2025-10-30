import { RATE_LIMIT_CONFIG, RateLimitInfo } from "@/_types/auth-types";

// In-memory rate limit store (server-side only)
const rateLimitStore = new Map<
  string,
  {
    attempts: number;
    resetTime: number;
    windowStart: number;
  }
>();

/**
 * Check rate limit for a specific action and identifier (server-side only)
 */
export async function checkRateLimit(
  action: "login" | "passwordReset",
  identifier: string
): Promise<RateLimitInfo> {
  const config = RATE_LIMIT_CONFIG[action];
  const now = Date.now();
  const key = `${action}:${identifier}`;

  // Get current rate limit data
  const current = rateLimitStore.get(key);

  // If no existing data or window has expired, create new entry
  if (!current || now > current.resetTime) {
    const newData = {
      attempts: 1,
      resetTime: now + config.windowMs,
      windowStart: now,
    };

    rateLimitStore.set(key, newData);

    return {
      attempts: 1,
      remaining: config.maxAttempts - 1,
      resetTime: newData.resetTime,
      isLimited: false,
    };
  }

  // Update existing entry
  const updatedData = {
    ...current,
    attempts: current.attempts + 1,
  };

  rateLimitStore.set(key, updatedData);

  const isLimited = updatedData.attempts > config.maxAttempts;
  const remaining = Math.max(0, config.maxAttempts - updatedData.attempts);

  return {
    attempts: updatedData.attempts,
    remaining,
    resetTime: updatedData.resetTime,
    isLimited,
  };
}

/**
 * Reset rate limit for a specific action and identifier
 */
export function resetRateLimit(
  action: "login" | "passwordReset",
  identifier: string
): void {
  const key = `${action}:${identifier}`;
  rateLimitStore.delete(key);
}

/**
 * Clean up expired rate limit entries
 */
export function cleanupExpiredRateLimits(): void {
  const now = Date.now();

  for (const [key, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

/**
 * Get rate limit info without incrementing attempts
 */
export function getRateLimitInfo(
  action: "login" | "passwordReset",
  identifier: string
): RateLimitInfo | null {
  const key = `${action}:${identifier}`;
  const current = rateLimitStore.get(key);

  if (!current) {
    return null;
  }

  const now = Date.now();

  // If window has expired, return null
  if (now > current.resetTime) {
    return null;
  }

  const config = RATE_LIMIT_CONFIG[action];
  const isLimited = current.attempts > config.maxAttempts;
  const remaining = Math.max(0, config.maxAttempts - current.attempts);

  return {
    attempts: current.attempts,
    remaining,
    resetTime: current.resetTime,
    isLimited,
  };
}

/**
 * Check if IP is rate limited (additional layer of protection)
 */
export async function checkIpRateLimit(
  action: "login" | "passwordReset",
  ip: string
): Promise<RateLimitInfo> {
  // Use stricter config for IP-based limiting
  const ipConfig = {
    windowMs: action === "login" ? 15 * 60 * 1000 : 60 * 60 * 1000, // Same window
    maxAttempts: action === "login" ? 10 : 5, // Stricter limits for IP
  };

  const now = Date.now();
  const key = `ip:${action}:${ip}`;

  // Get current IP rate limit data
  const current = rateLimitStore.get(key);

  // If no existing data or window has expired, create new entry
  if (!current || now > current.resetTime) {
    const newData = {
      attempts: 1,
      resetTime: now + ipConfig.windowMs,
      windowStart: now,
    };

    rateLimitStore.set(key, newData);

    return {
      attempts: 1,
      remaining: ipConfig.maxAttempts - 1,
      resetTime: newData.resetTime,
      isLimited: false,
    };
  }

  // Update existing entry
  const updatedData = {
    ...current,
    attempts: current.attempts + 1,
  };

  rateLimitStore.set(key, updatedData);

  const isLimited = updatedData.attempts > ipConfig.maxAttempts;
  const remaining = Math.max(0, ipConfig.maxAttempts - updatedData.attempts);

  return {
    attempts: updatedData.attempts,
    remaining,
    resetTime: updatedData.resetTime,
    isLimited,
  };
}

// Clean up expired entries every 5 minutes (server-side only)
if (typeof setInterval !== "undefined") {
  setInterval(cleanupExpiredRateLimits, 5 * 60 * 1000);
}
