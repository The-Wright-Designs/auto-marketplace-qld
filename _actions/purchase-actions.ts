"use server";

import { adminDb } from "@/_lib/firebase/firestore-admin";
import {
  Purchase,
  PurchaseVehicleInfo,
  PurchaseDealerInfo,
} from "@/_types/purchase-types";

interface RecordPurchaseInput {
  vehicleUid: string;
  dealerUid: string;
  purchasePrice: number;
  vehicle: PurchaseVehicleInfo;
}

type ActionResponse<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string };

export async function recordPurchase(
  input: RecordPurchaseInput,
): Promise<ActionResponse<Purchase>> {
  try {
    const { vehicleUid, dealerUid, purchasePrice, vehicle } = input;
    const docId = `${vehicleUid}_${dealerUid}`;
    const purchaseRef = adminDb.collection("purchases").doc(docId);
    const existingDoc = await purchaseRef.get();

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
        error: "You have already made an offer to purchase this vehicle.",
      };
    }

    const dealerData = dealerSnapshot.docs[0].data();
    const dealer: PurchaseDealerInfo = {
      firstName: dealerData.firstName || "",
      surname: dealerData.surname || "",
      email: dealerData.email || "",
      phone: dealerData.phone || "",
    };

    const cleanVehicle: PurchaseVehicleInfo = {
      make: vehicle.make,
      model: vehicle.model,
      year: vehicle.year,
      registrationNumber: vehicle.registrationNumber || "",
      featuredImageUrl: vehicle.featuredImageUrl || "",
    };

    const purchaseData: Purchase = {
      vehicleUid,
      dealerUid,
      purchasePrice,
      purchaseTimestamp: new Date().toISOString(),
      vehicle: cleanVehicle,
      dealer,
    };

    await purchaseRef.set(purchaseData);
    return { success: true, data: purchaseData };
  } catch (error) {
    console.error("Record purchase error:", error);
    return {
      success: false,
      error: "Failed to record purchase. Please try again.",
    };
  }
}

export async function getDealerPurchaseForVehicle(
  vehicleUid: string,
  dealerUid: string,
): Promise<ActionResponse<Purchase | null>> {
  try {
    const docId = `${vehicleUid}_${dealerUid}`;
    const doc = await adminDb.collection("purchases").doc(docId).get();

    if (!doc.exists) {
      return { success: true, data: null };
    }

    return { success: true, data: doc.data() as Purchase };
  } catch (error) {
    console.error("Get dealer purchase for vehicle error:", error);
    return {
      success: false,
      error: "Failed to fetch purchase. Please try again.",
    };
  }
}

export async function getDealerPurchases(
  dealerUid: string,
): Promise<ActionResponse<Purchase[]>> {
  try {
    const snapshot = await adminDb
      .collection("purchases")
      .where("dealerUid", "==", dealerUid)
      .orderBy("purchaseTimestamp", "desc")
      .get();

    const purchases = snapshot.docs.map((doc) => doc.data() as Purchase);
    return { success: true, data: purchases };
  } catch (error) {
    console.error("Get dealer purchases error:", error);
    return {
      success: false,
      error: "Failed to fetch purchases. Please try again.",
    };
  }
}
