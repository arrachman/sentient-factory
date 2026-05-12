'use client';

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

type DashboardSettings = {
  autoSubmitEnabled?: boolean;
  autoSubmitConfidenceThreshold?: number;
  faceIdentifyConfidenceThreshold?: number;
  faceVerifyConfidenceThreshold?: number;
};

export type ValidationSettingsDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  settings: DashboardSettings | undefined;
  thresholdInput: string;
  identifyThresholdInput: string;
  verifyThresholdInput: string;
  onThresholdChange: (value: string) => void;
  onIdentifyThresholdChange: (value: string) => void;
  onVerifyThresholdChange: (value: string) => void;
  saving: boolean;
  onToggleAutoSubmit: () => void;
  onSave: () => void;
};

export function ValidationSettingsDialog({
  open,
  onOpenChange,
  settings,
  thresholdInput,
  identifyThresholdInput,
  verifyThresholdInput,
  onThresholdChange,
  onIdentifyThresholdChange,
  onVerifyThresholdChange,
  saving,
  onToggleAutoSubmit,
  onSave,
}: ValidationSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">Pengaturan Validasi</DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            Konfigurasi threshold dipisahkan dari dashboard monitoring agar operasional harian tetap bersih.
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-4 px-5 py-4">
          <div className="space-y-1">
            <Label htmlFor="auto-submit-threshold">Threshold Auto Submit</Label>
            <Input
              id="auto-submit-threshold"
              value={thresholdInput}
              onChange={(e) => onThresholdChange(e.target.value)}
              placeholder="0.90"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="identify-threshold">Threshold Identifikasi 1:N</Label>
            <Input
              id="identify-threshold"
              value={identifyThresholdInput}
              onChange={(e) => onIdentifyThresholdChange(e.target.value)}
              placeholder="0.82"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="space-y-1">
            <Label htmlFor="verify-threshold">Threshold Verifikasi 1:1</Label>
            <Input
              id="verify-threshold"
              value={verifyThresholdInput}
              onChange={(e) => onVerifyThresholdChange(e.target.value)}
              placeholder="0.82"
              className="h-10 rounded-xl"
            />
          </div>
          <div className="rounded-xl bg-slate-50 px-4 py-3 text-xs text-slate-600">
            Auto Submit: {(settings?.autoSubmitEnabled ?? true) ? 'Aktif' : 'Nonaktif'} •{' '}
            Auto Submit {(settings?.autoSubmitConfidenceThreshold ?? 0.9).toFixed(2)} •{' '}
            1:N {(settings?.faceIdentifyConfidenceThreshold ?? 0.82).toFixed(2)} •{' '}
            1:1 {(settings?.faceVerifyConfidenceThreshold ?? 0.82).toFixed(2)}
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <Button variant="outline" className="h-10 rounded-xl" disabled={saving} onClick={onToggleAutoSubmit}>
            {saving ? 'Menyimpan...' : settings?.autoSubmitEnabled ? 'Nonaktifkan Auto Submit' : 'Aktifkan Auto Submit'}
          </Button>
          <Button className="h-10 rounded-xl" disabled={saving} onClick={onSave}>
            {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
