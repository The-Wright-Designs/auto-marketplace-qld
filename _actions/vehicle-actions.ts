"use server";

import { adminDb } from "@/_lib/firebase/firestore-admin";
import { adminStorage } from "@/_lib/firebase/storage-admin";
import { isAdmin, getCurrentUser } from "@/_lib/auth/get-current-user";
import {
  createVehicleSchema,
  updateVehicleSchema,
} from "@/_lib/validation/vehicle-schema";
import { Vehicle, VehicleStatus } from "@/_types/vehicle-types";
import {
  CreateVehicleInput,
  UpdateVehicleInput,
} from "@/_lib/validation/vehicle-schema";

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

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
        error: "User not authenticated",
      };
    }

    const validatedData = createVehicleSchema.parse(input);

    const now = new Date().toISOString();

    const vehicleData: any = {
      ...validatedData,
      status: "draft" as VehicleStatus,
      media: {
        images: validatedData.images || [],
        primaryImage: validatedData.primaryImage || "",
      },
      metadata: {
        createdBy: currentUser.uid,
        createdAt: now,
        updatedAt: now,
      },
    };

    delete vehicleData.images;
    delete vehicleData.primaryImage;

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
      financeOwing: data.financeOwing,
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

    const vehicles: Vehicle[] = snapshot.docs
      .map((doc: any) => {
        const data = doc.data();
        return {
          id: doc.id,
          year: data.year,
          make: data.make,
          model: data.model,
          vin: data.vin,
          colour: data.colour,
          odometer: data.odometer,
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
          financeOwing: data.financeOwing,
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
      })
      .filter((vehicle: { status: string }) => vehicle.status !== "delisted");

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

    const primaryImage = docData?.media?.primaryImage || imageUrls[0] || "";

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
  storagePath: string
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
    const bucket = adminStorage.bucket(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    );
    const file = bucket.file(storagePath);
    await file.delete().catch(() => {});

    const existingImages = docData?.media?.images || [];
    const updatedImages = existingImages.filter(
      (img: string) => img !== storagePath
    );

    let primaryImage = docData?.media?.primaryImage;
    if (primaryImage === storagePath) {
      primaryImage = updatedImages[0] || "";
    }

    await docRef.update({
      media: {
        images: updatedImages,
        primaryImage,
      },
      "metadata.updatedAt": new Date().toISOString(),
    });

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

export async function uploadProcessedImagesToStorage(
  vehicleId: string,
  base64Images: string[],
  startIndex: number = 0
): Promise<ActionResult<string[]>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can upload images",
      };
    }

    const bucket = adminStorage.bucket(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    );
    const imageFilenames: string[] = [];

    for (let i = 0; i < base64Images.length; i++) {
      const base64Data = base64Images[i];
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let j = 0; j < binaryString.length; j++) {
        bytes[j] = binaryString.charCodeAt(j);
      }

      const filename = `image${startIndex + i}.jpg`;
      const file = bucket.file(`vehicles/${vehicleId}/${filename}`);

      try {
        await file.save(bytes, { contentType: "image/jpeg" });
        imageFilenames.push(filename);
      } catch (uploadError) {
        console.error(`Failed to upload image ${startIndex + i}:`, uploadError);
        throw new Error(`Failed to upload image ${startIndex + i + 1}`);
      }
    }

    return {
      success: true,
      data: imageFilenames,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to upload images to storage: ${message}`,
    };
  }
}

/**
 * Get vehicle images with URLs and primary image
 */
export async function getVehicleImagesWithUrls(vehicleId: string): Promise<
  ActionResult<{
    images: Array<{ filename: string; url: string }>;
    primaryImage: string;
  }>
> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can access vehicle images",
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
    const storagePaths = docData?.media?.images || [];
    const primaryImage = docData?.media?.primaryImage || "";

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      return {
        success: false,
        error: "Firebase Storage bucket name not configured",
      };
    }

    const bucket = adminStorage.bucket(bucketName);
    const images: Array<{ filename: string; url: string }> = [];

    for (const storagePath of storagePaths) {
      const file = bucket.file(storagePath);

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000,
      });

      images.push({ filename: storagePath, url });
    }

    return {
      success: true,
      data: { images, primaryImage },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to get vehicle images: ${message}`,
    };
  }
}

/**
 * Get vehicle images for multiple vehicles in batch (single admin check)
 */
export async function getMultipleVehicleImagesWithUrls(
  vehicleIds: string[]
): Promise<
  ActionResult<
    Record<
      string,
      {
        images: Array<{ filename: string; url: string }>;
        primaryImage: string;
      }
    >
  >
> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can access vehicle images",
      };
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      return {
        success: false,
        error: "Firebase Storage bucket name not configured",
      };
    }

    const bucket = adminStorage.bucket(bucketName);
    const result: Record<
      string,
      {
        images: Array<{ filename: string; url: string }>;
        primaryImage: string;
      }
    > = {};

    for (const vehicleId of vehicleIds) {
      const docRef = adminDb.collection("vehicles").doc(vehicleId);
      const doc = await docRef.get();

      if (!doc.exists) {
        result[vehicleId] = { images: [], primaryImage: "" };
        continue;
      }

      const docData = doc.data();
      const storagePaths = docData?.media?.images || [];
      const primaryImage = docData?.media?.primaryImage || "";
      const images: Array<{ filename: string; url: string }> = [];

      for (const storagePath of storagePaths) {
        const file = bucket.file(storagePath);

        const [url] = await file.getSignedUrl({
          action: "read",
          expires: Date.now() + 60 * 60 * 1000,
        });

        images.push({ filename: storagePath, url });
      }

      result[vehicleId] = { images, primaryImage };
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to get vehicle images: ${message}`,
    };
  }
}

/**
 * Upload a single vehicle image in real-time
 */
export async function uploadSingleVehicleImage(
  vehicleId: string,
  base64ImageData: string
): Promise<ActionResult<{ filename: string; imageUrl?: string }>> {
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
    const filename = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}.jpg`;
    const storagePath = `vehicles/${vehicleId}/${filename}`;

    const bucket = adminStorage.bucket(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    );

    const binaryString = atob(base64ImageData);
    const bytes = new Uint8Array(binaryString.length);
    for (let j = 0; j < binaryString.length; j++) {
      bytes[j] = binaryString.charCodeAt(j);
    }

    const file = bucket.file(storagePath);
    await file.save(bytes, { contentType: "image/jpeg" });

    const updatedImages = [...existingImages, storagePath];
    const primaryImage = docData?.media?.primaryImage || storagePath;

    await docRef.update({
      media: {
        images: updatedImages,
        primaryImage,
      },
      "metadata.updatedAt": new Date().toISOString(),
    });

    return {
      success: true,
      data: { filename: storagePath },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to upload image: ${message}`,
    };
  }
}

/**
 * Reorder vehicle images
 */
export async function reorderVehicleImages(
  vehicleId: string,
  newImageOrder: string[]
): Promise<ActionResult<{ images: string[] }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can update vehicles",
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
    let primaryImage = docData?.media?.primaryImage;

    if (primaryImage && !newImageOrder.includes(primaryImage)) {
      primaryImage = newImageOrder[0] || "";
    }

    await docRef.update({
      media: {
        images: newImageOrder,
        primaryImage,
      },
      "metadata.updatedAt": new Date().toISOString(),
    });

    return {
      success: true,
      data: { images: newImageOrder },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to reorder images: ${message}`,
    };
  }
}

/**
 * Set primary vehicle image
 */
export async function setPrimaryVehicleImage(
  vehicleId: string,
  imageFilename: string
): Promise<ActionResult<{ primaryImage: string }>> {
  try {
    const hasAdminAccess = await isAdmin();
    if (!hasAdminAccess) {
      return {
        success: false,
        error: "Only admin users can update vehicles",
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
    const images = docData?.media?.images || [];

    if (!images.includes(imageFilename)) {
      return {
        success: false,
        error: "Image not found in vehicle",
      };
    }

    await docRef.update({
      "media.primaryImage": imageFilename,
      "metadata.updatedAt": new Date().toISOString(),
    });

    return {
      success: true,
      data: { primaryImage: imageFilename },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to set primary image: ${message}`,
    };
  }
}

export async function deleteAllVehicleImages(
  vehicleId: string
): Promise<ActionResult<{ deletedCount: number }>> {
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
    const imagePaths = docData?.media?.images || [];

    if (imagePaths.length === 0) {
      return {
        success: true,
        data: { deletedCount: 0 },
      };
    }

    const bucket = adminStorage.bucket(
      process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
    );

    for (const storagePath of imagePaths) {
      const file = bucket.file(storagePath);
      await file.delete().catch(() => {});
    }

    await docRef.update({
      media: {
        images: [],
        primaryImage: "",
      },
      "metadata.updatedAt": new Date().toISOString(),
    });

    return {
      success: true,
      data: { deletedCount: imagePaths.length },
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to delete all images: ${message}`,
    };
  }
}
