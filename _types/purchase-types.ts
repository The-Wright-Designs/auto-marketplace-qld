export interface PurchaseVehicleInfo {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  featuredImageUrl: string;
}

export interface PurchaseDealerInfo {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

export interface Purchase {
  vehicleUid: string;
  dealerUid: string;
  purchasePrice: number;
  purchaseTimestamp: string;
  vehicle: PurchaseVehicleInfo;
  dealer: PurchaseDealerInfo;
}
