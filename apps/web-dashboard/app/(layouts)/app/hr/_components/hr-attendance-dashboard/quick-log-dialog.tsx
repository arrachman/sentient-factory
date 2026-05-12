'use client';

import Link from 'next/link';
import { UserRound } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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
import { cn } from '@/lib/utils';

type AttendanceLogItem = {
  id: string;
  title: string;
  subtitle: string;
  timeLabel: string;
  status: string;
  filterGroup: 'needs_review' | 'success' | 'rejected';
  href: string;
  typeLabel: string;
  rawDate: string;
  snapshotUrl?: string | null;
  reviewHref?: string | null;
  historyHref?: string | null;
  detailRows: Array<{ label: string; value: string }>;
};

function statusTone(value: string | null | undefined) {
  switch (value) {
    case 'success': return 'bg-emerald-100 text-emerald-700';
    case 'manual_review': return 'bg-amber-100 text-amber-800';
    case 'warning': return 'bg-orange-100 text-orange-800';
    case 'rejected': return 'bg-rose-100 text-rose-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}

function humanizeStatus(value: string | null | undefined) {
  switch (value) {
    case 'pending': return 'Menunggu Review';
    case 'manual_review': return 'Perlu Review';
    case 'success': return 'Berhasil';
    case 'rejected': return 'Ditolak';
    case 'approved': return 'Disetujui';
    case 'needs_clarification': return 'Perlu Klarifikasi';
    case 'warning': return 'Peringatan';
    default:
      if (!value) return '-';
      return value.split('_').map((c) => c.charAt(0).toUpperCase() + c.slice(1)).join(' ');
  }
}

export type QuickLogDialogProps = {
  selectedLogItem: AttendanceLogItem | null;
  imageBroken: boolean;
  onImageError: () => void;
  onClose: () => void;
};

export function QuickLogDialog({
  selectedLogItem,
  imageBroken,
  onImageError,
  onClose,
}: QuickLogDialogProps) {
  return (
    <Dialog open={!!selectedLogItem} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            {selectedLogItem?.title ?? 'Detail Cepat'}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {selectedLogItem?.subtitle ?? 'Ringkasan cepat sebelum membuka halaman detail penuh.'}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <Badge className={cn('border-0', statusTone(selectedLogItem?.status))}>
              {humanizeStatus(selectedLogItem?.status)}
            </Badge>
            {selectedLogItem?.typeLabel ? (
              <Badge className="border-0 bg-slate-100 text-slate-700">{selectedLogItem.typeLabel}</Badge>
            ) : null}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {selectedLogItem?.snapshotUrl && !imageBroken ? (
              <img
                src={`/api/hr/events/${selectedLogItem.id.replace('event-', '')}/snapshot`}
                alt=""
                className="h-44 w-full object-cover"
                onError={onImageError}
              />
            ) : (
              <div className="flex h-44 items-center justify-center text-slate-400">
                <UserRound className="size-10" />
              </div>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {(selectedLogItem?.detailRows ?? []).map((row) => (
              <div key={`${selectedLogItem?.id}-${row.label}`} className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">{row.label}</p>
                <p className="mt-1 text-sm font-medium text-slate-900">{row.value}</p>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <Button variant="outline" className="h-10 rounded-xl" onClick={onClose}>Tutup</Button>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {selectedLogItem?.reviewHref ? (
              <Button asChild variant="outline" className="h-10 rounded-xl">
                <Link href={selectedLogItem.reviewHref}>Buka Review</Link>
              </Button>
            ) : null}
            {selectedLogItem?.historyHref ? (
              <Button asChild variant="outline" className="h-10 rounded-xl">
                <Link href={selectedLogItem.historyHref}>Riwayat Pegawai</Link>
              </Button>
            ) : null}
            {selectedLogItem ? (
              <Button asChild className="h-10 rounded-xl">
                <Link href={selectedLogItem.href}>Buka Halaman Detail</Link>
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
