'use client';

/**
 * Camera lifecycle sub-hook for the HR attendance face-detection flow.
 *
 * Handles: stream acquisition, face-detection loop, liveness tracking,
 * camera-restart on error, GPS acquisition trigger, and cleanup.
 *
 * All state setters are received as parameters so this hook has no direct
 * coupling to the parent hook's state declarations.
 */

import { useEffect } from 'react';
import type { AttendanceActionMode, FaceBoundingBox } from './_types-hr';
import {
  getFaceDetector,
  normalizeFaceBoundingBox,
  getLiveFaceFraming,
  normalizeDeviceError,
} from './_utils-hr';
import { reportClientFailure } from './_hr-action-utils';

export type CameraLifecycleSetters = {
  setCameraReady: (value: boolean) => void;
  setCameraError: (value: string | null) => void;
  setDetectorReady: (value: boolean) => void;
  setFaceDetected: (value: boolean) => void;
  setDetectionHits: (value: React.SetStateAction<number>) => void;
  setDetectedFaceBox: (value: FaceBoundingBox | null) => void;
  setLivenessVerified: (value: boolean) => void;
  setLivenessProgress: (value: number) => void;
  setLivenessPrompt: (value: string) => void;
  setEnrollmentHoldStep: (value: number) => void;
  setEnrollmentFreezeFrameUrl: (value: string | null) => void;
  setEnrollmentLockPulse: (value: boolean) => void;
  setDetectorUnavailable: (value: boolean) => void;
  setActionError: (value: string | null) => void;
  setActionMessage: (value: string | null) => void;
  setEnrollmentConflictMessage: (value: string | null) => void;
  setEnrollmentConflictAppUserId: (value: number | null) => void;
  setGeoLabel: (value: string | null) => void;
  setGeoCoords: (value: { latitude: number; longitude: number } | null) => void;
  setCameraRestartToken: (fn: (value: number) => number) => void;
};

export type CameraLifecycleRefs = {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  streamRef: React.MutableRefObject<MediaStream | null>;
  reportedFailureRef: React.MutableRefObject<string | null>;
  detectorModeRef: React.MutableRefObject<'mediapipe' | 'fallback'>;
  missedDetectionFramesRef: React.MutableRefObject<number>;
  blinkPeakSeenRef: React.MutableRefObject<boolean>;
  guideLockSeenRef: React.MutableRefObject<boolean>;
  cameraRestartingRef: React.MutableRefObject<boolean>;
};

export type CameraLifecycleState = {
  actionMode: AttendanceActionMode | null;
  cameraRestartToken: number;
  detectionHits: number;
  livenessVerified: boolean;
  enrollmentFreezeFrameUrl: string | null;
};

type CameraLifecycleOptions = {
  setters: CameraLifecycleSetters;
  refs: CameraLifecycleRefs;
  state: CameraLifecycleState;
  captureSnapshot: () => string;
};

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useHrCameraLifecycle({
  setters,
  refs,
  state,
  captureSnapshot,
}: CameraLifecycleOptions): void {
  const { actionMode, cameraRestartToken, detectionHits, livenessVerified, enrollmentFreezeFrameUrl } = state;
  const { videoRef, streamRef, reportedFailureRef, detectorModeRef, missedDetectionFramesRef, blinkPeakSeenRef, guideLockSeenRef, cameraRestartingRef } = refs;
  const {
    setCameraReady, setCameraError, setDetectorReady, setFaceDetected, setDetectionHits,
    setDetectedFaceBox, setLivenessVerified, setLivenessProgress, setLivenessPrompt,
    setEnrollmentHoldStep, setEnrollmentFreezeFrameUrl, setEnrollmentLockPulse,
    setDetectorUnavailable, setActionError, setActionMessage, setEnrollmentConflictMessage,
    setEnrollmentConflictAppUserId, setGeoLabel, setGeoCoords, setCameraRestartToken,
  } = setters;

  useEffect(() => {
    if (!actionMode) {
      return;
    }

    const activeMode = actionMode;
    let cancelled = false;
    let detectionTimer: number | null = null;
    let restartTimer: number | null = null;
    let currentTrack: MediaStreamTrack | null = null;
    let currentVideo: HTMLVideoElement | null = null;

    const resetLiveness = () => {
      setLivenessVerified(false);
      setLivenessProgress(0);
      setEnrollmentHoldStep(0);
      setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
    };

    const requestCameraRestart = (message: string) => {
      if (cancelled || cameraRestartingRef.current) return;
      cameraRestartingRef.current = true;
      setCameraError(message);
      setCameraReady(false);
      setFaceDetected(false);
      setDetectionHits(0);
      resetLiveness();
      setDetectedFaceBox(null);

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (currentVideo) currentVideo.srcObject = null;

      restartTimer = window.setTimeout(() => {
        if (!cancelled) setCameraRestartToken((v) => v + 1);
      }, 350);
    };

    const handleTrackEnded = () =>
      requestCameraRestart('Stream kamera terputus. Sistem mencoba menyambungkan ulang kamera.');
    const handleTrackMuted = () =>
      requestCameraRestart('Preview kamera terhenti sementara. Sistem mencoba memulihkan stream kamera.');
    const handleVideoStreamInterrupted = () =>
      requestCameraRestart('Preview kamera kosong. Sistem mencoba memuat ulang stream kamera.');

    const resetFaceState = () => {
      missedDetectionFramesRef.current += 1;
      if (missedDetectionFramesRef.current >= 3) {
        setFaceDetected(false);
        setDetectedFaceBox(null);
        setDetectionHits(0);
        resetLiveness();
        setEnrollmentFreezeFrameUrl(null);
        blinkPeakSeenRef.current = false;
        guideLockSeenRef.current = false;
        setEnrollmentLockPulse(false);
      } else {
        setDetectionHits((current) => Math.max(0, current - 1));
      }
    };

    async function getCurrentPosition(): Promise<{ latitude: number; longitude: number }> {
      if (!navigator.geolocation) {
        throw new Error('Geolocation is not available on this device.');
      }
      setGeoLabel('Requesting GPS fix...');
      return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coords = {
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            };
            setGeoCoords(coords);
            setGeoLabel(`${coords.latitude.toFixed(5)}, ${coords.longitude.toFixed(5)}`);
            resolve(coords);
          },
          (error) => {
            const message = normalizeDeviceError(error, 'gps');
            reject(new Error(message));
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 },
        );
      });
    }

    async function startCamera() {
      cameraRestartingRef.current = false;
      setCameraReady(false);
      setDetectorReady(false);
      setCameraError(null);
      setActionError(null);
      setActionMessage(null);
      setEnrollmentConflictMessage(null);
      setEnrollmentConflictAppUserId(null);
      setFaceDetected(false);
      setDetectionHits(0);
      setDetectedFaceBox(null);
      resetLiveness();
      blinkPeakSeenRef.current = false;
      guideLockSeenRef.current = false;
      setEnrollmentLockPulse(false);
      missedDetectionFramesRef.current = 0;
      setDetectorUnavailable(false);
      setGeoLabel(null);
      setGeoCoords(null);
      reportedFailureRef.current = null;

      if (!navigator.mediaDevices?.getUserMedia) {
        setCameraError('Browser camera API is not available on this device.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        });

        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }

        streamRef.current = stream;
        currentTrack = stream.getVideoTracks()[0] ?? null;
        if (currentTrack) {
          currentTrack.addEventListener('ended', handleTrackEnded);
          currentTrack.addEventListener('mute', handleTrackMuted);
        }

        if (videoRef.current) {
          currentVideo = videoRef.current;
          currentVideo.addEventListener('emptied', handleVideoStreamInterrupted);
          currentVideo.addEventListener('stalled', handleVideoStreamInterrupted);
          currentVideo.srcObject = stream;
          await currentVideo.play().catch(() => undefined);
        }

        setCameraReady(true);

        void getCurrentPosition().catch((error) => {
          if (!cancelled) {
            setActionError(error instanceof Error ? error.message : 'Gagal mendapatkan GPS.');
          }
        });

        const { detector, mode } = await getFaceDetector();
        if (cancelled) return;

        setDetectorReady(true);
        detectorModeRef.current = mode;

        if (mode === 'fallback' || !detector) {
          setDetectedFaceBox(null);
          setFaceDetected(false);
          setDetectionHits(0);
          setLivenessVerified(false);
          setLivenessProgress(0);
          setEnrollmentFreezeFrameUrl(null);
          setDetectorUnavailable(true);
          setActionError(
            'Browser ini belum mendukung deteksi wajah otomatis. Gunakan Chrome atau Edge versi terbaru untuk melanjutkan pendaftaran wajah dan absensi.',
          );
          return;
        }

        detectionTimer = window.setInterval(async () => {
          const video = videoRef.current;
          if (!video || video.readyState < 2) return;

          try {
            const faces = await detector.estimateFaces(video);
            if (cancelled) return;

            const hasFace = faces.length > 0;
            if (hasFace) {
              const currentFace = faces[0];
              missedDetectionFramesRef.current = 0;
              setFaceDetected(true);
              const normalizedFaceBox = normalizeFaceBoundingBox(currentFace);
              setDetectedFaceBox(normalizedFaceBox);
              const nextDetectionHits = Math.min(detectionHits + 1, 12);
              setDetectionHits((current) => Math.min(current + 1, 12));
              const framing = getLiveFaceFraming(video, normalizedFaceBox);
              const attendanceFramingReady =
                framing.wellFramed || framing.alignmentState === 'near' ||
                (framing.faceCoverage >= 0.04 && framing.centerOffsetX <= 0.22 && framing.centerOffsetY <= 0.22);

              if (activeMode === 'enroll') {
                if (framing.locked) {
                  if (!guideLockSeenRef.current) {
                    guideLockSeenRef.current = true;
                    setEnrollmentLockPulse(true);
                    window.setTimeout(() => setEnrollmentLockPulse(false), 320);
                  }
                } else {
                  guideLockSeenRef.current = false;
                  setEnrollmentLockPulse(false);
                }
              }

              const blinkScore = currentFace.liveness.avgBlink;
              if (!livenessVerified) {
                if (activeMode === 'enroll') {
                  if (!framing.locked) {
                    blinkPeakSeenRef.current = false;
                    setLivenessProgress(0);
                    setLivenessPrompt('Posisikan wajah ke dalam area panduan sampai sistem mengunci wajah.');
                    setEnrollmentFreezeFrameUrl(null);
                  } else if (!blinkPeakSeenRef.current && blinkScore >= 0.38) {
                    blinkPeakSeenRef.current = true;
                    setLivenessProgress(1);
                    setLivenessPrompt('Kedipan mulai terbaca. Selesaikan satu kedipan yang jelas.');
                  } else if (blinkPeakSeenRef.current && blinkScore <= 0.26) {
                    blinkPeakSeenRef.current = false;
                    setLivenessVerified(true);
                    setLivenessProgress(2);
                    setLivenessPrompt('Kedipan terdeteksi. Verifikasi liveness berhasil.');
                  } else if (!blinkPeakSeenRef.current) {
                    setLivenessPrompt('Verifikasi wajah siap. Kedipkan mata sekali untuk melanjutkan.');
                  }
                } else if (!attendanceFramingReady) {
                  setLivenessProgress(1);
                  setLivenessPrompt('Geser wajah ke tengah frame dan pastikan dahi sampai dagu terlihat penuh.');
                } else if (nextDetectionHits >= 1) {
                  setLivenessVerified(true);
                  setLivenessProgress(2);
                  setLivenessPrompt('Wajah sudah siap. Sistem sedang menyiapkan absensi.');
                } else {
                  setLivenessProgress(0);
                  setLivenessPrompt('Arahkan wajah ke dalam frame sampai posisi stabil.');
                }
              }

              if (activeMode === 'enroll' && framing.locked && livenessVerified && !enrollmentFreezeFrameUrl) {
                try {
                  setEnrollmentFreezeFrameUrl(captureSnapshot());
                } catch {
                  // ignore freeze capture failures; live preview stays as fallback
                }
              }
            } else {
              resetFaceState();
            }
          } catch {
            resetFaceState();
          }
        }, 350);
      } catch (error) {
        const message = normalizeDeviceError(error, 'camera');
        setCameraError(message);
        void reportClientFailure(activeMode, 'camera_denied', reportedFailureRef, {
          metadata: { stage: 'camera_bootstrap' },
        });
      }
    }

    void startCamera();

    return () => {
      cancelled = true;
      if (detectionTimer) window.clearInterval(detectionTimer);
      if (restartTimer) window.clearTimeout(restartTimer);
      if (currentTrack) {
        currentTrack.removeEventListener('ended', handleTrackEnded);
        currentTrack.removeEventListener('mute', handleTrackMuted);
      }
      if (currentVideo) {
        currentVideo.removeEventListener('emptied', handleVideoStreamInterrupted);
        currentVideo.removeEventListener('stalled', handleVideoStreamInterrupted);
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      if (videoRef.current) videoRef.current.srcObject = null;
      setCameraReady(false);
      setDetectorReady(false);
      setFaceDetected(false);
      setDetectionHits(0);
      setDetectedFaceBox(null);
      setLivenessVerified(false);
      setLivenessProgress(0);
      setLivenessPrompt('Kedipkan mata sekali untuk membuktikan ini wajah asli.');
      blinkPeakSeenRef.current = false;
      guideLockSeenRef.current = false;
      setEnrollmentLockPulse(false);
      missedDetectionFramesRef.current = 0;
      setGeoLabel(null);
      setGeoCoords(null);
    };
  }, [actionMode, cameraRestartToken]); // eslint-disable-line react-hooks/exhaustive-deps
}
