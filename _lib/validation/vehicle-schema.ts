import { z } from "zod";

export const vehicleBasicInfoSchema = z.object({
  year: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Year is required"
          : "Year must be a number (e.g. 2024)",
    })
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  make: z.string().min(1, "Make is required").max(50),
  model: z.string().min(1, "Model is required").max(50),
  vin: z.string().min(1, "VIN is required").max(20),
  colour: z.string().min(1, "Colour is required").max(30),
  odometer: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Odometer is required"
          : "Odometer must be a number",
    })
    .int()
    .min(0),
  transmission: z.enum(["manual", "automatic", "cvt"], {
    message: "Please select a transmission type",
  }),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "lpg"], {
    message: "Please select a fuel type",
  }),
  engineCapacity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Engine capacity is required"
          : "Engine capacity must be a valid number",
    })
    .min(0),
  driveType: z.enum(["2WD", "4WD", "AWD"], {
    message: "Please select a drive type",
  }),
  bodyType: z.string().min(1, "Body type is required").max(30),
  seats: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Seats is required"
          : "Seats must be a number",
    })
    .int()
    .min(1)
    .max(10),
  doors: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Doors is required"
          : "Doors must be a number",
    })
    .int()
    .min(1)
    .max(6),
  condition: z.enum(["excellent", "good", "fair", "poor"], {
    message: "Please select the vehicle's condition",
  }),
  serviceHistory: z.string().min(1, "Service history is required").max(500),
  accidentHistory: z.enum(["yes", "no"], {
    message: "Accident history is required",
  }),
  financeOwing: z.enum(["yes", "no"], {
    message: "Finance owing status is required",
  }),
  modifications: z
    .string()
    .min(1, "Modifications details are required (or 'None')")
    .max(500),
  notes: z.string().max(1000).optional(),
  registrationExpiry: z.string().optional(),
  registrationNumber: z.string().max(20).optional(),
  isUnregistered: z.boolean().optional(),
});

export const vehicleListingSchema = z.object({
  listingType: z
    .string()
    .refine(
      (val) => val === "tender" || val === "buy-now",
      "Please select a listing type",
    ),
  price: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Price is required"
          : "Price must be a valid number",
    })
    .min(0),
  reservePrice: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Tender Reserve Price is required"
          : "Reserve price must be a valid number",
    })
    .min(0)
    .optional(),
  tenderDeadline: z.string().optional(),
});

export const vehicleMediaSchema = z.object({
  images: z.array(z.string()).optional(),
  primaryImage: z.string().optional(),
});

export const vehicleStatusSchema = z.object({
  status: z.enum(["draft", "active", "sold", "delisted"]),
});

const baseSchema = z
  .object({
    ...vehicleBasicInfoSchema.shape,
    ...vehicleListingSchema.shape,
    ...vehicleMediaSchema.shape,
    ...vehicleStatusSchema.shape,
  })
  .partial();

const draftRequiredFields = {
  year: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Year is required"
          : "Year must be a number",
    })
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  make: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Make is required" : "Make must be text",
    })
    .min(1, "Make is required")
    .max(50),
  model: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Model is required" : "Model must be text",
    })
    .min(1, "Model is required")
    .max(50),
  price: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Price is required"
          : "Price must be a number",
    })
    .min(0),
  listingType: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Listing type is required"
          : "Listing type must be text",
    })
    .min(1, "Listing type is required")
    .refine(
      (val) => val === "tender" || val === "buy-now",
      "Please select a valid listing type",
    ),
};

const allActiveFields = {
  ...draftRequiredFields,
  transmission: z.enum(["manual", "automatic", "cvt"], {
    error: "Please select a transmission type",
  }),
  fuelType: z.enum(["petrol", "diesel", "hybrid", "electric", "lpg"], {
    error: "Please select a fuel type",
  }),
  engineCapacity: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Engine capacity is required"
          : "Engine capacity must be a number",
    })
    .min(0, "Engine capacity must be 0 or greater"),
  odometer: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Odometer is required"
          : "Odometer must be a number",
    })
    .min(0, "Odometer must be 0 or greater"),
  vin: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "VIN is required" : "VIN must be text",
    })
    .min(1, "VIN is required")
    .max(20),
  colour: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Colour is required"
          : "Colour must be text",
    })
    .min(1, "Colour is required")
    .max(30),
  driveType: z.enum(["2WD", "4WD", "AWD"], {
    error: "Please select a drive type",
  }),
  bodyType: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Body type is required"
          : "Body type must be text",
    })
    .min(1, "Body type is required")
    .max(30),
  seats: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Seats is required"
          : "Seats must be a number",
    })
    .int()
    .min(1)
    .max(10),
  doors: z
    .number({
      error: (issue) =>
        issue.input === undefined
          ? "Doors is required"
          : "Doors must be a number",
    })
    .int()
    .min(1)
    .max(6),
  condition: z.enum(["excellent", "good", "fair", "poor"], {
    error: "Please select the vehicle's condition",
  }),
  serviceHistory: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Service history is required"
          : "Service history must be text",
    })
    .min(1, "Service history is required")
    .max(500),
  accidentHistory: z.enum(["yes", "no"], {
    error: "Accident history is required",
  }),
  financeOwing: z.enum(["yes", "no"], {
    error: "Finance owing status is required",
  }),
  modifications: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Modifications details are required"
          : "Modifications must be text",
    })
    .min(1, "Modifications details are required (or 'None')")
    .max(500),
};

const refineTender = (data: any, ctx: z.RefinementCtx) => {
  if (data.listingType === "tender") {
    if (data.reservePrice === undefined || data.reservePrice === null) {
      ctx.addIssue({
        code: "custom",
        message: "Reserve Price is required",
        path: ["reservePrice"],
      });
    }
    if (!data.tenderDeadline) {
      ctx.addIssue({
        code: "custom",
        message: "Tender Deadline is required",
        path: ["tenderDeadline"],
      });
    }
  }
};

const refineRegistration = (data: any, ctx: z.RefinementCtx) => {
  if (!data.isUnregistered) {
    if (!data.registrationNumber || data.registrationNumber.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Registration number is required",
        path: ["registrationNumber"],
      });
    }
    if (!data.registrationExpiry || data.registrationExpiry.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: "Registration expiry is required",
        path: ["registrationExpiry"],
      });
    }
  }
};

const draftSchema = baseSchema
  .extend(draftRequiredFields)
  .extend({ status: z.literal("draft") })
  .superRefine(refineTender)
  .superRefine(refineRegistration);

const activeSchema = baseSchema
  .extend(allActiveFields)
  .extend({ status: z.literal("active") })
  .superRefine(refineTender)
  .superRefine(refineRegistration);

const soldSchema = baseSchema.extend({ status: z.literal("sold") });

const delistedSchema = baseSchema.extend({ status: z.literal("delisted") });

export const createVehicleSchema = z.discriminatedUnion("status", [
  draftSchema,
  activeSchema,
  soldSchema,
  delistedSchema,
]);

export const updateVehicleSchema = createVehicleSchema;

export const partialUpdateVehicleSchema = baseSchema;

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
export type PartialUpdateVehicleInput = z.infer<
  typeof partialUpdateVehicleSchema
>;
