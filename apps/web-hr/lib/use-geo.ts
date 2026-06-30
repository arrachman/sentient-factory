'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export type Coords = { latitude: number; longitude: number };
export type GeoStatus = 'idle' | 'locating' | 'ready' | 'error';

export interface UseGeoResult {
  coords: Coords | null;
  /** Horizontal accuracy in metres (lower = better), when reported. */
  accuracy: number | null;
  status: GeoStatus;
  error: string | null;
  /** (Re)request a fix. Safe to call from a retry button. */
  locate: () => void;
}

const GEO_OPTS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10_000,
  maximumAge: 0,
};

function messageFor(code: number): string {
  if (code === 1) return 'Akses lokasi ditolak. Izinkan lokasi di browser, lalu coba lagi.';
  if (code === 3) return 'Pencarian lokasi habis waktu. Pastikan GPS aktif, lalu coba lagi.';
  return 'Lokasi tidak tersedia. Aktifkan GPS / izinkan lokasi, lalu coba lagi.';
}

/**
 * Geolocation hook for attendance. Unlike a one-shot getCurrentPosition, this
 * keeps a status machine and exposes `locate()` for a retry button so a failed
 * GPS lock never leaves the user stuck on the clock screen. Reports accuracy so
 * the UI can show how precise the fix is (informative + auditable).
 */
export function useGeo(): UseGeoResult {
  const supported = typeof navigator !== 'undefined' && Boolean(navigator.geolocation);
  const [coords, setCoords] = useState<Coords | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [status, setStatus] = useState<GeoStatus>(supported ? 'idle' : 'error');
  const [error, setError] = useState<string | null>(
    supported ? null : 'Geolokasi tidak didukung browser ini.',
  );
  const pendingRef = useRef(false);

  const locate = useCallback(() => {
    if (!supported || pendingRef.current) return;
    pendingRef.current = true;
    setStatus('locating');
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        pendingRef.current = false;
        setCoords({ latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        setAccuracy(Number.isFinite(pos.coords.accuracy) ? pos.coords.accuracy : null);
        setStatus('ready');
        setError(null);
      },
      (err) => {
        pendingRef.current = false;
        setStatus('error');
        setError(messageFor(err.code));
      },
      GEO_OPTS,
    );
  }, [supported]);

  // Request a fix once on mount.
  useEffect(() => {
    if (supported) locate();
  }, [supported, locate]);

  return { coords, accuracy, status, error, locate };
}
