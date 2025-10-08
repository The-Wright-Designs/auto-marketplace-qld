"use server";

import { RateLimiter } from "@/_lib/utils/rate-limiter";
import { headers } from "next/headers";
import crypto from "crypto";

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
    // Generate cryptographically secure session ID
    const sessionId = crypto.randomBytes(32).toString("hex");

    return {
      success: true,
      sessionId,
    };
  } catch (error) {
    console.error("Error generating session ID:", error);
    return {
      success: false,
      error: "Failed to generate session ID. Please try again.",
    };
  }
}
