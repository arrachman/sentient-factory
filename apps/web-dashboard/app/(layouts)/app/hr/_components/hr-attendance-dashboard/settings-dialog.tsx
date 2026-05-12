'use client';

/**
 * Dialog Pengaturan Validasi (admin only) — set threshold auto-submit,
 * identify 1:N, verify 1:1; toggle auto submit on/off.
 */
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import type { DashboardPayload } from './types';

export function AttendanceSettingsDialog({
  open,
  onOpenChange,
  payload,
  saving,
  thresholdInput,
  setThresholdInput,
  identifyThresholdInput,
  setIdentifyThresholdInput,
  verifyThresholdInput,
  setVerifyThresholdInput,
  onToggleAutoSubmit,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  payload: DashboardPayload | null;
  saving: boolean;
  thresholdInput: string;
  setThresholdInput: (value: string) => void;
  identifyThresholdInput: string;
  setIdentifyThresholdInput: (value: string) => void;
  verifyThresholdInput: string;
  setVerifyThresholdInput: (value: string) => void;
  onToggleAutoSubmit: () => void;
  onSave: () => void;
}) {
  const autoEnabled = payload?.settings?.autoSubmitEnabled ?? true;
  const autoThreshold = payload?.settings?.autoSubmitConfidenceThreshold ?? 0.9;
  const identifyThreshold =
    payload?.settings?.faceIdentifyConfidenceThreshold ?? 0.82;
  const verifyThreshold =
    payload?.settings?.faceVerifyConfidenceThreshold ?? 0.82;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            Pengaturan Validasi
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Konfigurasi threshold dipisahkan dari dashboard monitoring agar
            operasional harian tetap bersih.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-4">
          <ThresholdField
            id="auto-submit-threshold"
            label="Threshold Auto Submit"
            value={thresholdInput}
            onChange={setThresholdInput}
            placeholder="0.90"
          />
          <ThresholdField
            id="identify-threshold"
            label="Threshold Identifikasi 1:N"
            value={identifyThresholdInput}
            onChange={setIdentifyThresholdInput}
            placeholder="0.82"
          />
          <ThresholdField
            id="verify-threshold"
            label="Threshold Verifikasi 1:1"
            value={verifyThresholdInput}
            onChange={setVerifyThresholdInput}
            placeholder="0.82"
          />
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Auto Submit: {autoEnabled ? 'Aktif' : 'Nonaktif'} • Auto Submit{' '}
            {autoThreshold.toFixed(2)} • 1:N {identifyThreshold.toFixed(2)} •
            1:1 {verifyThreshold.toFixed(2)}
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            disabled={saving}
            onClick={onToggleAutoSubmit}
          >
            {saving
              ? 'Menyimpan...'
              : autoEnabled
                ? 'Nonaktifkan Auto Submit'
                : 'Aktifkan Auto Submit'}
          </Button>
          <Button
            className="h-10 rounded-xl"
            disabled={saving}
            onClick={onSave}
          >
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function ThresholdField({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div className="space-y-1">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-10 rounded-xl"
      />
    </div>
  );
}
