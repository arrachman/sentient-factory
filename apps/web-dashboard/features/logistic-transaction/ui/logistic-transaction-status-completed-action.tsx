import * as React from 'react';
import { CircleCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { type CompletedActionState, type DeliveryOrderListItem } from '@/features/logistic-transaction/model/types';
import { buildCompletedActionState } from '@/features/logistic-transaction/model/status-actions';
import { fmtDate, normalizeNumber, resolveDeliveryKpiStatus } from '@/features/logistic-transaction/model/utils';

type LogisticTransactionStatusCompletedActionProps = {
  item: DeliveryOrderListItem;
  rowId: string;
  completedAction: CompletedActionState | null;
  setCompletedAction: React.Dispatch<React.SetStateAction<CompletedActionState | null>>;
  completedSubmittingId: string | null;
  deliverySubmittingId: string | null;
  deliveredSubmittingId: string | null;
  onSetToCompleted: () => void;
};

export function LogisticTransactionStatusCompletedAction({
  item,
  rowId,
  completedAction,
  setCompletedAction,
  completedSubmittingId,
  deliverySubmittingId,
  deliveredSubmittingId,
  onSetToCompleted,
}: LogisticTransactionStatusCompletedActionProps) {
  return (
    <Popover
      open={completedAction?.id === rowId}
      onOpenChange={(open) => {
        if (open) {
          setCompletedAction(buildCompletedActionState(rowId, item));
          return;
        }
        if (completedAction?.id === rowId && !completedSubmittingId) {
          setCompletedAction(null);
        }
      }}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:text-emerald-800"
          disabled={Boolean((completedSubmittingId && completedSubmittingId !== rowId) || deliverySubmittingId || deliveredSubmittingId)}
        >
          <CircleCheck className="size-4" />
          Set Completed
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 space-y-3 text-left" align="start">
        <div className="space-y-1">
          <p className="text-sm font-semibold">Ubah Status ke COMPLETED</p>
          <p className="text-xs text-muted-foreground">{item.doNumber}</p>
        </div>
        <div className="space-y-1">
          <Label htmlFor={`do-return-date-completed-${rowId}`}>Tanggal DO Kembali</Label>
          <Input
            id={`do-return-date-completed-${rowId}`}
            type="date"
            value={completedAction?.doScanReturnDate ?? ''}
            onChange={(event) =>
              setCompletedAction((state) =>
                state && state.id === rowId ? { ...state, doScanReturnDate: event.target.value } : state,
              )
            }
            required
          />
        </div>
        <div className="space-y-1">
          <p className="text-xs text-muted-foreground">STD DO Kembali (Hasil Target)</p>
          <p className="text-xs text-muted-foreground">Tanggal Kirim DO: {fmtDate(completedAction?.shippingDate)}</p>
          <p className="text-xs text-muted-foreground">Standar Pengembalian DO: {normalizeNumber(completedAction?.stdReturnDoDays)} hari</p>
          <p className="text-xs text-muted-foreground">
            Perhitungan: {fmtDate(completedAction?.shippingDate)} + {normalizeNumber(completedAction?.stdReturnDoDays)} hari
          </p>
          <p className="text-sm font-semibold">STD DO Kembali: {fmtDate(completedAction?.stdDoReturnDate)}</p>
          <p className="text-xs text-muted-foreground">Ketepatan pengembalian DO</p>
          <p className="text-xs text-muted-foreground">Scan DO kembali ≤ STD DO kembali: ONTIME.</p>
          <p className="text-xs text-muted-foreground">Scan DO kembali {'>'} STD DO kembali: LATE.</p>
          {(() => {
            const kpiStatus = resolveDeliveryKpiStatus(completedAction?.doScanReturnDate, completedAction?.stdDoReturnDate);
            return (
              <Badge variant={kpiStatus === 'ONTIME' ? 'primary' : kpiStatus === 'LATE' ? 'destructive' : 'secondary'}>
                {kpiStatus}
              </Badge>
            );
          })()}
        </div>
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setCompletedAction(null)}
            disabled={completedSubmittingId === rowId}
          >
            Batal
          </Button>
          <Button
            type="button"
            size="sm"
            onClick={onSetToCompleted}
            disabled={completedSubmittingId === rowId || !completedAction?.doScanReturnDate}
          >
            {completedSubmittingId === rowId ? 'Saving...' : 'Simpan'}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
