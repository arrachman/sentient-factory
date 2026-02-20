import { ChevronLeft, ChevronRight, Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  type CompletedActionState,
  type DeliveredActionState,
  type DeliveryActionState,
  type DeliveryOrderListItem,
  STATUS_OPTIONS,
} from '@/features/logistic-transaction/model/types';
import {
  fmtDate,
  normalizeNumber,
  outboundStatusBadgeVariant,
  toEntityId,
} from '@/features/logistic-transaction/model/utils';
import { LogisticTransactionStatusActions } from '@/features/logistic-transaction/ui/logistic-transaction-status-actions';

type LogisticTransactionListPanelProps = {
  items: DeliveryOrderListItem[];
  loading: boolean;
  search: string;
  statusFilter: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  deliveryAction: DeliveryActionState | null;
  deliveredAction: DeliveredActionState | null;
  completedAction: CompletedActionState | null;
  deliverySubmittingId: string | null;
  deliveredSubmittingId: string | null;
  completedSubmittingId: string | null;
  setDeliveryAction: React.Dispatch<React.SetStateAction<DeliveryActionState | null>>;
  setDeliveredAction: React.Dispatch<React.SetStateAction<DeliveredActionState | null>>;
  setCompletedAction: React.Dispatch<React.SetStateAction<CompletedActionState | null>>;
  onSetToDelivery: () => void;
  onSetToDelivered: () => void;
  onSetToCompleted: () => void;
  onSearchChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onPageChange: (nextPage: number) => void;
  onEditRow: (rowId: string, item: DeliveryOrderListItem) => void;
  onDeleteRow: (rowId: string) => void;
};

export function LogisticTransactionListPanel({
  items,
  loading,
  search,
  statusFilter,
  page,
  limit,
  totalPages,
  totalItems,
  deliveryAction,
  deliveredAction,
  completedAction,
  deliverySubmittingId,
  deliveredSubmittingId,
  completedSubmittingId,
  setDeliveryAction,
  setDeliveredAction,
  setCompletedAction,
  onSetToDelivery,
  onSetToDelivered,
  onSetToCompleted,
  onSearchChange,
  onStatusFilterChange,
  onSearchSubmit,
  onSearchReset,
  onPageChange,
  onEditRow,
  onDeleteRow,
}: LogisticTransactionListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 grid gap-2 md:grid-cols-[1fr_220px_auto]">
        <div className="relative flex-1">
          <Input
            placeholder="Search DO Number, Customer, BU..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit();
              }
            }}
            className="pr-8"
          />
          {search ? (
            <button
              type="button"
              aria-label="Reset search"
              onClick={onSearchReset}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <AutocompleteSelect
          value={statusFilter}
          onValueChange={onStatusFilterChange}
          options={[
            { value: '', label: 'All Status' },
            ...STATUS_OPTIONS.map((status) => ({ value: status, label: status })),
          ]}
          placeholder="All Status"
          searchPlaceholder="Search status..."
          emptyText="No status found."
        />
        <Button variant="outline" onClick={onSearchSubmit} disabled={loading}>
          <RefreshCw />
          Search
        </Button>
      </div>

      <Table className="w-full table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40px] whitespace-nowrap">No</TableHead>
            <TableHead className="w-[110px]">DO Number</TableHead>
            <TableHead className="w-[110px] whitespace-nowrap">DO Date</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="w-[90px] text-center whitespace-nowrap">Status</TableHead>
            <TableHead className="w-[90px] text-center whitespace-nowrap">Tot Item</TableHead>
            <TableHead className="w-[90px] text-center whitespace-nowrap">Tot Batch</TableHead>
            <TableHead className="w-[90px] text-center whitespace-nowrap">Tot KG</TableHead>
            <TableHead className="w-[250px] text-center whitespace-nowrap">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={10}>Loading delivery orders...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={10}>No delivery orders found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const rowId = toEntityId(item.id ?? item.uuid);
              return (
                <TableRow key={rowId || `outbound-${index}`}>
                  <TableCell className="whitespace-nowrap">{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.doNumber}</div>
                    <div className="text-xs text-muted-foreground">Report #{item.reportNo}</div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{fmtDate(item.doDate)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.customer?.name || '-'}</div>
                    <div className="text-xs text-muted-foreground">{item.customer?.code || '-'}</div>
                  </TableCell>
                  <TableCell>{item.warehouse?.name || '-'}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    <Badge variant={outboundStatusBadgeVariant(item.status)}>{item.status}</Badge>
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {normalizeNumber(item.totalItemTypes).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {normalizeNumber(item.totalBatches).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right whitespace-nowrap">
                    {normalizeNumber(item.totalKg).toLocaleString('id-ID')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-wrap justify-end gap-2">
                      {rowId ? (
                        <LogisticTransactionStatusActions
                          item={item}
                          rowId={rowId}
                          deliveryAction={deliveryAction}
                          deliveredAction={deliveredAction}
                          completedAction={completedAction}
                          setDeliveryAction={setDeliveryAction}
                          setDeliveredAction={setDeliveredAction}
                          setCompletedAction={setCompletedAction}
                          deliverySubmittingId={deliverySubmittingId}
                          deliveredSubmittingId={deliveredSubmittingId}
                          completedSubmittingId={completedSubmittingId}
                          onSetToDelivery={onSetToDelivery}
                          onSetToDelivered={onSetToDelivered}
                          onSetToCompleted={onSetToCompleted}
                        />
                      ) : null}

                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Edit transaction"
                        onClick={() => {
                          if (rowId) {
                            onEditRow(rowId, item);
                          }
                        }}
                        disabled={!rowId}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete transaction"
                        onClick={() => {
                          if (rowId) {
                            onDeleteRow(rowId);
                          }
                        }}
                        disabled={!rowId}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing page {page} of {totalPages} ({totalItems} rows)
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={page <= 1 || loading}>
            <ChevronLeft />
            Prev
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={page >= totalPages || loading}>
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
