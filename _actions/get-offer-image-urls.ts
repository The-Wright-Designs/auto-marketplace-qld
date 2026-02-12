'use server';

import { adminStorage } from '@/_lib/firebase/storage-admin';
import { Offer } from '@/_types/offer-types';

interface ActionResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function getOfferImageUrls(
  offers: Offer[]
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

    for (const offer of offers) {
      let imagePath = offer.vehicle.featuredImagePath;

      if (!imagePath && offer.vehicle.featuredImageUrl) {
        const urlMatch = offer.vehicle.featuredImageUrl.match(/\/([^/?]+\.[a-z]{3,4})(\?|$)/i);
        if (urlMatch) {
          imagePath = urlMatch[1];
        }
      }

      if (!imagePath) {
        continue;
      }

      let fullPath: string;
      if (imagePath.startsWith('vehicles/')) {
        fullPath = imagePath;
      } else {
        fullPath = `vehicles/${offer.vehicleUid}/${imagePath}`;
      }

      const file = bucket.file(fullPath);

      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 60 * 60 * 1000,
      });

      imageUrls[offer.vehicleUid] = url;
    }

    return {
      success: true,
      data: imageUrls,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to get offer image URLs: ${message}`,
    };
  }
}
