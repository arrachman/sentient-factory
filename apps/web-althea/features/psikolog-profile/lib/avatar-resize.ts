/**
 * Client-side avatar image processing.
 *
 * Steps:
 *   1. Read File → HTMLImageElement
 *   2. Resize ke max 256×256 (square crop, center) → canvas
 *   3. Export sebagai JPEG quality 0.85 → base64 data URL
 *   4. Validate ukuran final < 1MB sebelum kirim ke backend
 *
 * Output base64 di-cap ~340KB (256×256 JPEG q=0.85 sekitar 30-80KB),
 * jauh di bawah backend limit 1MB.
 */

const MAX_DIM = 256;
const JPEG_QUALITY = 0.85;
const MAX_BYTES = 1_000_000; // 1MB cap final base64 string

export type AvatarResizeResult = {
  dataUrl: string;
  bytes: number;
};

export async function resizeAvatarFile(file: File): Promise<AvatarResizeResult> {
  if (!file.type.startsWith('image/')) {
    throw new Error('File harus berupa gambar (jpg/png/webp).');
  }

  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Browser tidak mendukung canvas.');

  // Square crop center → resize to MAX_DIM
  const size = Math.min(img.width, img.height);
  const sx = (img.width - size) / 2;
  const sy = (img.height - size) / 2;

  canvas.width = MAX_DIM;
  canvas.height = MAX_DIM;
  ctx.drawImage(img, sx, sy, size, size, 0, 0, MAX_DIM, MAX_DIM);

  // Export sebagai JPEG (lebih kecil dari PNG untuk foto).
  const dataUrl = canvas.toDataURL('image/jpeg', JPEG_QUALITY);

  // Safety check
  const bytes = dataUrl.length;
  if (bytes > MAX_BYTES) {
    throw new Error(
      `Foto terlalu besar setelah resize (${Math.round(bytes / 1024)}KB). Pakai foto lain.`,
    );
  }

  return { dataUrl, bytes };
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Gagal load gambar.'));
      img.src = reader.result as string;
    };
    reader.onerror = () => reject(new Error('Gagal baca file.'));
    reader.readAsDataURL(file);
  });
}
