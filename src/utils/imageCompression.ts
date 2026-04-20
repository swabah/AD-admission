/**
 * Image Compression Utilities
 * Handles client-side image compression for file uploads
 */

export const compressImage = (
  file: File,
  callback: (
    compressedDataURL: string,
    originalSize: number,
    compressedSize: number,
  ) => void,
): void => {
  const originalSizeInMB = file.size / (1024 * 1024);

  const reader = new FileReader();

  reader.onload = (event) => {
    const img = new Image();
    img.src = event.target?.result as string;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      // Scale down image if needed
      const maxWidth = 1200;
      const maxHeight = 1600;
      if (width > maxWidth) {
        height = Math.round((height * maxWidth) / width);
        width = maxWidth;
      }
      if (height > maxHeight) {
        width = Math.round((width * maxHeight) / height);
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
      }

      // Compress to JPEG with quality adjustment
      let quality = 0.9;
      let compressedDataURL = canvas.toDataURL("image/jpeg", quality);

      // Keep reducing quality until under 2MB
      while (compressedDataURL.length > 2 * 1024 * 1024 && quality > 0.1) {
        quality -= 0.1;
        compressedDataURL = canvas.toDataURL("image/jpeg", quality);
      }

      const compressedSizeInMB = compressedDataURL.length / (1024 * 1024);
      callback(compressedDataURL, originalSizeInMB, compressedSizeInMB);
    };
  };

  reader.readAsDataURL(file);
};

export const handlePhotoUpload = (
  file: File,
  onSuccess: (dataURL: string) => void,
  onCompressionMessage?: (message: string) => void,
): void => {
  const fileSizeInMB = file.size / (1024 * 1024);

  if (fileSizeInMB > 2) {
    // Compress if larger than 2MB
    compressImage(file, (compressedDataURL, originalSize, compressedSize) => {
      onSuccess(compressedDataURL);
      if (onCompressionMessage) {
        onCompressionMessage(
          `Image compressed from ${originalSize.toFixed(2)}MB to ${compressedSize.toFixed(2)}MB`,
        );
      }
    });
  } else {
    // Use original if small enough
    const reader = new FileReader();
    reader.onload = (ev) => onSuccess(ev.target?.result as string);
    reader.readAsDataURL(file);
  }
};
