'use client';

/**
 * Standalone action utility functions for the HR attendance flow.
 * No React hooks — all state needed is passed as parameters.
 */

import type { AttendanceActionMode, FaceIdentifyPayload } from './_types-hr';

// ---------------------------------------------------------------------------
// playValidationCue
// ---------------------------------------------------------------------------

/** Plays a short haptic + audio cue for success or failure feedback. */
export function playValidationCue(kind: 'success' | 'failure'): void {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(kind === 'success' ? [18] : [18, 40, 18]);
    }

    if (typeof window === 'undefined') {
      return;
    }

    const AudioContextCtor =
      window.AudioContext ||
      (
        window as Window & {
          webkitAudioContext?: typeof AudioContext;
        }
      ).webkitAudioContext;

    if (!AudioContextCtor) {
      return;
    }

    const context = new AudioContextCtor();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = kind === 'success' ? 880 : 320;
    gain.gain.value = 0.0001;

    oscillator.connect(gain);
    gain.connect(context.destination);

    const start = context.currentTime;
    const end = start + (kind === 'success' ? 0.08 : 0.12);
    gain.gain.exponentialRampToValueAtTime(0.04, start + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, end);

    oscillator.start(start);
    oscillator.stop(end);
    window.setTimeout(() => void context.close().catch(() => undefined), 180);
  } catch {
    // ignore audio/haptic issues
  }
}

// ---------------------------------------------------------------------------
// reportClientFailure
// ---------------------------------------------------------------------------

/**
 * Sends a failure event to the server, deduplicated via `reportedFailureRef`.
 */
export async function reportClientFailure(
  mode: AttendanceActionMode,
  reasonCode: string,
  reportedFailureRef: React.MutableRefObject<string | null>,
  options?: {
    snapshotDataUrl?: string | null;
    latitude?: number;
    longitude?: number;
    faceScore?: number;
    livenessScore?: number;
    metadata?: Record<string, unknown>;
  },
): Promise<void> {
  const dedupeKey = `${mode}:${reasonCode}`;
  if (reportedFailureRef.current === dedupeKey) {
    return;
  }
  reportedFailureRef.current = dedupeKey;

  const eventType =
    mode === 'enroll'
      ? 'face_enrollment_attempt'
      : mode === 'clockIn'
        ? 'clock_in_attempt'
        : 'clock_out_attempt';

  await fetch('/api/hr/attendance/report-failure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      eventType,
      reasonCode,
      latitude: options?.latitude,
      longitude: options?.longitude,
      faceScore: options?.faceScore,
      livenessScore: options?.livenessScore,
      snapshotDataUrl: options?.snapshotDataUrl ?? undefined,
      deviceInfo: {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
      },
      metadata: {
        source: 'web-dashboard',
        ...(options?.metadata ?? {}),
      },
    }),
  }).catch(() => undefined);
}

// ---------------------------------------------------------------------------
// getUnknownFaceToastMessage
// ---------------------------------------------------------------------------

export function getUnknownFaceToastMessage(
  actionMode: AttendanceActionMode,
  opts: {
    faceDetected: boolean;
    wellFramed: boolean;
    identifyConflict: boolean;
    identifyResult: FaceIdentifyPayload | null;
    lowConfidence: boolean;
    lowConfidenceHint: string | null;
  },
): string {
  if (actionMode === 'enroll' && opts.faceDetected && !opts.wellFramed) {
    return 'Posisikan wajah penuh di tengah frame. Jangan hanya sebagian wajah yang masuk kamera.';
  }

  if (actionMode === 'enroll') {
    return 'Wajah belum stabil. Pastikan cahaya cukup dan wajah berada di tengah frame.';
  }

  const identifiedCandidate = opts.identifyResult?.candidate ?? null;
  if (opts.identifyConflict && identifiedCandidate) {
    return `Wajah lebih cocok dengan ${identifiedCandidate.fullName ?? identifiedCandidate.username}.`;
  }

  if (opts.lowConfidence && opts.lowConfidenceHint) {
    return opts.lowConfidenceHint;
  }

  return 'Wajah tidak dikenali, coba sesuaikan pencahayaan dan posisi wajah.';
}
