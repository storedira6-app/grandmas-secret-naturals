/**
 * Client-side photo preparation for the Skin Microscope AI:
 * downscale, auto brightness/contrast normalization, and a quality check
 * (blur, under/over exposure, resolution) so ambient conditions don't skew
 * the analysis.
 */

export type PreparedPhoto = {
  /** base64 payload (no data: prefix) of the enhanced JPEG */
  base64: string;
  mimeType: "image/jpeg";
  /** data URL preview of the enhanced image */
  preview: string;
  brightness: number;
  sharpness: number;
  /** i18n keys of the detected problems */
  warnings: ("qBlur" | "qDark" | "qBright" | "qSmall")[];
  /** short english hint sent to the model */
  hint: string;
};

const MAX_SIDE = 1024;

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("image load failed"));
    };
    img.src = url;
  });
}

export async function preparePhoto(file: File): Promise<PreparedPhoto> {
  const img = await loadImage(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("canvas unavailable");
  ctx.drawImage(img, 0, 0, w, h);

  const image = ctx.getImageData(0, 0, w, h);
  const data = image.data;

  // grayscale + mean luminance
  const gray = new Float32Array(w * h);
  let sum = 0;
  for (let i = 0, p = 0; i < data.length; i += 4, p += 1) {
    const g = 0.299 * data[i]! + 0.587 * data[i + 1]! + 0.114 * data[i + 2]!;
    gray[p] = g;
    sum += g;
  }
  const mean = sum / gray.length;

  // Laplacian variance = sharpness proxy
  let lapSum = 0;
  let lapSqSum = 0;
  let count = 0;
  for (let y = 1; y < h - 1; y += 1) {
    for (let x = 1; x < w - 1; x += 1) {
      const i = y * w + x;
      const v =
        4 * gray[i]! - gray[i - 1]! - gray[i + 1]! - gray[i - w]! - gray[i + w]!;
      lapSum += v;
      lapSqSum += v * v;
      count += 1;
    }
  }
  const lapMean = count ? lapSum / count : 0;
  const sharpness = count ? lapSqSum / count - lapMean * lapMean : 0;

  // auto exposure + gentle contrast toward a 128 mid-tone
  const gain = mean > 4 ? Math.max(0.75, Math.min(1.6, 128 / mean)) : 1;
  const contrast = 1.08;
  for (let i = 0; i < data.length; i += 4) {
    for (let c = 0; c < 3; c += 1) {
      const v = (data[i + c]! * gain - 128) * contrast + 128;
      data[i + c] = v < 0 ? 0 : v > 255 ? 255 : v;
    }
  }
  ctx.putImageData(image, 0, 0);

  const preview = canvas.toDataURL("image/jpeg", 0.9);

  const warnings: PreparedPhoto["warnings"] = [];
  if (sharpness < 45) warnings.push("qBlur");
  if (mean < 55) warnings.push("qDark");
  if (mean > 205) warnings.push("qBright");
  if (Math.min(img.naturalWidth, img.naturalHeight) < 320) warnings.push("qSmall");

  const hint = [
    `average brightness ${Math.round(mean)}/255`,
    `sharpness score ${Math.round(sharpness)}`,
    warnings.length ? `possible issues: ${warnings.join(", ")}` : "conditions look good",
    "the app already auto-corrected exposure and contrast",
  ].join("; ");

  return {
    base64: preview.split(",")[1] ?? "",
    mimeType: "image/jpeg",
    preview,
    brightness: Math.round(mean),
    sharpness: Math.round(sharpness),
    warnings,
    hint,
  };
}
