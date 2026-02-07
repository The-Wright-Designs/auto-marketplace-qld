'use server';

import { adminDb } from '@/_lib/firebase/firestore-admin';
import { Bid, BidHistoryEntry, BidVehicleInfo, BidDealerInfo } from '@/_types/bid-types';

interface PlaceBidInput {
  vehicleUid: string;
  dealerUid: string;
  bidPrice: number;
  vehicle: BidVehicleInfo;
}

type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function placeBid(
  input: PlaceBidInput
): Promise<ActionResponse<Bid>> {
  try {
    const { vehicleUid, dealerUid, bidPrice, vehicle } = input;
    const docId = `${vehicleUid}_${dealerUid}`;
    const bidRef = adminDb.collection('bids').doc(docId);
    const existingDoc = await bidRef.get();

    const dealerSnapshot = await adminDb
      .collection('dealers')
      .where('uid', '==', dealerUid)
      .limit(1)
      .get();

    if (dealerSnapshot.empty) {
      return { success: false, error: 'Dealer information not found.' };
    }

    if (existingDoc.exists) {
      return { success: false, error: 'You have already placed a bid on this vehicle.' };
    }

    const dealerData = dealerSnapshot.docs[0].data();
    const dealer: BidDealerInfo = {
      firstName: dealerData.firstName || '',
      surname: dealerData.surname || '',
      email: dealerData.email || '',
      phone: dealerData.phone || '',
    };

    const bidData: Bid = {
      vehicleUid,
      dealerUid,
      bidPrice,
      bidTimestamp: new Date().toISOString(),
      vehicle,
      dealer,
      previousBids: [],
    };

    await bidRef.set(bidData);
    return { success: true, data: bidData };
  } catch (error) {
    console.error('Place bid error:', error);
    return { success: false, error: 'Failed to place bid. Please try again.' };
  }
}

export async function getDealerBids(dealerUid: string): Promise<ActionResponse<Bid[]>> {
  try {
    const snapshot = await adminDb
      .collection('bids')
      .where('dealerUid', '==', dealerUid)
      .orderBy('bidTimestamp', 'desc')
      .get();

    const bids = snapshot.docs.map((doc) => doc.data() as Bid);

    const vehicleIds = [...new Set(bids.map(bid => bid.vehicleUid))];

    const vehiclePromises = vehicleIds.map(id =>
      adminDb.collection('vehicles').doc(id).get()
    );
    const vehicleDocs = await Promise.all(vehiclePromises);

    const vehicleMap = new Map();
    vehicleDocs.forEach(doc => {
      if (doc.exists) {
        vehicleMap.set(doc.id, doc.data());
      }
    });

    const updatedBids = bids.map(bid => {
      const vehicleData = vehicleMap.get(bid.vehicleUid);
      if (vehicleData && vehicleData.tenderDeadline) {
        return {
          ...bid,
          vehicle: {
            ...bid.vehicle,
            tenderDeadline: vehicleData.tenderDeadline,
          },
        };
      }
      return bid;
    });

    return { success: true, data: updatedBids };
  } catch (error) {
    console.error('Get dealer bids error:', error);
    return { success: false, error: 'Failed to fetch bids. Please try again.' };
  }
}

export async function getDealerBidForVehicle(
  vehicleUid: string,
  dealerUid: string
): Promise<ActionResponse<Bid | null>> {
  try {
    const docId = `${vehicleUid}_${dealerUid}`;
    const doc = await adminDb.collection('bids').doc(docId).get();

    if (!doc.exists) {
      return { success: true, data: null };
    }

    return { success: true, data: doc.data() as Bid };
  } catch (error) {
    console.error('Get dealer bid for vehicle error:', error);
    return { success: false, error: 'Failed to fetch bid. Please try again.' };
  }
}

export async function getVehicleBids(vehicleUid: string): Promise<ActionResponse<Bid[]>> {
  try {
    const snapshot = await adminDb
      .collection('bids')
      .where('vehicleUid', '==', vehicleUid)
      .get();

    const bids = snapshot.docs.map((doc) => doc.data() as Bid);
    return { success: true, data: bids };
  } catch (error) {
    console.error('Get vehicle bids error:', error);
    return { success: false, error: 'Failed to fetch vehicle bids. Please try again.' };
  }
}
