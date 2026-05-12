'use client';

/**
 * Dialog drilldown detail outstanding kontak untuk m2_cr/m2_sm dashboards.
 * Menampilkan transaksi outstanding terbesar untuk kontak yang dipilih.
 */
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { fmtMoney } from './m2-utils';

export function M2KontakDrilldownDialog({
  open,
  onOpenChange,
  activeKontakId,
  loadingKontak,
  contactDrilldown,
  titlePrefix = 'Detail Follow-up Outstanding Kontak',
  description = 'Transaksi outstanding terbesar pada periode terpilih.',
  amountField = 'outstanding',
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeKontakId: string;
  loadingKontak: string | null;
  contactDrilldown: Array<Record<string, unknown>>;
  titlePrefix?: string;
  description?: string;
  amountField?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {titlePrefix} {activeKontakId || '-'}
          </DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogBody>
          {loadingKontak ? (
            <p className="text-sm text-muted-foreground">
              Memuat detail kontak...
            </p>
          ) : contactDrilldown.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Tidak ada detail kontak untuk periode ini.
            </p>
          ) : (
            <div className="space-y-2 text-sm">
              {contactDrilldown.slice(0, 20).map((drill, index) => (
                <div
                  key={`modal-drill-${index}`}
                  className="flex items-center justify-between gap-2 rounded border p-2"
                >
                  <span className="truncate">
                    {String(drill.trx_date ?? '-')} •{' '}
                    {String(drill.no_transaksi ?? '-')} •{' '}
                    {String(drill.cabang ?? '-')}
                  </span>
                  <span className="font-medium tabular-nums">
                    {fmtMoney(drill[amountField], 2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
