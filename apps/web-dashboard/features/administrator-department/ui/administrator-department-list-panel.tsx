import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import { type DepartmentItem } from '@/features/administrator-department/model/types';
import { pickDepartmentId } from '@/features/administrator-department/model/utils';
import { buildEntityRef } from '@/lib/entity-ref';

type AdministratorDepartmentListPanelProps = {
  items: DepartmentItem[];
  loading: boolean;
  search: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (ref: string) => void;
  onDelete: (id: string) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function AdministratorDepartmentListPanel({
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
}: AdministratorDepartmentListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by code, name, or description..."
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
            <TableHead>Code</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Parent</TableHead>
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
              <TableCell colSpan={6}>No departments found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => {
              const id = pickDepartmentId(item);
              const ref = buildEntityRef(id, item.createdAt);

              return (
                <TableRow key={id || `department-${index}`}>
                  <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                  <TableCell>{item.code}</TableCell>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.parent ? `${item.parent.code} - ${item.parent.name}` : '-'}</TableCell>
                  <TableCell>{item.description || '-'}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="icon" aria-label="Edit department" onClick={() => onEdit(ref)}>
                        <Pencil />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Delete department"
                        onClick={() => {
                          if (id) {
                            onDelete(id);
                          }
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
