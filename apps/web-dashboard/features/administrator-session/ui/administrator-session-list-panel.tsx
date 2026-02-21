import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { AdministratorSession } from '@/features/administrator-session/model/types';
import { formatDate, pickSessionId } from '@/features/administrator-session/model/utils';

type AdministratorSessionListPanelProps = {
  items: AdministratorSession[];
  loading: boolean;
  searchInput: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: AdministratorSession) => void;
  onDelete: (sessionId: string) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
  onError: (message: string) => void;
};

export function AdministratorSessionListPanel({
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
  onLimitChange,
  onError,
}: AdministratorSessionListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by user, token, IP, or user agent..."
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
            <TableHead>User</TableHead>
            <TableHead>Token</TableHead>
            <TableHead>IP Address</TableHead>
            <TableHead>Expires At</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6}>Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6}>No sessions found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const tokenPreview = item.token?.length > 24 ? `${item.token.slice(0, 24)}...` : item.token;
              const userLabel = item.user?.fullName || item.user?.username || item.user?.email || `User #${item.userId}`;

              return (
                <TableRow key={pickSessionId(item) || `session-row-${index}`}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{userLabel}</TableCell>
                  <TableCell className="font-mono text-xs">{tokenPreview || '-'}</TableCell>
                  <TableCell>{item.ipAddress || '-'}</TableCell>
                  <TableCell>{formatDate(item.expiresAt)}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" aria-label="Edit session" onClick={() => onEdit(item)}>
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete session"
                        onClick={() => {
                          const sessionId = pickSessionId(item);
                          if (!sessionId) {
                            onError('Session ID is missing');
                            return;
                          }
                          onDelete(sessionId);
                        }}
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
