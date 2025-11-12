import { z } from 'zod';

export const vehicleBasicInfoSchema = z.object({
  year: z.number().int().min(1900).max(new Date().getFullYear() + 1),
  make: z.string().min(1).max(50),
  model: z.string().min(1).max(50),
  vin: z.string().min(1).max(20),
  colour: z.string().min(1).max(30),
  odometer: z.number().int().min(0),
  odometerUnit: z.enum(['km', 'mi']),
  transmission: z.enum(['manual', 'automatic', 'cvt']),
  fuelType: z.enum(['petrol', 'diesel', 'hybrid', 'electric', 'lpg']),
  engineCapacity: z.number().min(0),
  driveType: z.enum(['2WD', '4WD', 'AWD']),
  bodyType: z.string().min(1).max(30),
  seats: z.number().int().min(1).max(10),
  doors: z.number().int().min(1).max(6),
  condition: z.enum(['excellent', 'good', 'fair', 'poor']),
  serviceHistory: z.string().max(500),
  accidentHistory: z.string().max(500),
  modifications: z.string().max(500),
  notes: z.string().max(1000),
  registrationExpiry: z.string(),
  registrationNumber: z.string().min(1).max(20),
});

export const vehicleListingSchema = z.object({
  listingType: z.enum(['tender', 'buy-now']),
  price: z.number().min(0),
  reservePrice: z.number().min(0).optional(),
  tenderDeadline: z.string().optional(),
});

export const vehicleMediaSchema = z.object({
  images: z.array(z.string()).min(1),
  primaryImage: z.string().min(1),
});

export const createVehicleSchema = vehicleBasicInfoSchema
  .merge(vehicleListingSchema)
  .merge(vehicleMediaSchema);

export const updateVehicleSchema = createVehicleSchema.partial();

export type CreateVehicleInput = z.infer<typeof createVehicleSchema>;
export type UpdateVehicleInput = z.infer<typeof updateVehicleSchema>;
