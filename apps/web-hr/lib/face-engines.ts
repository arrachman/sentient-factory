// Pluggable on-device face-detection engines for the attendance clock stage.
//
// Two engines, tried in priority order by `useFaceDetector`:
//  1. `native`    — the browser Shape-Detection `FaceDetector`. Zero-cost when
//                   present, but it is non-standard and absent in virtually all
//                   current browsers (Chrome removed it from the default build).
//  2. `mediapipe` — Google MediaPipe Tasks Vision BlazeFace, a ~230 KB WASM model
//                   served same-origin from `public/mediapipe`. Works in every
//                   modern browser, which is why "framing manual" used to stick.
//
// Both normalise to the same `DetectedFace` shape so the scoring logic in
// `use-face-detector.ts` is engine-agnostic. The backend stays the source of
// truth for identity — these engines only drive live framing feedback.

export type DetectedFace = {
  boundingBox: { x: number; y: number; width: number; height: number };
};

export type FaceEngineKind = 'native' | 'mediapipe';

export interface FaceEngine {
  readonly kind: FaceEngineKind;
  /** Detect faces in the current video frame. May resolve empty when not ready. */
  detect(video: HTMLVideoElement): Promise<DetectedFace[]>;
  /** Release any underlying resources (WASM graph, etc.). */
  close(): void;
}

type NativeFaceDetector = { detect: (src: CanvasImageSource) => Promise<DetectedFace[]> };

/** Build the native Shape-Detection engine, or `null` when unavailable. */
export function createNativeEngine(): FaceEngine | null {
  const Ctor = (globalThis as { FaceDetector?: new (o?: unknown) => NativeFaceDetector }).FaceDetector;
  if (typeof Ctor !== 'function') return null;
  let detector: NativeFaceDetector;
  try {
    detector = new Ctor({ fastMode: true, maxDetectedFaces: 3 });
  } catch {
    return null;
  }
  return {
    kind: 'native',
    async detect(video) {
      if (video.readyState < 2) return [];
      return detector.detect(video);
    },
    close() {
      /* native detector holds no disposable resources */
    },
  };
}

const WASM_PATH = '/mediapipe/wasm';
const MODEL_PATH = '/mediapipe/models/blaze_face_short_range.tflite';

/**
 * Build the MediaPipe BlazeFace engine. Loads the WASM fileset and model
 * (both same-origin) and returns `null` if anything fails so the caller can
 * fall back to manual framing instead of crashing the clock stage.
 */
export async function createMediapipeEngine(): Promise<FaceEngine | null> {
  try {
    const { FilesetResolver, FaceDetector } = await import('@mediapipe/tasks-vision');
    const fileset = await FilesetResolver.forVisionTasks(WASM_PATH);
    const detector = await FaceDetector.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: MODEL_PATH },
      runningMode: 'VIDEO',
      minDetectionConfidence: 0.5,
    });
    return {
      kind: 'mediapipe',
      async detect(video) {
        if (video.readyState < 2) return [];
        const result = detector.detectForVideo(video, performance.now());
        const out: DetectedFace[] = [];
        for (const det of result.detections ?? []) {
          const b = det.boundingBox;
          if (!b) continue;
          out.push({ boundingBox: { x: b.originX, y: b.originY, width: b.width, height: b.height } });
        }
        return out;
      },
      close() {
        try {
          detector.close();
        } catch {
          /* best-effort cleanup */
        }
      },
    };
  } catch {
    return null;
  }
}
