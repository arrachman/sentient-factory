'use client';

import { useEffect, useRef, useState } from 'react';

export interface FaceMetrics {
  /** A face is currently in frame. */
  present: boolean;
  /** The face is roughly centered and large enough for a good capture. */
  centered: boolean;
  /** Heuristic 0..1 quality score (size + centering); sent with the clock punch. */
  score: number;
  /** Number of faces detected (used to warn on multiple people). */
  count: number;
}

export interface UseFaceDetectorResult extends FaceMetrics {
  /** Native Shape-Detection FaceDetector is available and running. */
  supported: boolean;
  /** Latest metrics, readable synchronously at punch time without stale state. */
  metricsRef: React.RefObject<FaceMetrics>;
}

const EMPTY: FaceMetrics = { present: false, centered: false, score: 0, count: 0 };
const DETECT_INTERVAL_MS = 350;

type DetectedFace = { boundingBox: { x: number; y: number; width: number; height: number } };
type FaceDetectorLike = { detect: (src: CanvasImageSource) => Promise<DetectedFace[]> };

function createDetector(): FaceDetectorLike | null {
  const Ctor = (globalThis as { FaceDetector?: new (o?: unknown) => FaceDetectorLike }).FaceDetector;
  if (typeof Ctor !== 'function') return null;
  try {
    return new Ctor({ fastMode: true, maxDetectedFaces: 3 });
  } catch {
    return null;
  }
}

function scoreFace(face: DetectedFace, vw: number, vh: number): { score: number; centered: boolean } {
  const { x, y, width, height } = face.boundingBox;
  if (!vw || !vh) return { score: 0.5, centered: true };
  const cx = (x + width / 2) / vw;
  const cy = (y + height / 2) / vh;
  // Distance of face centre from frame centre (0 = dead centre).
  const offset = Math.hypot(cx - 0.5, cy - 0.5);
  const sizeRatio = width / vw; // fraction of frame width the face occupies
  const sizeOk = sizeRatio > 0.22 && sizeRatio < 0.85;
  const centerOk = offset < 0.22;
  const sizeScore = Math.max(0, Math.min(1, (sizeRatio - 0.15) / 0.4));
  const centerScore = Math.max(0, 1 - offset / 0.35);
  return { score: Math.round((sizeScore * 0.45 + centerScore * 0.55) * 100) / 100, centered: sizeOk && centerOk };
}

/**
 * Best-effort on-device face presence/quality detection. Uses the native
 * Shape-Detection `FaceDetector` when the browser exposes it; otherwise reports
 * `supported: false` and the stage falls back to manual framing guidance. The
 * detector never blocks the punch — it raises accuracy and live feedback when
 * available, and the backend remains the source of truth for identity.
 */
export function useFaceDetector(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  active: boolean,
): UseFaceDetectorResult {
  const [supported, setSupported] = useState(false);
  const [metrics, setMetrics] = useState<FaceMetrics>(EMPTY);
  const metricsRef = useRef<FaceMetrics>(EMPTY);

  useEffect(() => {
    // Initial state is already EMPTY, so an inactive run needs no reset here;
    // metrics are cleared in the active run's cleanup when the camera stops.
    if (!active) return;
    const detector = createDetector();
    // Capability detection is inherently client-only (FaceDetector is absent on
    // the server), so it must run in an effect to stay hydration-safe — the
    // set-state-in-effect advisory is a known false positive for this pattern.
    if (!detector) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSupported(false);
      return;
    }
    setSupported(true);

    let cancelled = false;
    let inFlight = false;

    const tick = async () => {
      const video = videoRef.current;
      if (cancelled || inFlight || !video || video.readyState < 2) return;
      inFlight = true;
      try {
        const faces = await detector.detect(video);
        if (cancelled) return;
        if (!faces.length) {
          const next = EMPTY;
          metricsRef.current = next;
          setMetrics(next);
        } else {
          const best = faces.reduce((a, b) =>
            b.boundingBox.width > a.boundingBox.width ? b : a,
          );
          const { score, centered } = scoreFace(best, video.videoWidth, video.videoHeight);
          const next: FaceMetrics = { present: true, centered, score, count: faces.length };
          metricsRef.current = next;
          setMetrics(next);
        }
      } catch {
        /* transient detect error — keep last metrics, try again next tick */
      } finally {
        inFlight = false;
      }
    };

    const id = window.setInterval(tick, DETECT_INTERVAL_MS);
    void tick();
    return () => {
      cancelled = true;
      window.clearInterval(id);
      metricsRef.current = EMPTY;
      setMetrics(EMPTY);
    };
  }, [active, videoRef]);

  return { supported, metricsRef, ...metrics };
}
