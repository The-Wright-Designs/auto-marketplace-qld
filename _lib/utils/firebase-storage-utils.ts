/**
 * Utility functions for Firebase Storage operations
 */

/**
 * Generates a Firebase Storage download URL for a vehicle image
 * @param vehicleId The ID of the vehicle
 * @param filename The filename of the image
 * @returns The full URL to the image in Firebase Storage
 */
export function getVehicleImageUrl(
  vehicleId: string,
  filename: string
): string {
  // Firebase Storage URLs follow this pattern for public access
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;
  if (!bucketName) {
    throw new Error("Firebase Storage bucket name is not configured");
  }
  return `https://firebasestorage.googleapis.com/v0/b/${bucketName}/o/vehicles%2F${vehicleId}%2F${filename}?alt=media`;
}

/**
 * Generates Firebase Storage download URLs for multiple vehicle images
 * @param vehicleId The ID of the vehicle
 * @param filenames Array of image filenames
 * @returns Array of full URLs to the images in Firebase Storage
 */
export function getVehicleImageUrls(
  vehicleId: string,
  filenames: string[]
): string[] {
  return filenames.map((filename) => getVehicleImageUrl(vehicleId, filename));
}
