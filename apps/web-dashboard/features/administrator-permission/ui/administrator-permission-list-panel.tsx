import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import { type PermissionItem } from '@/features/administrator-permission/model/types';
import { pickPermissionId } from '@/features/administrator-permission/model/utils';

type AdministratorPermissionListPanelProps = {
  items: PermissionItem[];
  loading: boolean;
  search: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: PermissionItem) => void;
  onDelete: (id: string) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function AdministratorPermissionListPanel({
  items,
  loading,
  search,
  page,
  limit,
  totalPages,
  totalItems,
  onSearchChange,
  onSearchSubmit,
  onSearchReset,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
}: AdministratorPermissionListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by permission, module, action..."
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
        <Button variant="outline" onClick={onSearchSubmit} disabled={loading}>
          <RefreshCw />
          Search
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Module</TableHead>
            <TableHead>Action</TableHead>
            <TableHead>Description</TableHead>
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
              <TableCell colSpan={6}>No permission found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const permissionId = pickPermissionId(item);
              return (
                <TableRow key={permissionId || `permission-${index}`}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.module}</TableCell>
                  <TableCell>{item.action}</TableCell>
                  <TableCell className="max-w-[300px] truncate">{item.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)} aria-label="Edit permission">
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (permissionId) {
                            onDelete(permissionId);
                          }
                        }}
                        disabled={!permissionId}
                        aria-label="Delete permission"
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
