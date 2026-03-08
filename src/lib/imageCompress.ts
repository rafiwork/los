const MAX_SIZE_BYTES = 50 * 1024; // 50KB

/**
 * Compress an image file to be under 50KB.
 * Uses canvas to resize and reduce quality iteratively.
 */
export async function compressImage(file: File): Promise<Blob> {
  // If already under limit, return as-is
  if (file.size <= MAX_SIZE_BYTES) {
    return file;
  }

  const img = await createImageFromFile(file);
  
  // Start with original dimensions and reduce
  let quality = 0.8;
  let scale = 1;
  let blob: Blob | null = null;

  // First try reducing quality at original size
  for (quality = 0.8; quality >= 0.1; quality -= 0.1) {
    blob = await canvasToBlob(img, img.width * scale, img.height * scale, quality);
    if (blob.size <= MAX_SIZE_BYTES) return blob;
  }

  // Then reduce dimensions progressively
  for (scale = 0.8; scale >= 0.1; scale -= 0.1) {
    for (quality = 0.7; quality >= 0.1; quality -= 0.15) {
      blob = await canvasToBlob(img, img.width * scale, img.height * scale, quality);
      if (blob.size <= MAX_SIZE_BYTES) return blob;
    }
  }

  // Last resort: tiny thumbnail
  blob = await canvasToBlob(img, 100, 100, 0.1);
  return blob!;
}

function createImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

function canvasToBlob(img: HTMLImageElement, width: number, height: number, quality: number): Promise<Blob> {
  return new Promise((resolve) => {
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(width);
    canvas.height = Math.round(height);
    const ctx = canvas.getContext("2d")!;
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
      (blob) => resolve(blob!),
      "image/jpeg",
      quality
    );
  });
}
