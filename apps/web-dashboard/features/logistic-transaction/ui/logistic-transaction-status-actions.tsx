import * as React from 'react';
import { Check, CircleCheck, Truck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import {
  type CompletedActionState,
  type DeliveredActionState,
  type DeliveryActionState,
  type DeliveryOrderListItem,
} from '@/features/logistic-transaction/model/types';
import {
  addDays,
  calculateStandardReceivedDate,
  fmtDate,
  normalizeNumber,
  resolveDeliveryKpiStatus,
} from '@/features/logistic-transaction/model/utils';

type LogisticTransactionStatusActionsProps = {
  item: DeliveryOrderListItem;
  rowId: string;
  deliveryAction: DeliveryActionState | null;
  deliveredAction: DeliveredActionState | null;
  completedAction: CompletedActionState | null;
  setDeliveryAction: React.Dispatch<React.SetStateAction<DeliveryActionState | null>>;
  setDeliveredAction: React.Dispatch<React.SetStateAction<DeliveredActionState | null>>;
  setCompletedAction: React.Dispatch<React.SetStateAction<CompletedActionState | null>>;
  buildDeliveryActionState: (rowId: string, item: DeliveryOrderListItem) => DeliveryActionState;
  buildDeliveredActionState: (rowId: string, item: DeliveryOrderListItem) => DeliveredActionState;
  buildCompletedActionState: (rowId: string, item: DeliveryOrderListItem) => CompletedActionState;
  deliverySubmittingId: string | null;
  deliveredSubmittingId: string | null;
  completedSubmittingId: string | null;
  onSetToDelivery: () => void;
  onSetToDelivered: () => void;
  onSetToCompleted: () => void;
};

export function LogisticTransactionStatusActions({
  item,
  rowId,
  deliveryAction,
  deliveredAction,
  completedAction,
  setDeliveryAction,
  setDeliveredAction,
  setCompletedAction,
  buildDeliveryActionState,
  buildDeliveredActionState,
  buildCompletedActionState,
  deliverySubmittingId,
  deliveredSubmittingId,
  completedSubmittingId,
  onSetToDelivery,
  onSetToDelivered,
  onSetToCompleted,
}: LogisticTransactionStatusActionsProps) {
  return (
    <>
      {item.status === 'OPEN' ? (
        <Popover
          open={deliveryAction?.id === rowId}
          onOpenChange={(open) => {
            if (open) {
              setDeliveryAction(buildDeliveryActionState(rowId, item));
              return;
            }
            if (deliveryAction?.id === rowId && !deliverySubmittingId) {
              setDeliveryAction(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800"
              disabled={Boolean(
                (deliverySubmittingId && deliverySubmittingId !== rowId) || deliveredSubmittingId || completedSubmittingId,
              )}
            >
              <Truck className="size-4" />
              Set Delivery
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 space-y-3 text-left" align="start">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Ubah Status ke DELIVERY</p>
              <p className="text-xs text-muted-foreground">{item.doNumber}</p>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`shipping-date-${rowId}`}>Tanggal Kirim</Label>
              <Input
                id={`shipping-date-${rowId}`}
                type="date"
                value={deliveryAction?.shippingDate ?? ''}
                onChange={(event) =>
                  setDeliveryAction((state) =>
                    state && state.id === rowId ? { ...state, shippingDate: event.target.value } : state,
                  )
                }
                required
              />
            </div>
            <div className="rounded-md border p-2 text-sm">
              <p className="text-xs text-muted-foreground">Standard Barang Diterima</p>
              <p className="font-semibold">{addDays(deliveryAction?.shippingDate, String(deliveryAction?.stdLeadTimeDays ?? 0))}</p>
              <p className="text-xs text-muted-foreground">
                {deliveryAction?.shippingDate
                  ? `${fmtDate(deliveryAction.shippingDate)} + ${deliveryAction.stdLeadTimeDays} hari`
                  : '-'}
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeliveryAction(null)}
                disabled={deliverySubmittingId === rowId}
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSetToDelivery}
                disabled={deliverySubmittingId === rowId || !deliveryAction?.shippingDate}
              >
                {deliverySubmittingId === rowId ? 'Saving...' : 'Simpan'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : null}

      {item.status === 'DELIVERY' ? (
        <Popover
          open={deliveredAction?.id === rowId}
          onOpenChange={(open) => {
            if (open) {
              setDeliveredAction(buildDeliveredActionState(rowId, item));
              return;
            }
            if (deliveredAction?.id === rowId && !deliveredSubmittingId) {
              setDeliveredAction(null);
            }
          }}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:text-blue-800"
              disabled={Boolean(
                (deliveredSubmittingId && deliveredSubmittingId !== rowId) || deliverySubmittingId || completedSubmittingId,
              )}
            >
              <Check className="size-4" />
              Set Delivered
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-100 space-y-3 text-left" align="start">
            <div className="space-y-1">
              <p className="text-sm font-semibold">Ubah Status ke DELIVERED</p>
              <p className="text-xs text-muted-foreground">{item.doNumber}</p>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-1">
                <Label htmlFor={`actual-received-date-${rowId}`}>Aktual Barang Diterima</Label>
                <Input
                  id={`actual-received-date-${rowId}`}
                  type="date"
                  value={deliveredAction?.actualReceivedDate ?? ''}
                  onChange={(event) =>
                    setDeliveredAction((state) =>
                      state && state.id === rowId
                        ? {
                            ...state,
                            actualReceivedDate: event.target.value,
                            doScanReturnDate: event.target.value,
                          }
                        : state,
                    )
                  }
                  required
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor={`do-scan-return-date-${rowId}`}>Tanggal Scan DO Kembali</Label>
                <Input
                  id={`do-scan-return-date-${rowId}`}
                  type="date"
                  value={deliveredAction?.doScanReturnDate ?? ''}
                  onChange={(event) =>
                    setDeliveredAction((state) =>
                      state && state.id === rowId ? { ...state, doScanReturnDate: event.target.value } : state,
                    )
                  }
                  required
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label htmlFor={`received-by-${rowId}`}>Diterima Oleh</Label>
              <Input
                id={`received-by-${rowId}`}
                value={deliveredAction?.receivedBy ?? ''}
                onChange={(event) =>
                  setDeliveredAction((state) =>
                    state && state.id === rowId ? { ...state, receivedBy: event.target.value } : state,
                  )
                }
                placeholder="Nama penerima"
                required
              />
            </div>
            <div className="rounded-md border p-2 text-sm">
              <p className="text-xs text-muted-foreground">KPI Ketepatan Pengiriman</p>
              {(() => {
                const standardReceivedDate = calculateStandardReceivedDate(
                  deliveredAction?.shippingDate,
                  deliveredAction?.stdLeadTimeDays,
                );
                const kpiStatus = resolveDeliveryKpiStatus(deliveredAction?.actualReceivedDate, standardReceivedDate);
                return (
                  <div className="space-y-1">
                    <p className="font-medium">
                      Standard Barang Diterima: {standardReceivedDate ? fmtDate(standardReceivedDate) : '-'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Jika aktual barang diterima ≤ standard barang diterima, status ONTIME. Jika melewati standard,
                      status LATE.
                    </p>
                    <Badge
                      variant={
                        kpiStatus === 'ONTIME' ? 'primary' : kpiStatus === 'LATE' ? 'destructive' : 'secondary'
                      }
                    >
                      {kpiStatus}
                    </Badge>
                  </div>
                );
              })()}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setDeliveredAction(null)}
                disabled={deliveredSubmittingId === rowId}
              >
                Batal
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSetToDelivered}
                disabled={
                  deliveredSubmittingId === rowId ||
                  !deliveredAction?.actualReceivedDate ||
                  !deliveredAction?.receivedBy.trim() ||
                  !deliveredAction?.doScanReturnDate
                }
              >
                {deliveredSubmittingId === rowId ? 'Saving...' : 'Simpan'}
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      ) : null}

      {item.status === 'DELIVERED' ? (
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
              disabled={Boolean(
                (completedSubmittingId && completedSubmittingId !== rowId) || deliverySubmittingId || deliveredSubmittingId,
              )}
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
              <p className="text-xs text-muted-foreground">
                Standar Pengembalian DO: {normalizeNumber(completedAction?.stdReturnDoDays)} hari
              </p>
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
                  <Badge
                    variant={kpiStatus === 'ONTIME' ? 'primary' : kpiStatus === 'LATE' ? 'destructive' : 'secondary'}
                  >
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
      ) : null}
    </>
  );
}
