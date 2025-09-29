"use server";

import { RateLimiter } from "@/_lib/utils/rate-limiter";
import { headers } from "next/headers";
import crypto from 'crypto';

export interface GenerateSessionIdResult {
  success: boolean;
  sessionId?: string;
  error?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

export async function generateSecureSessionId(): Promise<GenerateSessionIdResult> {
  try {
    // Rate limiting check for session ID generation
    const headersList = await headers();
    const clientId = RateLimiter.getClientIdentifier(headersList);

    const rateLimitResult = await RateLimiter.checkRateLimit(clientId, false);

    if (!rateLimitResult.allowed) {
      return {
        success: false,
        error: rateLimitResult.error || "Too many requests",
        rateLimitInfo: {
          remaining: rateLimitResult.remaining,
          resetTime: rateLimitResult.resetTime,
        },
      };
    }

    // Generate cryptographically secure session ID
    const sessionId = crypto.randomBytes(32).toString('hex');

    return {
      success: true,
      sessionId,
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
      },
    };
  } catch (error) {
    console.error("Error generating session ID:", error);
    return {
      success: false,
      error: "Failed to generate session ID. Please try again.",
    };
  }
}