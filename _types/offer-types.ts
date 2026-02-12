export interface OfferVehicleInfo {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  featuredImagePath: string;
  featuredImageUrl?: string;
}

export interface OfferDealerInfo {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

export interface Offer {
  vehicleUid: string;
  dealerUid: string;
  offerPrice: number;
  listPrice: number;
  offerTimestamp: string;
  vehicle: OfferVehicleInfo;
  dealer: OfferDealerInfo;
}
