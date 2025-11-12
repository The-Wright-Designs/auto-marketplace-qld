"use server";

import { adminDb } from "@/_lib/firebase/firestore-admin";
import { adminStorage } from "@/_lib/firebase/storage-admin";
import { isAdmin } from "@/_lib/auth/get-current-user";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "@/_lib/validation/vehicle-schema";
import { Vehicle, VehicleStatus } from "@/_types/vehicle-types";
import { CreateVehicleInput, UpdateVehicleInput } from "@/_lib/validation/vehicle-schema";

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

interface ListVehiclesFilters {
  listingType?: "tender" | "buy-now";
  status?: VehicleStatus;
  limit?: number;
  offset?: number;
}

/**
 * Create a new vehicle listing
 */
export async function createVehicle(
  input: CreateVehicleInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can create vehicles",
      };
    }

    const validatedData = createVehicleSchema.parse(input);

    const now = new Date().toISOString();

    const vehicleData = {
      ...validatedData,
      status: "draft" as VehicleStatus,
      media: {
        images: validatedData.images,
        primaryImage: validatedData.primaryImage,
      },
      metadata: {
        createdBy: "admin_user",
        createdAt: now,
        updatedAt: now,
      },
    };

    const docRef = adminDb.collection("vehicles").doc();
    await docRef.set(vehicleData);

    return {
      success: true,
      data: { id: docRef.id },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to create vehicle: ${message}`,
    };
  }
}

/**
 * Get a single vehicle by ID
 */
export async function getVehicle(
  vehicleId: string
): Promise<ActionResult<Vehicle>> {
  try {
    const docRef = adminDb.collection("vehicles").doc(vehicleId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        success: false,
        error: "Vehicle not found",
      };
    }

    const data = doc.data();
    if (!data) {
      return {
        success: false,
        error: "Vehicle data is corrupted",
      };
    }

    const vehicle: Vehicle = {
      id: doc.id,
      year: data.year,
      make: data.make,
      model: data.model,
      vin: data.vin,
      colour: data.colour,
      odometer: data.odometer,
      odometerUnit: data.odometerUnit,
      transmission: data.transmission,
      fuelType: data.fuelType,
      engineCapacity: data.engineCapacity,
      driveType: data.driveType,
      bodyType: data.bodyType,
      seats: data.seats,
      doors: data.doors,
      condition: data.condition,
      serviceHistory: data.serviceHistory,
      accidentHistory: data.accidentHistory,
      modifications: data.modifications,
      notes: data.notes,
      registrationExpiry: data.registrationExpiry,
      registrationNumber: data.registrationNumber,
      listingType: data.listingType,
      price: data.price,
      reservePrice: data.reservePrice,
      tenderDeadline: data.tenderDeadline,
      status: data.status,
      media: data.media,
      metadata: data.metadata,
    };

    return {
      success: true,
      data: vehicle,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to get vehicle: ${message}`,
    };
  }
}

/**
 * List vehicles with optional filtering and pagination
 */
export async function listVehicles(
  filters?: ListVehiclesFilters
): Promise<ActionResult<Vehicle[]>> {
  try {
    let query = adminDb.collection("vehicles") as any;

    if (filters?.listingType) {
      query = query.where("listingType", "==", filters.listingType);
    }

    if (filters?.status) {
      query = query.where("status", "==", filters.status);
    }

    query = query.orderBy("metadata.createdAt", "desc");

    if (filters?.offset) {
      query = query.offset(filters.offset);
    }

    const limit = filters?.limit || 20;
    query = query.limit(limit);

    const snapshot = await query.get();

    const vehicles: Vehicle[] = snapshot.docs.map((doc: any) => {
      const data = doc.data();
      return {
        id: doc.id,
        year: data.year,
        make: data.make,
        model: data.model,
        vin: data.vin,
        colour: data.colour,
        odometer: data.odometer,
        odometerUnit: data.odometerUnit,
        transmission: data.transmission,
        fuelType: data.fuelType,
        engineCapacity: data.engineCapacity,
        driveType: data.driveType,
        bodyType: data.bodyType,
        seats: data.seats,
        doors: data.doors,
        condition: data.condition,
        serviceHistory: data.serviceHistory,
        accidentHistory: data.accidentHistory,
        modifications: data.modifications,
        notes: data.notes,
        registrationExpiry: data.registrationExpiry,
        registrationNumber: data.registrationNumber,
        listingType: data.listingType,
        price: data.price,
        reservePrice: data.reservePrice,
        tenderDeadline: data.tenderDeadline,
        status: data.status,
        media: data.media,
        metadata: data.metadata,
      };
    });

    return {
      success: true,
      data: vehicles,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to list vehicles: ${message}`,
    };
  }
}

/**
 * Update an existing vehicle
 */
export async function updateVehicle(
  vehicleId: string,
  input: UpdateVehicleInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can update vehicles",
      };
    }

    const validatedData = updateVehicleSchema.parse(input);

    const docRef = adminDb.collection("vehicles").doc(vehicleId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        success: false,
        error: "Vehicle not found",
      };
    }

    const docData = doc.data();
    const updateData: any = { ...validatedData };

    if (validatedData.images || validatedData.primaryImage) {
      updateData.media = {
        images: validatedData.images || docData?.media?.images,
        primaryImage:
          validatedData.primaryImage || docData?.media?.primaryImage,
      };
      delete updateData.images;
      delete updateData.primaryImage;
    }

    updateData["metadata.updatedAt"] = new Date().toISOString();

    await docRef.update(updateData);

    return {
      success: true,
      data: { id: vehicleId },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to update vehicle: ${message}`,
    };
  }
}

/**
 * Delete a vehicle (soft delete by changing status to 'delisted')
 */
export async function deleteVehicle(
  vehicleId: string,
  hardDelete = false
): Promise<ActionResult<{ id: string }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can delete vehicles",
      };
    }

    const docRef = adminDb.collection("vehicles").doc(vehicleId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        success: false,
        error: "Vehicle not found",
      };
    }

    if (hardDelete) {
      const vehicleData = doc.data();
      if (vehicleData && vehicleData.media?.images) {
        const bucket = adminStorage.bucket();
        for (const imageName of vehicleData.media.images) {
          const file = bucket.file(`vehicles/${vehicleId}/${imageName}`);
          await file.delete().catch(() => {});
        }
      }

      await docRef.delete();
    } else {
      await docRef.update({
        status: "delisted",
        "metadata.updatedAt": new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: { id: vehicleId },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to delete vehicle: ${message}`,
    };
  }
}

/**
 * Upload vehicle images to Storage and update vehicle document
 */
export async function uploadVehicleImages(
  vehicleId: string,
  imageUrls: string[]
): Promise<ActionResult<{ images: string[] }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can upload images",
      };
    }

    const docRef = adminDb.collection("vehicles").doc(vehicleId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        success: false,
        error: "Vehicle not found",
      };
    }

    const docData = doc.data();
    const existingImages = docData?.media?.images || [];
    const allImages = [...existingImages, ...imageUrls];

    const primaryImage =
      docData?.media?.primaryImage || imageUrls[0] || "";

    await docRef.update({
      media: {
        images: allImages,
        primaryImage,
      },
      "metadata.updatedAt": new Date().toISOString(),
    });

    return {
      success: true,
      data: { images: allImages },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to upload images: ${message}`,
    };
  }
}

/**
 * Delete a vehicle image from Storage and update vehicle document
 */
export async function deleteVehicleImage(
  vehicleId: string,
  imageName: string
): Promise<ActionResult<{ images: string[] }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can delete images",
      };
    }

    const docRef = adminDb.collection("vehicles").doc(vehicleId);
    const doc = await docRef.get();

    if (!doc.exists) {
      return {
        success: false,
        error: "Vehicle not found",
      };
    }

    const docData = doc.data();
    const bucket = adminStorage.bucket();
    const file = bucket.file(`vehicles/${vehicleId}/${imageName}`);
    await file.delete().catch(() => {});

    const existingImages = docData?.media?.images || [];
    const updatedImages = existingImages.filter(
      (img: string) => img !== imageName
    );

    let primaryImage = docData?.media?.primaryImage;
    if (primaryImage === imageName) {
      primaryImage = updatedImages[0] || "";
    }

    if (updatedImages.length > 0) {
      await docRef.update({
        media: {
          images: updatedImages,
          primaryImage,
        },
        "metadata.updatedAt": new Date().toISOString(),
      });
    }

    return {
      success: true,
      data: { images: updatedImages },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to delete image: ${message}`,
    };
  }
}
