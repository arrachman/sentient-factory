import { ChevronLeft, ChevronRight, Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { AuditLogItem } from '@/features/administrator-auditlog/model/types';
import { formatDate, pickAuditLogId } from '@/features/administrator-auditlog/model/utils';

type AdministratorAuditlogListPanelProps = {
  items: AuditLogItem[];
  loading: boolean;
  searchInput: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: AuditLogItem) => void;
  onDelete: (auditLogId: string) => void;
  onPageChange: (nextPage: number) => void;
  onError: (message: string) => void;
};

export function AdministratorAuditlogListPanel({
  items,
  loading,
  searchInput,
  page,
  limit,
  totalPages,
  totalItems,
  onSearchInputChange,
  onSearchSubmit,
  onSearchReset,
  onEdit,
  onDelete,
  onPageChange,
  onError,
}: AdministratorAuditlogListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by action, entity, IP, or user..."
            value={searchInput}
            onChange={(e) => onSearchInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearchSubmit();
              }
            }}
            className="pr-8"
          />
          {searchInput ? (
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
        <Button variant="outline" onClick={onSearchSubmit} disabled={loading}>
          <RefreshCw />
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Entity</TableHead>
            <TableHead>Entity ID</TableHead>
            <TableHead>User</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8}>Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8}>No audit logs found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={pickAuditLogId(item) || `audit-row-${index}`}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{item.action || '-'}</TableCell>
                <TableCell>{item.entityType || '-'}</TableCell>
                <TableCell>{item.entityId || '-'}</TableCell>
                <TableCell>{item.userName || item.userEmail || '-'}</TableCell>
                <TableCell>{item.ipAddress || '-'}</TableCell>
                <TableCell>{formatDate(item.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit audit log" onClick={() => onEdit(item)}>
                      <Pencil />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      aria-label="Delete audit log"
                      onClick={() => {
                        const auditLogId = pickAuditLogId(item);
                        if (!auditLogId) {
                          onError('Audit log ID is missing');
                          return;
                        }
                        onDelete(auditLogId);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Total {totalItems} items • Page {page} of {totalPages}
        </p>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => onPageChange(page - 1)} disabled={loading || page <= 1}>
            <ChevronLeft />
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={() => onPageChange(page + 1)} disabled={loading || page >= totalPages}>
            Next
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  );
}
