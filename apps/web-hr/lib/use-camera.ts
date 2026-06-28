'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseCameraResult {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  ready: boolean;
  error: string | null;
  start: () => Promise<void>;
  stop: () => void;
  /** Capture the current frame as a JPEG data URL (or null if not ready). */
  capture: () => string | null;
}

/**
 * Minimal webcam hook for attendance capture (selfie verification, jibble-style).
 * Uses getUserMedia; capture draws the current video frame to a canvas → data URL.
 * Heavy on-device face/liveness ML (MediaPipe/TF) can be layered on later; the
 * backend accepts an optional snapshot + scores, so this functional flow works now.
 */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setReady(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      setError('Kamera tidak didukung browser ini.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => undefined);
      }
      setReady(true);
    } catch {
      setError('Gagal mengakses kamera. Izinkan akses kamera lalu coba lagi.');
    }
  }, []);

  const capture = useCallback((): string | null => {
    const video = videoRef.current;
    if (!video || !ready) return null;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.8);
  }, [ready]);

  useEffect(() => stop, [stop]);

  return { videoRef, ready, error, start, stop, capture };
}
