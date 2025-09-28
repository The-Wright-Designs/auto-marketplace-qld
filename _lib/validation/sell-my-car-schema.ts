import { z } from "zod";

export const sellMyCarSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name contains invalid characters"),

  lastName: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be less than 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name contains invalid characters"),

  email: z
    .string()
    .email("Invalid email address")
    .max(254, "Email address too long"),

  contactNumber: z
    .string()
    .min(8, "Contact number too short")
    .max(20, "Contact number too long")
    .regex(/^[\+]?[0-9\s\-\(\)]+$/, "Invalid contact number format"),

  vehicleMake: z
    .string()
    .min(1, "Vehicle make is required")
    .max(50, "Vehicle make must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Vehicle make contains invalid characters"),

  vehicleModel: z
    .string()
    .min(1, "Vehicle model is required")
    .max(50, "Vehicle model must be less than 50 characters")
    .regex(/^[a-zA-Z0-9\s\-]+$/, "Vehicle model contains invalid characters"),

  vehicleYear: z
    .number()
    .int("Vehicle year must be a whole number")
    .min(1900, "Vehicle year too old")
    .max(new Date().getFullYear() + 1, "Vehicle year cannot be in the future"),

  fuelType: z.enum(["diesel", "petrol"], {
    message: "Invalid fuel type selected",
  }),

  transmission: z.enum(["manual", "automatic"], {
    message: "Invalid transmission type selected",
  }),

  recaptchaToken: z.string().min(1, "reCAPTCHA verification required"),

  _honey: z.string().max(0, "Spam detected"), // Honeypot should be empty
});

export type SellMyCarFormData = z.infer<typeof sellMyCarSchema>;

// Individual field schemas for real-time validation
export const fieldSchemas = {
  firstName: sellMyCarSchema.shape.firstName,
  lastName: sellMyCarSchema.shape.lastName,
  email: sellMyCarSchema.shape.email,
  contactNumber: sellMyCarSchema.shape.contactNumber,
  vehicleMake: sellMyCarSchema.shape.vehicleMake,
  vehicleModel: sellMyCarSchema.shape.vehicleModel,
  vehicleYear: sellMyCarSchema.shape.vehicleYear,
  fuelType: sellMyCarSchema.shape.fuelType,
  transmission: sellMyCarSchema.shape.transmission,
};

// Validation helper
export function validateSellMyCarForm(formData: FormData): {
  success: boolean;
  data?: SellMyCarFormData;
  errors?: z.ZodError;
  fieldErrors?: Record<string, string>;
} {
  try {
    const rawData = {
      firstName: formData.get("firstName")?.toString() || "",
      lastName: formData.get("lastName")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      contactNumber: formData.get("contactNumber")?.toString() || "",
      vehicleMake: formData.get("vehicleMake")?.toString() || "",
      vehicleModel: formData.get("vehicleModel")?.toString() || "",
      vehicleYear: parseInt(formData.get("vehicleYear")?.toString() || "0"),
      fuelType: formData.get("fuelType")?.toString() || "",
      transmission: formData.get("transmission")?.toString() || "",
      recaptchaToken: formData.get("recaptchaToken")?.toString() || "",
      _honey: formData.get("_honey")?.toString() || "",
    };

    const validatedData = sellMyCarSchema.parse(rawData);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors: Record<string, string> = {};
      error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        fieldErrors[field] = issue.message;
      });

      return {
        success: false,
        errors: error,
        fieldErrors,
      };
    }
    throw error;
  }
}

// Validate individual field
export function validateField(
  fieldName: string,
  value: any
): {
  isValid: boolean;
  error?: string;
} {
  try {
    const schema = fieldSchemas[fieldName as keyof typeof fieldSchemas];
    if (!schema) {
      return { isValid: true };
    }

    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        isValid: false,
        error: error.issues[0]?.message || "Invalid value",
      };
    }
    return { isValid: false, error: "Validation error" };
  }
}
