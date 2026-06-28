'use client';

import { ReactNode } from 'react';
import { Loader2, ShieldAlert, Inbox, AlertTriangle } from 'lucide-react';

/**
 * Standard loading / error / empty states for HR data screens.
 * A 401 from the shared gateway means there is no active platform session —
 * web-hr does not own login, so we surface a clear hint instead of a raw error.
 */
export function QueryState({
  isLoading,
  error,
  isEmpty,
  emptyLabel = 'Belum ada data.',
  children,
}: {
  isLoading: boolean;
  error: unknown;
  isEmpty?: boolean;
  emptyLabel?: string;
  children: ReactNode;
}) {
  if (isLoading) {
    return (
      <Centered>
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Memuat…</span>
      </Centered>
    );
  }

  if (error) {
    const status = (error as { code?: string })?.code;
    const isAuth = status === 'HTTP_401' || status === 'UNAUTHORIZED';
    return (
      <Centered>
        {isAuth ? (
          <>
            <ShieldAlert className="h-6 w-6 text-warn" />
            <p className="text-sm font-medium">Sesi tidak ditemukan</p>
            <p className="max-w-sm text-center text-xs text-muted-foreground">
              web-hr memakai sesi platform (cookie <code>sf_token</code>). Login
              dulu lewat platform Sentient, lalu buka kembali halaman ini.
            </p>
          </>
        ) : (
          <>
            <AlertTriangle className="h-6 w-6 text-danger" />
            <p className="text-sm font-medium">Gagal memuat data</p>
            <p className="max-w-sm text-center text-xs text-muted-foreground">
              {(error as Error)?.message ?? 'Terjadi kesalahan.'}
            </p>
          </>
        )}
      </Centered>
    );
  }

  if (isEmpty) {
    return (
      <Centered>
        <Inbox className="h-6 w-6 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">{emptyLabel}</span>
      </Centered>
    );
  }

  return <>{children}</>;
}

function Centered({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-2 rounded-lg border bg-card">
      {children}
    </div>
  );
}
