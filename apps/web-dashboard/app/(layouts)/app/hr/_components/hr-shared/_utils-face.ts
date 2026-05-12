/**
 * MediaPipe / face-detection utilities.
 *
 * Terpisah dari _utils-hr.ts agar file tidak melebihi 400 baris.
 * Utility attendance, normalisasi, dan helper lainnya tetap di _utils-hr.ts.
 */

import type {
  FaceBoundingBox,
  FaceAlignmentState,
  RuntimeFaceDetector,
  RuntimeFaceDetectionResult,
} from './_types-hr';

// ---------------------------------------------------------------------------
// MediaPipe constants
// ---------------------------------------------------------------------------

export const MEDIAPIPE_WASM_ROOT =
  'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.34/wasm';

export const MEDIAPIPE_FACE_LANDMARKER_MODEL =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task';

export const MEDIAPIPE_NOISY_ERROR_PATTERNS = [
  'Created TensorFlow Lite XNNPACK delegate for CPU.',
  'INFO: Created TensorFlow Lite XNNPACK delegate for CPU.',
];

// ---------------------------------------------------------------------------
// MediaPipe noise suppression
// ---------------------------------------------------------------------------

export function shouldSuppressMediapipeConsoleError(args: unknown[]) {
  return args.some((arg) => {
    if (typeof arg !== 'string') return false;
    return MEDIAPIPE_NOISY_ERROR_PATTERNS.some((pattern) => arg.includes(pattern));
  });
}

export async function withSuppressedMediapipeConsoleNoise<T>(fn: () => Promise<T> | T) {
  const originalConsoleError = console.error;
  console.error = (...args: Parameters<typeof console.error>) => {
    if (shouldSuppressMediapipeConsoleError(args)) return;
    originalConsoleError(...args);
  };
  try {
    return await fn();
  } finally {
    console.error = originalConsoleError;
  }
}

// ---------------------------------------------------------------------------
// Face detector factory (singleton promise)
// ---------------------------------------------------------------------------

let faceDetectorPromise: Promise<{
  detector: RuntimeFaceDetector | null;
  mode: 'mediapipe' | 'fallback';
}> | null = null;

export function resetFaceDetectorPromise() {
  faceDetectorPromise = null;
}

export async function getFaceDetector() {
  if (!faceDetectorPromise) {
    faceDetectorPromise = (async () => {
      try {
        const vision = await import('@mediapipe/tasks-vision');
        const wasmFileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_ROOT);
        const faceLandmarker = await withSuppressedMediapipeConsoleNoise(() =>
          vision.FaceLandmarker.createFromOptions(wasmFileset, {
            baseOptions: {
              modelAssetPath: MEDIAPIPE_FACE_LANDMARKER_MODEL,
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numFaces: 1,
            outputFaceBlendshapes: true,
          }),
        );
        let lastVideoTimestamp = -1;

        return {
          detector: {
            estimateFaces: async (input: HTMLVideoElement) => {
              if (
                !input ||
                input.readyState < HTMLMediaElement.HAVE_CURRENT_DATA ||
                input.videoWidth <= 0 ||
                input.videoHeight <= 0 ||
                !Number.isFinite(input.currentTime) ||
                input.currentTime <= 0
              ) {
                return [];
              }

              const videoTimestamp = Math.round(input.currentTime * 1000);
              if (
                !Number.isFinite(videoTimestamp) ||
                videoTimestamp <= 0 ||
                videoTimestamp <= lastVideoTimestamp
              ) {
                return [];
              }

              let result: {
                faceLandmarks?: unknown[];
                faceBlendshapes?: Array<{
                  categories?: Array<{ categoryName?: string; score?: number }>;
                }>;
              } | null = null;
              try {
                result = await withSuppressedMediapipeConsoleNoise(() =>
                  faceLandmarker.detectForVideo(input, videoTimestamp),
                );
                lastVideoTimestamp = videoTimestamp;
              } catch {
                return [];
              }

              const landmarksList = result.faceLandmarks ?? [];
              const blendShapesList = result.faceBlendshapes ?? [];

              return landmarksList
                .map((landmarks, index) => {
                  if (!Array.isArray(landmarks) || landmarks.length === 0) return null;

                  let minX = Number.POSITIVE_INFINITY;
                  let minY = Number.POSITIVE_INFINITY;
                  let maxX = Number.NEGATIVE_INFINITY;
                  let maxY = Number.NEGATIVE_INFINITY;

                  for (const landmark of landmarks) {
                    const x = Number(landmark.x ?? 0) * input.videoWidth;
                    const y = Number(landmark.y ?? 0) * input.videoHeight;
                    if (!Number.isFinite(x) || !Number.isFinite(y)) continue;
                    minX = Math.min(minX, x);
                    minY = Math.min(minY, y);
                    maxX = Math.max(maxX, x);
                    maxY = Math.max(maxY, y);
                  }

                  if (
                    !Number.isFinite(minX) ||
                    !Number.isFinite(minY) ||
                    !Number.isFinite(maxX) ||
                    !Number.isFinite(maxY)
                  ) {
                    return null;
                  }

                  const categories = blendShapesList[index]?.categories ?? [];
                  const leftBlink = Number(
                    categories.find((item) => item.categoryName === 'eyeBlinkLeft')?.score ?? 0,
                  );
                  const rightBlink = Number(
                    categories.find((item) => item.categoryName === 'eyeBlinkRight')?.score ?? 0,
                  );

                  return {
                    boundingBox: {
                      x: minX,
                      y: minY,
                      width: Math.max(1, maxX - minX),
                      height: Math.max(1, maxY - minY),
                    },
                    liveness: {
                      leftBlink,
                      rightBlink,
                      avgBlink: (leftBlink + rightBlink) / 2,
                    },
                  } satisfies RuntimeFaceDetectionResult;
                })
                .filter((face): face is RuntimeFaceDetectionResult => !!face);
            },
          } satisfies RuntimeFaceDetector,
          mode: 'mediapipe' as const,
        };
      } catch {
        return { detector: null, mode: 'fallback' as const };
      }
    })();
  }

  return faceDetectorPromise;
}

// ---------------------------------------------------------------------------
// Face bounding box helpers
// ---------------------------------------------------------------------------

export function normalizeFaceBoundingBox(face: unknown): FaceBoundingBox | null {
  if (!face || typeof face !== 'object') return null;

  const rawBox = (face as { boundingBox?: Partial<FaceBoundingBox> }).boundingBox;
  if (!rawBox) return null;

  const x = Number(rawBox.x ?? 0);
  const y = Number(rawBox.y ?? 0);
  const width = Number(rawBox.width ?? 0);
  const height = Number(rawBox.height ?? 0);

  if (!Number.isFinite(x) || !Number.isFinite(y) || width <= 0 || height <= 0) return null;

  const centerX = x + width / 2;
  const centerY = y + height / 2;
  const expandedWidth = width * 1.42;
  const expandedHeight = height * 1.68;
  const shiftedCenterY = centerY - height * 0.08;

  return {
    x: centerX - expandedWidth / 2,
    y: shiftedCenterY - expandedHeight / 2,
    width: expandedWidth,
    height: expandedHeight,
  };
}

export function clampFaceBox(
  box: FaceBoundingBox,
  frameWidth: number,
  frameHeight: number,
) {
  const paddingX = box.width * 0.1;
  const paddingY = box.height * 0.14;
  const x = Math.max(0, box.x - paddingX);
  const y = Math.max(0, box.y - paddingY);
  const right = Math.min(frameWidth, box.x + box.width + paddingX);
  const bottom = Math.min(frameHeight, box.y + box.height + paddingY);
  return {
    x,
    y,
    width: Math.max(1, right - x),
    height: Math.max(1, bottom - y),
  };
}

export function getDefaultFaceGuideBox(
  frameWidth: number,
  frameHeight: number,
): FaceBoundingBox {
  const width = frameWidth * 0.18;
  const height = frameHeight * 0.3;
  return {
    x: (frameWidth - width) / 2,
    y: frameHeight * 0.2,
    width,
    height,
  };
}

export function getActiveFaceCropBox(
  video: HTMLVideoElement,
  detectedBox: FaceBoundingBox | null,
): FaceBoundingBox {
  if (detectedBox) return clampFaceBox(detectedBox, video.videoWidth, video.videoHeight);
  return getDefaultFaceGuideBox(video.videoWidth, video.videoHeight);
}

// ---------------------------------------------------------------------------
// Live face framing analysis
// ---------------------------------------------------------------------------

export function getLiveFaceFraming(
  video: HTMLVideoElement | null,
  detectedBox: FaceBoundingBox | null,
) {
  if (!video || !detectedBox || video.videoWidth === 0 || video.videoHeight === 0) {
    return {
      faceCoverage: 0,
      guideCoverage: 0,
      centerOffsetX: 1,
      centerOffsetY: 1,
      alignmentState: 'idle' as FaceAlignmentState,
      locked: false,
      wellFramed: false,
    };
  }

  const clampedDetectedBox = clampFaceBox(detectedBox, video.videoWidth, video.videoHeight);
  const detectedArea = clampedDetectedBox.width * clampedDetectedBox.height;
  const frameArea = video.videoWidth * video.videoHeight;
  const faceCoverage = detectedArea / frameArea;
  const frameCenterX = video.videoWidth / 2;
  const frameCenterY = video.videoHeight / 2;
  const faceCenterX = clampedDetectedBox.x + clampedDetectedBox.width / 2;
  const faceCenterY = clampedDetectedBox.y + clampedDetectedBox.height / 2;
  const centerOffsetX = Math.abs(faceCenterX - frameCenterX) / video.videoWidth;
  const centerOffsetY = Math.abs(faceCenterY - frameCenterY) / video.videoHeight;
  const framePaddingX = video.videoWidth * 0.02;
  const framePaddingY = video.videoHeight * 0.02;
  const insideFrameBounds =
    clampedDetectedBox.x >= framePaddingX &&
    clampedDetectedBox.y >= framePaddingY &&
    clampedDetectedBox.x + clampedDetectedBox.width <= video.videoWidth - framePaddingX &&
    clampedDetectedBox.y + clampedDetectedBox.height <= video.videoHeight - framePaddingY;

  const nearAligned =
    faceCoverage >= 0.07 &&
    faceCoverage <= 0.33 &&
    insideFrameBounds &&
    centerOffsetX <= 0.12 &&
    centerOffsetY <= 0.14;

  const locked =
    faceCoverage >= 0.11 &&
    faceCoverage <= 0.26 &&
    insideFrameBounds &&
    centerOffsetX <= 0.08 &&
    centerOffsetY <= 0.1;

  const alignmentState: FaceAlignmentState = locked ? 'locked' : nearAligned ? 'near' : 'off';

  const wellFramed =
    faceCoverage >= 0.06 &&
    faceCoverage <= 0.38 &&
    insideFrameBounds &&
    centerOffsetX <= 0.16 &&
    centerOffsetY <= 0.18;

  return {
    faceCoverage,
    guideCoverage: insideFrameBounds ? 1 : 0,
    centerOffsetX,
    centerOffsetY,
    alignmentState,
    locked,
    wellFramed,
  };
}

export function getLowConfidenceGuidance(options: {
  similarity: number;
  brightness: number;
  faceCoverage: number;
}) {
  if (options.faceCoverage < 0.16) return 'Dekatkan wajah ke kamera.';
  if (options.brightness < 0.32) return 'Cari tempat yang lebih terang.';
  if (options.similarity < 0.55) return 'Hadapkan wajah lurus ke kamera lalu tahan beberapa detik.';
  return 'Tahan wajah tetap dan pastikan seluruh wajah terlihat jelas.';
}
