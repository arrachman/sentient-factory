'use client';

/**
 * Frame capture and face analysis utilities.
 * These are pure functions that take refs/state as explicit parameters
 * rather than accessing them via closure, making them easy to test and reuse.
 */

import type { FaceBoundingBox, FaceCaptureAnalysis } from './_types-hr';
import { getActiveFaceCropBox, getLiveFaceFraming } from './_utils-hr';

// ---------------------------------------------------------------------------
// captureSnapshot
// ---------------------------------------------------------------------------

/**
 * Captures a JPEG data URL from the current video frame, cropped to the
 * active face region.
 */
export function captureSnapshot(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  detectedFaceBox: FaceBoundingBox | null,
): string {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
    throw new Error('Camera preview is not ready yet.');
  }

  const activeCrop = getActiveFaceCropBox(video, detectedFaceBox);
  canvas.width = activeCrop.width;
  canvas.height = activeCrop.height;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Canvas 2D context is not available.');
  }

  ctx.drawImage(
    video,
    activeCrop.x,
    activeCrop.y,
    activeCrop.width,
    activeCrop.height,
    0,
    0,
    activeCrop.width,
    activeCrop.height,
  );

  return canvas.toDataURL('image/jpeg', 0.85);
}

// ---------------------------------------------------------------------------
// analyzeCurrentFaceFrame
// ---------------------------------------------------------------------------

/**
 * Extracts a normalized 32x32 grayscale embedding plus framing metrics
 * from the current video frame.
 */
export function analyzeCurrentFaceFrame(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  detectedFaceBox: FaceBoundingBox | null,
): FaceCaptureAnalysis {
  const video = videoRef.current;
  const canvas = canvasRef.current;

  if (!video || !canvas || video.videoWidth === 0 || video.videoHeight === 0) {
    throw new Error('Camera preview is not ready yet.');
  }

  const framing = getLiveFaceFraming(video, detectedFaceBox);
  const activeCrop = getActiveFaceCropBox(video, detectedFaceBox);

  const tempCanvas = document.createElement('canvas');
  const EMBED_SIZE = 32;
  tempCanvas.width = EMBED_SIZE;
  tempCanvas.height = EMBED_SIZE;
  const tempCtx = tempCanvas.getContext('2d');
  if (!tempCtx) {
    throw new Error('Canvas 2D context is not available.');
  }

  tempCtx.drawImage(
    video,
    activeCrop.x,
    activeCrop.y,
    activeCrop.width,
    activeCrop.height,
    0,
    0,
    tempCanvas.width,
    tempCanvas.height,
  );

  const pixels = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height).data;
  const embedding: number[] = [];
  let sum = 0;

  for (let index = 0; index < pixels.length; index += 4) {
    const grayscale =
      (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114) / 255;
    embedding.push(grayscale);
    sum += grayscale;
  }

  const mean = sum / embedding.length;
  let norm = 0;
  const centered = embedding.map((value) => {
    const next = value - mean;
    norm += next * next;
    return next;
  });

  const safeNorm = Math.sqrt(norm) || 1;
  return {
    embedding: centered.map((value) => Number((value / safeNorm).toFixed(6))),
    brightness: mean,
    faceCoverage: framing.faceCoverage,
    guideCoverage: framing.guideCoverage,
    centerOffsetX: framing.centerOffsetX,
    centerOffsetY: framing.centerOffsetY,
    wellFramed: framing.wellFramed,
  };
}
