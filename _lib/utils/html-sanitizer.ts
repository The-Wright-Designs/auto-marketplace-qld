import DOMPurify from "isomorphic-dompurify";

export class HTMLSanitizer {
  // Email-safe HTML escaping
  static escapeHtml(unsafe: string): string {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  // Sanitize for email content (more restrictive)
  static sanitizeForEmail(input: string): string {
    // First escape HTML
    const escaped = this.escapeHtml(input);

    // Additional email-specific sanitization
    return escaped
      .replace(/javascript:/gi, "")
      .replace(/vbscript:/gi, "")
      .replace(/on\w+=/gi, "")
      .trim();
  }

  // Validate email addresses specifically
  static sanitizeEmail(email: string): string {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const sanitized = this.sanitizeForEmail(email);

    if (!emailRegex.test(sanitized)) {
      throw new Error("Invalid email format after sanitization");
    }

    return sanitized;
  }

  // Sanitize phone numbers
  static sanitizePhoneNumber(phone: string): string {
    return phone.replace(/[^\d\s\-\(\)\+]/g, "").trim();
  }

  // General text sanitization for form inputs
  static sanitizeText(input: string): string {
    return DOMPurify.sanitize(input, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      KEEP_CONTENT: true,
    }).trim();
  }

  // Sanitize and validate vehicle information
  static sanitizeVehicleInfo(input: string): string {
    const sanitized = this.sanitizeText(input);

    // Remove any remaining special characters that could be problematic
    return sanitized
      .replace(/[<>\"']/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  // Comprehensive sanitization for all form fields
  static sanitizeFormData(data: Record<string, any>): Record<string, any> {
    const sanitized: Record<string, any> = {};

    for (const [key, value] of Object.entries(data)) {
      if (typeof value === "string") {
        switch (key) {
          case "email":
            try {
              sanitized[key] = this.sanitizeEmail(value);
            } catch {
              sanitized[key] = ""; // Invalid email becomes empty
            }
            break;
          case "contactNumber":
            sanitized[key] = this.sanitizePhoneNumber(value);
            break;
          case "vehicleMake":
          case "vehicleModel":
          case "fuelType":
          case "transmission":
            sanitized[key] = this.sanitizeVehicleInfo(value);
            break;
          default:
            sanitized[key] = this.sanitizeText(value);
        }
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
