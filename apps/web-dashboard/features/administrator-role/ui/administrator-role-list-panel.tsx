import { MenuSquare, Pencil, RefreshCw, ShieldCheck, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { RoleItem } from '@/features/administrator-role/model/types';
import { pickEntityId } from '@/features/administrator-role/model/utils';

type AdministratorRoleListPanelProps = {
  items: RoleItem[];
  loading: boolean;
  searchInput: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: RoleItem) => void;
  onDelete: (id: string) => void;
  onOpenPermissions: (item: RoleItem) => void;
  onOpenMenus: (item: RoleItem) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function AdministratorRoleListPanel({
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
  onOpenPermissions,
  onOpenMenus,
  onPageChange,
  onLimitChange,
}: AdministratorRoleListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search role name/description..."
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
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>System</TableHead>
            <TableHead className="text-right">Menus</TableHead>
            <TableHead className="text-right">Permissions</TableHead>
            <TableHead className="w-[280px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>No role found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const roleId = pickEntityId(item);
              return (
                <TableRow key={roleId || `role-${index}`}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="max-w-[280px] truncate">{item.description || '-'}</TableCell>
                  <TableCell>{item.isSystem ? 'Yes' : 'No'}</TableCell>
                  <TableCell className="text-right">{item.menuCount ?? 0}</TableCell>
                  <TableCell className="text-right">{item.permissionCount ?? 0}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => onOpenPermissions(item)}>
                        <ShieldCheck className="size-4" />
                        Permissions
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => onOpenMenus(item)}>
                        <MenuSquare className="size-4" />
                        Menus
                      </Button>
                      <Button variant="outline" size="icon" onClick={() => onEdit(item)} aria-label="Edit role">
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          if (roleId) {
                            onDelete(roleId);
                          }
                        }}
                        disabled={!roleId || item.isSystem}
                        aria-label="Delete role"
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
