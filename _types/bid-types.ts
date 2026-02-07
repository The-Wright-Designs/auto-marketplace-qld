export interface BidVehicleInfo {
  make: string;
  model: string;
  year: number;
  registrationNumber: string;
  featuredImageUrl: string;
  tenderDeadline: string;
}

export interface BidDealerInfo {
  firstName: string;
  surname: string;
  email: string;
  phone: string;
}

export interface BidHistoryEntry {
  bidPrice: number;
  bidTimestamp: string;
}

export interface Bid {
  vehicleUid: string;
  dealerUid: string;
  bidPrice: number;
  bidTimestamp: string;
  vehicle: BidVehicleInfo;
  dealer: BidDealerInfo;
  previousBids: BidHistoryEntry[];
  tenderResult?: "won" | "lost";
}
