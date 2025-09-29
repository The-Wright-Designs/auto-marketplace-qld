export interface FileValidationResult {
  isValid: boolean;
  error?: string;
  sanitizedFile?: File;
}

export class FileValidator {
  private static readonly ALLOWED_MIME_TYPES = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
  ];

  private static readonly MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB
  private static readonly MAX_TOTAL_SIZE = 200 * 1024 * 1024; // 200MB (for multiple progressive uploads)

  // Magic number validation for file signatures
  private static readonly FILE_SIGNATURES = {
    "image/jpeg": [0xff, 0xd8, 0xff],
    "image/png": [0x89, 0x50, 0x4e, 0x47],
    "image/webp": [0x52, 0x49, 0x46, 0x46],
    "image/gif": [0x47, 0x49, 0x46],
  };

  static async validateFile(file: File): Promise<FileValidationResult> {
    // 1. Size validation
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        isValid: false,
        error: `File size exceeds ${this.MAX_FILE_SIZE / 1024 / 1024}MB limit`,
      };
    }

    // 2. MIME type validation
    if (!this.ALLOWED_MIME_TYPES.includes(file.type)) {
      return {
        isValid: false,
        error:
          "Invalid file type. Only JPEG, PNG, WebP, and GIF images allowed",
      };
    }

    // 3. File signature validation (magic numbers)
    const isValidSignature = await this.validateFileSignature(file);
    if (!isValidSignature) {
      return {
        isValid: false,
        error: "File content does not match file type",
      };
    }

    // 4. Filename sanitization
    const sanitizedFile = this.sanitizeFilename(file);

    return {
      isValid: true,
      sanitizedFile,
    };
  }

  private static async validateFileSignature(file: File): Promise<boolean> {
    try {
      const buffer = await file.arrayBuffer();
      const bytes = new Uint8Array(buffer);
      const signature =
        this.FILE_SIGNATURES[file.type as keyof typeof this.FILE_SIGNATURES];

      if (!signature) return false;

      return signature.every((byte, index) => bytes[index] === byte);
    } catch (error) {
      console.error("Error validating file signature:", error);
      return false;
    }
  }

  private static sanitizeFilename(file: File): File {
    // Remove dangerous characters and limit length
    const sanitizedName = file.name
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .substring(0, 100);

    return new File([file], sanitizedName, { type: file.type });
  }

  static validateMultipleFiles(files: File[]): {
    validFiles: File[];
    errors: string[];
    totalSize: number;
  } {
    const validFiles: File[] = [];
    const errors: string[] = [];
    let totalSize = 0;

    for (const file of files) {
      totalSize += file.size;
    }

    if (totalSize > this.MAX_TOTAL_SIZE) {
      errors.push(
        `Total file size exceeds ${this.MAX_TOTAL_SIZE / 1024 / 1024}MB limit`
      );
      return { validFiles: [], errors, totalSize };
    }

    return { validFiles: files, errors, totalSize };
  }

  // Additional security checks
  static isImageFile(file: File): boolean {
    return (
      file.type.startsWith("image/") &&
      this.ALLOWED_MIME_TYPES.includes(file.type)
    );
  }

  static getFileSizeString(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }
}
