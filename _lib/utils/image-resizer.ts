import sharp from "sharp";

export interface ResizedImage {
  buffer: Buffer;
  filename: string;
  contentType: string;
}

export async function resizeImage(
  file: File,
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  maxSizeKB: number = 200
): Promise<ResizedImage> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const metadata = await sharp(buffer).metadata();
  const { width = 0, height = 0 } = metadata;

  let resizeWidth = width;
  let resizeHeight = height;

  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;

    if (width > height) {
      resizeWidth = maxWidth;
      resizeHeight = Math.round(maxWidth / aspectRatio);
    } else {
      resizeHeight = maxHeight;
      resizeWidth = Math.round(maxHeight * aspectRatio);
    }
  }

  let quality = 90;
  let outputBuffer: Buffer;

  do {
    outputBuffer = await sharp(buffer)
      .resize(resizeWidth, resizeHeight, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality })
      .toBuffer();

    quality -= 5;
  } while (outputBuffer.length > maxSizeKB * 1024 && quality > 10);

  const fileExtension = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const baseName = file.name.replace(/\.[^/.]+$/, "");
  const filename = `${baseName}_resized.${fileExtension}`;

  return {
    buffer: outputBuffer,
    filename,
    contentType: "image/jpeg",
  };
}

export async function resizeMultipleImages(
  files: File[],
  maxWidth: number = 1920,
  maxHeight: number = 1920,
  maxSizeKB: number = 200
): Promise<ResizedImage[]> {
  const resizedImages: ResizedImage[] = [];

  for (const file of files) {
    if (file instanceof File && file.size > 0) {
      try {
        const resizedImage = await resizeImage(
          file,
          maxWidth,
          maxHeight,
          maxSizeKB
        );
        resizedImages.push(resizedImage);
      } catch (error) {
        console.error(`Error resizing image ${file.name}:`, error);
        throw new Error(`Failed to resize image: ${file.name}`);
      }
    }
  }

  return resizedImages;
}
