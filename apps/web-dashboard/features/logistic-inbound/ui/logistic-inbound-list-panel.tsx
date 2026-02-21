import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { InboundListItem } from '@/features/logistic-inbound/model/types';
import { fmtDate, pickInboundId } from '@/features/logistic-inbound/model/utils';

type LogisticInboundListPanelProps = {
  items: InboundListItem[];
  loading: boolean;
  search: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
  onEdit: (item: InboundListItem) => void;
  onDelete: (uuid: string) => void;
};

export function LogisticInboundListPanel({
  items,
  loading,
  search,
  page,
  limit,
  totalPages,
  totalItems,
  onSearchChange,
  onSearchSubmit,
  onPageChange,
  onLimitChange,
  onEdit,
  onDelete,
}: LogisticInboundListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 grid gap-2 md:grid-cols-[1fr_auto]">
        <div className="relative flex-1">
          <Input
            placeholder="Search transaction no, supplier, warehouse..."
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
              onClick={() => {
                onSearchChange('');
                onSearchSubmit();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>
        <Button variant="outline" onClick={onSearchSubmit} disabled={loading}>
          <RefreshCw />
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Transaction</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Supplier</TableHead>
            <TableHead>Warehouse</TableHead>
            <TableHead className="text-right">Item Row</TableHead>
            <TableHead className="w-[170px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>Loading inbounds...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>No inbound found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const rowId = pickInboundId(item);
              return (
                <TableRow key={rowId || `inbound-${index}`}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.transactionNo}</div>
                    <div className="text-xs text-muted-foreground">Report #{item.reportNo}</div>
                  </TableCell>
                  <TableCell>{fmtDate(item.transactionDate)}</TableCell>
                  <TableCell>
                    <div className="font-medium">{item.supplier?.name || '-'}</div>
                    <div className="text-xs text-muted-foreground">{item.supplier?.code || '-'}</div>
                  </TableCell>
                  <TableCell>{item.warehouse?.name || '-'}</TableCell>
                  <TableCell className="text-right">{item._count?.details ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        aria-label="Edit inbound"
                        onClick={() => onEdit(item)}
                        disabled={!rowId}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete inbound"
                        onClick={() => {
                          if (rowId) {
                            onDelete(rowId);
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
      <StandardPagination page={page} limit={limit} totalPages={totalPages} totalItems={totalItems} loading={loading} onPageChange={onPageChange} onLimitChange={onLimitChange} />
    </div>
  );
}
