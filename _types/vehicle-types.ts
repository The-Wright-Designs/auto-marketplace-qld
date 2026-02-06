export type ListingType = "tender" | "buy-now";
export type VehicleStatus = "draft" | "active" | "sold" | "delisted";

export interface VehicleBasicInfo {
  year: number;
  make: string;
  model: string;
  vin: string;
  colour: string;
  odometer: number;
  transmission: "manual" | "automatic" | "cvt";
  fuelType: "petrol" | "diesel" | "hybrid" | "electric" | "lpg";
  engineCapacity: number;
  driveType: "2WD" | "4WD" | "AWD";
  bodyType: string;
  seats: number;
  doors: number;
  condition: "excellent" | "good" | "fair" | "poor";
  serviceHistory: string;
  accidentHistory: "yes" | "no";
  financeOwing: "yes" | "no";
  modifications: string;
  notes: string;
  registrationExpiry: string;
  registrationNumber: string;
  isUnregistered?: boolean;
}

export interface VehicleListing {
  listingType: ListingType;
  price: number;
  reservePrice?: number;
  tenderDeadline?: string;
}

export interface VehicleMedia {
  images: string[];
  primaryImage: string;
}

export interface VehicleMetadata {
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Vehicle extends VehicleBasicInfo, VehicleListing {
  id: string;
  status: VehicleStatus;
  media: VehicleMedia;
  metadata: VehicleMetadata;
}
