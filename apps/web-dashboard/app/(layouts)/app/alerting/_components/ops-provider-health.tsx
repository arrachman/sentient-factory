'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import type { AlertOpsPayload, BaileysPairingPayload } from './types';

export function OpsProviderHealth({
  providerHealth,
  pairingPhoneNumber,
  setPairingPhoneNumber,
  startBaileysPairing,
  pairingLoading,
  pairingResult,
  qrImageUrl,
  qrImageError,
  copyToClipboard,
  isCopied,
}: {
  providerHealth: AlertOpsPayload['provider_health'];
  pairingPhoneNumber: string;
  setPairingPhoneNumber: (value: string) => void;
  startBaileysPairing: () => void;
  pairingLoading: boolean;
  pairingResult: BaileysPairingPayload | null;
  qrImageUrl: string | null;
  qrImageError: string | null;
  copyToClipboard: (value: string) => void;
  isCopied: boolean;
}) {
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Baileys Session Health</CardTitle>
          <CardDescription>Runtime readiness for WhatsApp delivery through Baileys.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <span className="font-medium">Status</span>
            <Badge variant="outline" className={providerHealth.baileys.session_ready ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-amber-200 bg-amber-50 text-amber-700'}>
              {providerHealth.baileys.status_label}
            </Badge>
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Enabled: {providerHealth.baileys.enabled ? 'Yes' : 'No'}
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Auth Directory: {providerHealth.baileys.auth_dir || '-'}
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Auth Dir Exists: {providerHealth.baileys.auth_dir_exists ? 'Yes' : 'No'} · Files: {providerHealth.baileys.auth_file_count}
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Creds Present: {providerHealth.baileys.creds_present ? 'Yes' : 'No'} · Session Ready: {providerHealth.baileys.session_ready ? 'Yes' : 'No'}
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Last Auth Update: {providerHealth.baileys.last_auth_update_at ? providerHealth.baileys.last_auth_update_at.replace('T', ' ').slice(0, 19) : '-'}
          </div>
          {providerHealth.baileys.pairing_required ? (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
              Pairing is still required. Populate `ALERTING_WA_BAILEYS_AUTH_DIR`, enable Baileys, then complete the WhatsApp auth flow in runtime before expecting real delivery.
            </div>
          ) : null}
          <div className="space-y-2 rounded-xl border px-4 py-3">
            <div className="text-sm font-medium">Start Pairing</div>
            <Input
              value={pairingPhoneNumber}
              onChange={(event) => setPairingPhoneNumber(event.target.value)}
              placeholder="62812xxxxxxx for pairing code, or leave blank for QR token"
            />
            <Button size="sm" onClick={startBaileysPairing} disabled={pairingLoading || !providerHealth.baileys.enabled}>
              {pairingLoading ? 'Starting Pairing...' : 'Start Baileys Pairing'}
            </Button>
            {!providerHealth.baileys.enabled ? (
              <div className="text-xs text-muted-foreground">
                Enable `ALERTING_WA_BAILEYS_ENABLED=true` first.
              </div>
            ) : null}
          </div>
          {pairingResult ? (
            <div className="rounded-xl border px-4 py-3">
              <div className="text-sm font-medium">Pairing Result</div>
              <div className="mt-2 text-xs text-muted-foreground">{pairingResult.message}</div>
              {pairingResult.pairing_code ? (
                <div className="mt-2 space-y-2">
                  <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900">
                    {pairingResult.pairing_code}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(pairingResult.pairing_code || '')}>
                    {isCopied ? 'Copied' : 'Copy Pairing Code'}
                  </Button>
                </div>
              ) : null}
              {pairingResult.qr ? (
                <div className="mt-2 space-y-3">
                  {qrImageUrl ? (
                    <div className="flex justify-center rounded-xl border bg-white p-3">
                      {/* next/image is not necessary here; QR is already a data URL payload */}
                      <img src={qrImageUrl} alt="Baileys pairing QR" className="h-72 w-72" />
                    </div>
                  ) : null}
                  {qrImageError ? (
                    <div className="text-xs text-amber-600 dark:text-amber-400">{qrImageError}</div>
                  ) : null}
                  <div className="rounded-lg bg-slate-50 px-3 py-2 font-mono text-xs text-slate-900 break-all">
                    {pairingResult.qr}
                  </div>
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(pairingResult.qr || '')}>
                    {isCopied ? 'Copied' : 'Copy QR Token'}
                  </Button>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SMTP Health</CardTitle>
          <CardDescription>Runtime readiness for email delivery through SMTP.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between rounded-xl border px-4 py-3">
            <span className="font-medium">Status</span>
            <Badge variant="outline" className={providerHealth.smtp.configured ? 'border-emerald-200 bg-emerald-50 text-emerald-700' : 'border-slate-200 bg-slate-50 text-slate-700'}>
              {providerHealth.smtp.configured ? 'configured' : 'not-configured'}
            </Badge>
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Host: {providerHealth.smtp.host || '-'} · Port: {providerHealth.smtp.port || '-'}
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Secure: {providerHealth.smtp.secure ? 'Yes' : 'No'} · From: {providerHealth.smtp.from || '-'}
          </div>
          <div className="rounded-xl border px-4 py-3 text-sm text-muted-foreground">
            Auth Credentials Present: {providerHealth.smtp.has_auth ? 'Yes' : 'No'}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
