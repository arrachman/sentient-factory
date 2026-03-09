'use client';

import { useEffect, useRef, useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const BACKEND_DOWN_STATUSES = new Set([502, 503, 504]);
const DEFAULT_CHECK_INTERVAL_MS = 300000;

let lastCheckAt = 0;
let lastCheckResult = false;
let inflightCheck: Promise<boolean> | null = null;

function getCheckIntervalMs() {
  const configured = Number(process.env.NEXT_PUBLIC_BACKEND_STATUS_CHECK_INTERVAL_MS);
  if (Number.isFinite(configured) && configured >= 5000) {
    return configured;
  }
  return DEFAULT_CHECK_INTERVAL_MS;
}

async function checkBackendDown(): Promise<boolean> {
  try {
    const response = await fetch('/api/auth/me', {
      method: 'GET',
      cache: 'no-store',
      credentials: 'include',
    });

    if (response.status === 401 || response.status === 403) {
      return false;
    }

    return BACKEND_DOWN_STATUSES.has(response.status) || response.status >= 500;
  } catch {
    return true;
  }
}

async function checkBackendDownShared(force = false): Promise<boolean> {
  const intervalMs = getCheckIntervalMs();
  const now = Date.now();

  if (!force && now - lastCheckAt < intervalMs) {
    return lastCheckResult;
  }

  if (inflightCheck) {
    return inflightCheck;
  }

  inflightCheck = checkBackendDown()
    .then((result) => {
      lastCheckAt = Date.now();
      lastCheckResult = result;
      return result;
    })
    .finally(() => {
      inflightCheck = null;
    });

  return inflightCheck;
}

export function BackendStatusWarning() {
  const [isBackendDown, setIsBackendDown] = useState(false);
  const [isChecking, setIsChecking] = useState(false);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const runCheck = async () => {
      if (mountedRef.current) {
        setIsChecking(true);
      }
      const down = await checkBackendDownShared();
      if (mountedRef.current) {
        setIsBackendDown(down);
        setIsChecking(false);
      }
    };

    void runCheck();
    const intervalId = setInterval(() => {
      void runCheck();
    }, getCheckIntervalMs());

    return () => {
      mountedRef.current = false;
      clearInterval(intervalId);
    };
  }, []);

  if (!isBackendDown) {
    return null;
  }

  return (
    <div className="container-fluid mt-2">
      <Alert variant="warning" appearance="light" size="md">
        <AlertIcon>
          <AlertTriangle className="size-5" />
        </AlertIcon>
        <AlertContent>
          <AlertTitle>API Gateway bermasalah</AlertTitle>
          <AlertDescription>
            Koneksi ke API Gateway terputus (contoh 502/504) atau layanan backend sedang tidak tersedia.
          </AlertDescription>
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="w-fit"
            onClick={() => {
              if (isChecking) {
                return;
              }

              setIsChecking(true);
              void checkBackendDownShared(true)
                .then((down) => {
                  if (mountedRef.current) {
                    setIsBackendDown(down);
                  }
                })
                .finally(() => {
                  if (mountedRef.current) {
                    setIsChecking(false);
                  }
                });
            }}
          >
            {isChecking ? 'Checking...' : 'Retry now'}
          </Button>
        </AlertContent>
      </Alert>
    </div>
  );
}
