'use server';

import { adminStorage } from '@/_lib/firebase/storage-admin';
import { Bid } from '@/_types/bid-types';

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getBidImageUrls(
  bids: Bid[]
): Promise<ActionResult<Record<string, string>>> {
  try {
    const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
    if (!bucketName) {
      return {
        success: false,
        error: 'Firebase Storage bucket name not configured',
      };
    }

    const bucket = adminStorage.bucket(bucketName);
    const imageUrls: Record<string, string> = {};

    for (const bid of bids) {
      let imagePath = bid.vehicle.featuredImagePath;

      if (!imagePath && bid.vehicle.featuredImageUrl) {
        const urlMatch = bid.vehicle.featuredImageUrl.match(/\/([^/?]+\.[a-z]{3,4})(\?|$)/i);
        if (urlMatch) {
          imagePath = urlMatch[1];
        }
      }

      if (!imagePath) {
        continue;
      }

      const file = bucket.file(`vehicles/${bid.vehicleUid}/${imagePath}`);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });

      imageUrls[bid.vehicleUid] = url;
    }

    return {
      success: true,
      data: imageUrls,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to get bid image URLs: ${message}`,
    };
  }
}
