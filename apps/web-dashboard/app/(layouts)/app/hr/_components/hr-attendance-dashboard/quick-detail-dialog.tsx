'use client';

/**
 * Quick detail dialog untuk item attendance log — snapshot + status + detail rows
 * + tombol buka review / riwayat pegawai / halaman detail penuh.
 */
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
import { humanizeStatus, statusTone } from '../hr-shared';
import type { AttendanceLogItem } from './types';

export function AttendanceQuickDetailDialog({
  item,
  imageBroken,
  onImageError,
  onClose,
}: {
  item: AttendanceLogItem | null;
  imageBroken: boolean;
  onImageError: () => void;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!item} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg rounded-2xl border-0 p-0 shadow-[0px_18px_60px_rgba(15,23,42,0.18)]">
        <DialogHeader className="border-b border-slate-200 px-5 py-4">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            {item?.title ?? 'Detail Cepat'}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500">
            {item?.subtitle ??
              'Ringkasan cepat sebelum membuka halaman detail penuh.'}
          </DialogDescription>
        </DialogHeader>
        <DialogBody className="space-y-3 px-5 py-4">
          <div className="flex items-center gap-2">
            <Badge className={cn('border-0', statusTone(item?.status))}>
              {humanizeStatus(item?.status)}
            </Badge>
            {item?.typeLabel ? (
              <Badge className="border-0 bg-slate-100 text-slate-700">
                {item.typeLabel}
              </Badge>
            ) : null}
          </div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-100">
            {item?.snapshotUrl && !imageBroken ? (
              <img
                src={`/api/hr/events/${item.id.replace('event-', '')}/snapshot`}
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
            {(item?.detailRows ?? []).map((row) => (
              <div
                key={`${item?.id}-${row.label}`}
                className="rounded-xl bg-slate-50 px-4 py-3"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  {row.label}
                </p>
                <p className="mt-1 text-sm font-medium text-slate-900">
                  {row.value}
                </p>
              </div>
            ))}
          </div>
        </DialogBody>
        <DialogFooter className="flex items-center justify-between gap-3 border-t border-slate-200 px-5 py-4">
          <Button
            variant="outline"
            className="h-10 rounded-xl"
            onClick={onClose}
          >
            Tutup
          </Button>
          <div className="flex flex-wrap items-center justify-end gap-3">
            {item?.reviewHref ? (
              <Button asChild variant="outline" className="h-10 rounded-xl">
                <Link href={item.reviewHref}>Buka Review</Link>
              </Button>
            ) : null}
            {item?.historyHref ? (
              <Button asChild variant="outline" className="h-10 rounded-xl">
                <Link href={item.historyHref}>Riwayat Pegawai</Link>
              </Button>
            ) : null}
            {item ? (
              <Button asChild className="h-10 rounded-xl">
                <Link href={item.href}>Buka Halaman Detail</Link>
              </Button>
            ) : null}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
