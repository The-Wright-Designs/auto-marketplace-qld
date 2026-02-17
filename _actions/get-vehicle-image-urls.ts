"use server";

import { adminStorage } from "@/_lib/firebase/storage-admin";
import { isAuthenticated } from "@/_lib/auth/get-current-user";

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getVehicleImageUrls(
  vehicleId: string,
  filenames: string[]
): Promise<ActionResult<string[]>> {
  try {
    const authenticated = await isAuthenticated();
    if (!authenticated) {
      return {
        success: false,
        error: "You must be logged in to access vehicle images",
      };
    }

    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      return {
        success: false,
        error:
          "Firebase Storage bucket name not configured. Check NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET environment variable.",
      };
    }

    const bucket = adminStorage.bucket(bucketName);
    const urls: string[] = [];

    for (const filename of filenames) {
      const file = bucket.file(`vehicles/${vehicleId}/${filename}`);

      const [url] = await file.getSignedUrl({
        action: "read",
        expires: Date.now() + 60 * 60 * 1000,
      });

      urls.push(url);
    }

    return {
      success: true,
      data: urls,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return {
      success: false,
      error: `Failed to generate image URLs: ${message}`,
    };
  }
}
