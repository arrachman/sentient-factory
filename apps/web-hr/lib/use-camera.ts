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
 *
 * Stream attachment is decoupled from `start()`: a dedicated effect binds the
 * active stream to the `<video>` whenever a new stream is acquired. This survives
 * the Radix Dialog portal timing (the `<video>` may mount in a portal after the
 * async getUserMedia resolves) and avoids the AbortError "play() interrupted by a
 * new load" that occurs when calling play() immediately after setting srcObject.
 */
export function useCamera(): UseCameraResult {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  /** Bumped each time a fresh stream is acquired, to retrigger the attach effect. */
  const [streamSeq, setStreamSeq] = useState(0);

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;
    setReady(false);
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setReady(false);
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
      // getUserMedia hanya tersedia di secure context (HTTPS atau localhost).
      // Akses via http://<IP-LAN> membuat navigator.mediaDevices undefined
      // meski browser sebenarnya mendukung kamera — beri diagnosa yang benar.
      const insecure =
        typeof window !== 'undefined' && !window.isSecureContext && location.hostname !== 'localhost';
      setError(
        insecure
          ? 'Kamera butuh koneksi aman (HTTPS). Buka lewat https:// atau http://localhost — akses via alamat IP HTTP tidak diizinkan browser.'
          : 'Kamera tidak didukung browser ini.',
      );
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      // Replace any prior stream (e.g. rapid reopen) so tracks don't leak.
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = stream;
      setStreamSeq((n) => n + 1);
      setReady(true);
    } catch {
      setError('Gagal mengakses kamera. Izinkan akses kamera lalu coba lagi.');
    }
  }, []);

  // Bind the active stream to the <video> element. Runs after every render where
  // a new stream was acquired or readiness changed — by then the (possibly
  // portal-mounted) <video> is in the DOM. Idempotent: skips if already bound.
  useEffect(() => {
    const video = videoRef.current;
    const stream = streamRef.current;
    if (!video || !stream) return;
    if (video.srcObject === stream) return;
    video.srcObject = stream;
    // autoPlay on the element handles playback; play() is a nudge for browsers
    // that don't honor autoPlay on programmatic srcObject changes.
    void video.play().catch(() => undefined);
  }, [streamSeq, ready]);

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
