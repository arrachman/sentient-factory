'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createMediapipeEngine,
  createNativeEngine,
  type DetectedFace,
  type FaceEngine,
  type FaceEngineKind,
} from './face-engines';

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
  /** A face-detection engine is available and running. */
  supported: boolean;
  /** Which engine is driving detection, or `null` when none is available. */
  engine: FaceEngineKind | null;
  /** Latest metrics, readable synchronously at punch time without stale state. */
  metricsRef: React.RefObject<FaceMetrics>;
}

const EMPTY: FaceMetrics = { present: false, centered: false, score: 0, count: 0 };
const DETECT_INTERVAL_MS = 350;

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
 * Best-effort on-device face presence/quality detection. Prefers the native
 * Shape-Detection `FaceDetector` when the browser exposes it, then falls back to
 * the bundled MediaPipe BlazeFace WASM engine so live framing works in browsers
 * that lack the native API. Only when neither is available does the stage drop
 * to manual framing guidance (`supported: false`). The detector never blocks the
 * punch — it raises accuracy and live feedback, and the backend remains the
 * source of truth for identity.
 */
export function useFaceDetector(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  active: boolean,
): UseFaceDetectorResult {
  const [supported, setSupported] = useState(false);
  const [engineKind, setEngineKind] = useState<FaceEngineKind | null>(null);
  const [metrics, setMetrics] = useState<FaceMetrics>(EMPTY);
  const metricsRef = useRef<FaceMetrics>(EMPTY);

  useEffect(() => {
    // Initial state is already EMPTY, so an inactive run needs no reset here;
    // metrics are cleared in the active run's cleanup when the camera stops.
    if (!active) return;

    let cancelled = false;
    let inFlight = false;
    let engine: FaceEngine | null = null;
    let intervalId: number | undefined;

    const apply = (next: FaceMetrics) => {
      metricsRef.current = next;
      setMetrics(next);
    };

    const tick = async () => {
      const video = videoRef.current;
      if (cancelled || inFlight || !engine || !video || video.readyState < 2) return;
      inFlight = true;
      try {
        const faces = await engine.detect(video);
        if (cancelled) return;
        if (!faces.length) {
          apply(EMPTY);
        } else {
          const best = faces.reduce((a, b) => (b.boundingBox.width > a.boundingBox.width ? b : a));
          const { score, centered } = scoreFace(best, video.videoWidth, video.videoHeight);
          apply({ present: true, centered, score, count: faces.length });
        }
      } catch {
        /* transient detect error — keep last metrics, try again next tick */
      } finally {
        inFlight = false;
      }
    };

    const run = (activeEngine: FaceEngine) => {
      engine = activeEngine;
      setSupported(true);
      setEngineKind(activeEngine.kind);
      intervalId = window.setInterval(tick, DETECT_INTERVAL_MS);
      void tick();
    };

    const native = createNativeEngine();
    if (native) {
      run(native);
    } else {
      // No native API → asynchronously load the MediaPipe WASM engine. Stays on
      // manual framing until (and unless) it initialises successfully.
      void createMediapipeEngine().then((mp) => {
        if (cancelled) {
          mp?.close();
          return;
        }
        if (mp) run(mp);
      });
    }

    return () => {
      cancelled = true;
      if (intervalId) window.clearInterval(intervalId);
      engine?.close();
      metricsRef.current = EMPTY;
      setMetrics(EMPTY);
      setSupported(false);
      setEngineKind(null);
    };
  }, [active, videoRef]);

  return { supported, engine: engineKind, metricsRef, ...metrics };
}
