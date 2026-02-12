"use server";

import { adminDb } from "@/_lib/firebase/firestore-admin";
import {
  Offer,
  OfferVehicleInfo,
  OfferDealerInfo,
} from "@/_types/offer-types";

interface RecordOfferInput {
  vehicleUid: string;
  dealerUid: string;
  offerPrice: number;
  listPrice: number;
  vehicle: OfferVehicleInfo;
}

type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function recordOffer(
  input: RecordOfferInput,
): Promise<ActionResponse<Offer>> {
  try {
    const { vehicleUid, dealerUid, offerPrice, listPrice, vehicle } = input;
    const docId = `${vehicleUid}_${dealerUid}`;
    const offerRef = adminDb.collection("offers").doc(docId);
    const existingDoc = await offerRef.get();

    const dealerSnapshot = await adminDb
      .collection("dealers")
      .where("uid", "==", dealerUid)
      .limit(1)
      .get();

    if (dealerSnapshot.empty) {
      return { success: false, error: "Dealer information not found." };
    }

    if (existingDoc.exists) {
      return {
        success: false,
        error: "You have already made an offer on this vehicle.",
      };
    }

    const dealerData = dealerSnapshot.docs[0].data();
    const dealer: OfferDealerInfo = {
      firstName: dealerData.firstName || "",
      surname: dealerData.surname || "",
      email: dealerData.email || "",
      phone: dealerData.phone || "",
    };

    const cleanVehicle: OfferVehicleInfo = {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      registrationNumber: vehicle.registrationNumber || "",
      featuredImagePath: vehicle.featuredImagePath || "",
    };

    const offerData: Offer = {
      vehicleUid,
      dealerUid,
      offerPrice,
      listPrice,
      offerTimestamp: new Date().toISOString(),
      vehicle: cleanVehicle,
      dealer,
    };

    await offerRef.set(offerData);
    return { success: true, data: offerData };
  } catch (error) {
    console.error("Record offer error:", error);
    return {
      success: false,
      error: "Failed to record offer. Please try again.",
    };
  }
}

export async function getDealerOfferForVehicle(
  vehicleUid: string,
  dealerUid: string,
): Promise<ActionResponse<Offer | null>> {
  try {
    const docId = `${vehicleUid}_${dealerUid}`;
    const doc = await adminDb.collection("offers").doc(docId).get();

    if (!doc.exists) {
      return { success: true, data: null };
    }

    return { success: true, data: doc.data() as Offer };
  } catch (error) {
    console.error("Get dealer offer for vehicle error:", error);
    return {
      success: false,
      error: "Failed to fetch offer. Please try again.",
    };
  }
}

export async function getDealerOffers(
  dealerUid: string,
): Promise<ActionResponse<Offer[]>> {
  try {
    const snapshot = await adminDb
      .collection("offers")
      .where("dealerUid", "==", dealerUid)
      .orderBy("offerTimestamp", "desc")
      .get();

    const offers = snapshot.docs.map((doc) => doc.data() as Offer);
    return { success: true, data: offers };
  } catch (error) {
    console.error("Get dealer offers error:", error);
    return {
      success: false,
      error: "Failed to fetch offers. Please try again.",
    };
  }
}
