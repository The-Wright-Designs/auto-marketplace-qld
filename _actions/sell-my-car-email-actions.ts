"use server";

import nodemailer from "nodemailer";
import { sellMyCarEmailTemplate } from "@/_lib/utils/email-templates/sell-my-car-email-template";
import { resizeMultipleImages } from "@/_lib/utils/image-resizer";
import { verifyRecaptchaToken } from "@/_lib/verify-recaptcha";
import { SellMyCarEmailTemplateProps } from "@/_types/email-types";
import { validateSellMyCarForm } from "@/_lib/validation/sell-my-car-schema";
import { FileValidator } from "@/_lib/utils/file-validator";
import { HTMLSanitizer } from "@/_lib/utils/html-sanitizer";
import { RateLimiter } from "@/_lib/utils/rate-limiter";
import { headers } from "next/headers";

interface MailOptions {
  from: string;
  to: string;
  subject: string;
  replyTo: string;
  html: string;
  attachments?: Array<{
    filename: string;
    content: Buffer;
    contentType: string;
  }>;
}

export async function sellMyCarEmail(formData: FormData): Promise<{
  success: boolean;
  error?: string;
  fieldErrors?: Record<string, string>;
  rateLimitInfo?: {
    remaining: number;
    resetTime: number;
  };
}> {
  try {
    // 1. Rate limiting check
    const headersList = await headers();
    const clientId = RateLimiter.getClientIdentifier(headersList);

    const rateLimitResult = await RateLimiter.checkRateLimit(clientId);

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

    // 2. Validate form data with schema
    const validation = validateSellMyCarForm(formData);

    if (!validation.success) {
      return {
        success: false,
        error: "Form validation failed",
        fieldErrors: validation.fieldErrors,
      };
    }

    const validatedData = validation.data!;

    // 3. Additional honeypot check (already validated in schema)
    if (validatedData._honey !== "") {
      console.error("Invalid form submission due to non-empty honeypot field");
      return { success: false, error: "Spam detected" };
    }

    // 4. Verify reCAPTCHA
    const recaptchaResult = await verifyRecaptchaToken(
      validatedData.recaptchaToken
    );
    if (!recaptchaResult.success) {
      return {
        success: false,
        error: recaptchaResult.error || "reCAPTCHA verification failed",
      };
    }

    // 5. Validate uploaded files
    const images = formData.getAll("images") as File[];

    if (images.length < 2) {
      return {
        success: false,
        error: "At least 2 vehicle images are required",
      };
    }

    // Validate total file collection
    const fileValidation = FileValidator.validateMultipleFiles(images);
    if (fileValidation.errors.length > 0) {
      return {
        success: false,
        error: `File validation failed: ${fileValidation.errors.join(", ")}`,
      };
    }

    // Validate each file individually
    const validatedFiles: File[] = [];
    for (const file of images) {
      const individualValidation = await FileValidator.validateFile(file);
      if (!individualValidation.isValid) {
        return {
          success: false,
          error: `File validation failed: ${individualValidation.error}`,
        };
      }
      if (individualValidation.sanitizedFile) {
        validatedFiles.push(individualValidation.sanitizedFile);
      }
    }

    // 6. Process images (now with validated files)
    let attachments: Array<{
      filename: string;
      content: Buffer;
      contentType: string;
    }> = [];

    try {
      const resizedImages = await resizeMultipleImages(
        validatedFiles,
        1920,
        1920,
        200
      );
      attachments = resizedImages.map((image) => ({
        filename: image.filename,
        content: image.buffer,
        contentType: image.contentType,
      }));
    } catch (error) {
      console.error("Error resizing images:", error);
      return {
        success: false,
        error: "Failed to process images. Please try again.",
      };
    }

    // 7. Sanitize data for email template
    const sanitizedData = HTMLSanitizer.sanitizeFormData({
      name: `${validatedData.firstName} ${validatedData.lastName}`,
      email: validatedData.email,
      contactNumber: validatedData.contactNumber,
      vehicleMake: validatedData.vehicleMake,
      vehicleModel: validatedData.vehicleModel,
      vehicleYear: validatedData.vehicleYear.toString(),
      fuelType: validatedData.fuelType,
      transmission: validatedData.transmission,
    });

    // 8. Generate email content
    const emailHtmlContent = sellMyCarEmailTemplate(
      sanitizedData as SellMyCarEmailTemplateProps
    );

    // 9. Send email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
      requireTLS: true,
    });

    const mailOptions: MailOptions = {
      from: process.env.SMTP_USER as string,
      to: process.env.SMTP_SEND_TO as string,
      subject: "Vehicle Sell Request - AMQ",
      replyTo: sanitizedData.email,
      html: emailHtmlContent,
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    await transporter.sendMail(mailOptions);

    return {
      success: true,
      rateLimitInfo: {
        remaining: rateLimitResult.remaining,
        resetTime: rateLimitResult.resetTime,
      },
    };
  } catch (error) {
    console.error("Sell my car form error:", error);
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}
