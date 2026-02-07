export interface SellMyCarEmailTemplateProps {
  name: string;
  email: string;
  contactNumber: string;
  vehicleMake: string;
  vehicleModel: string;
  vehicleYear: string;
  fuelType: string;
  transmission: string;
}

export interface PurchaseEmailTemplateProps {
  userEmail: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  price: string;
  featuredImageUrl: string;
  bodyType?: string;
  transmission?: string;
  engineCapacity?: number;
  fuelType?: string;
  driveType?: string;
  colour?: string;
  vin?: string;
  dealerFirstName?: string;
  dealerFullName?: string;
  dealerPhone?: string;
}

export interface OfferEmailTemplateProps {
  userEmail: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  listPrice: string;
  offerPrice: string;
  featuredImageUrl: string;
  bodyType?: string;
  transmission?: string;
  engineCapacity?: number;
  fuelType?: string;
  driveType?: string;
  colour?: string;
  vin?: string;
  dealerFirstName?: string;
  dealerFullName?: string;
  dealerPhone?: string;
}

export interface BidEmailTemplateProps {
  userEmail: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  listPrice: string;
  bidPrice: string;
  featuredImageUrl: string;
  bodyType?: string;
  transmission?: string;
  engineCapacity?: number;
  fuelType?: string;
  driveType?: string;
  colour?: string;
  vin?: string;
  tenderDeadline?: string;
  dealerFirstName?: string;
  dealerFullName?: string;
  dealerPhone?: string;
}

export interface TenderCloseBidEntry {
  rank: number;
  dealerName: string;
  dealerEmail: string;
  dealerPhone: string;
  bidPrice: string;
}

export interface TenderCloseEmailTemplateProps {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  featuredImageUrl: string;
  listPrice: string;
  tenderDeadline: string;
  bids: TenderCloseBidEntry[];
}