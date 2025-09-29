"use server";

import { resizeImage } from "@/_lib/utils/image-resizer";
import { FileValidator } from "@/_lib/utils/file-validator";
import { RateLimiter } from "@/_lib/utils/rate-limiter";
import { headers } from "next/headers";

export interface ProcessedImageResult {
  success: boolean;
  processedImage?: {
    filename: string;
    contentBase64: string; // Store as base64 string instead of Buffer
    contentType: string;
    size: number;
  };
  error?: string;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}

export async function processSingleImage(
  file: File,
  sessionId: string
): Promise<ProcessedImageResult> {
  try {
    // 1. Rate limiting check for individual image uploads
    const headersList = await headers();
    const clientId = RateLimiter.getClientIdentifier(headersList);

    const rateLimitResult = await RateLimiter.checkRateLimit(clientId, true);

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

    // 2. Validate file
    const validation = await FileValidator.validateFile(file);
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error || "File validation failed",
      };
    }

    const validatedFile = validation.sanitizedFile || file;

    // 3. Process image (resize)
    const resizedImage = await resizeImage(validatedFile, 1920, 1920, 200);

    return {
      success: true,
      processedImage: {
        filename: resizedImage.filename,
        contentBase64: resizedImage.buffer.toString('base64'),
        contentType: resizedImage.contentType,
        size: resizedImage.buffer.length,
      },
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
      },
    };
  } catch (error) {
    console.error("Error processing single image:", error);
    return {
      success: false,
      error: "Failed to process image. Please try again.",
    };
  }
}