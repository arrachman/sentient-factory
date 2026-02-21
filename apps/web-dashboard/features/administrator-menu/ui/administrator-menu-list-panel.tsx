import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutocompleteSelect } from '@/components/ui/autocomplete-select';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { AdministratorMenu } from '@/features/administrator-menu/model/types';

type AdministratorMenuListPanelProps = {
  items: AdministratorMenu[];
  loading: boolean;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  search: string;
  onSearchChange: (value: string) => void;
  parentFilter: string;
  onParentFilterChange: (value: string) => void;
  parentFilterOptions: Array<{ value: string; label: string }>;
  onApplyFilter: () => void;
  onEdit: (item: AdministratorMenu) => void;
  onDelete: (id: number) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function AdministratorMenuListPanel({
  items,
  loading,
  page,
  limit,
  totalPages,
  totalItems,
  search,
  onSearchChange,
  parentFilter,
  onParentFilterChange,
  parentFilterOptions,
  onApplyFilter,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
}: AdministratorMenuListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-[1fr_260px_auto]">
        <div className="relative flex-1">
          <Input
            placeholder="Search by key, title, path, icon..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onApplyFilter();
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
                onApplyFilter();
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          ) : null}
        </div>

        <AutocompleteSelect
          value={parentFilter}
          onValueChange={(value) => onParentFilterChange(value || 'all')}
          options={parentFilterOptions}
          placeholder="Filter parent"
          searchPlaceholder="Search parent..."
          emptyText="No parent found."
          triggerClassName="h-9 text-sm"
        />

        <Button variant="outline" onClick={onApplyFilter} disabled={loading}>
          <RefreshCw />
          Apply
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Key</TableHead>
            <TableHead>Path</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7}>Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7}>No menu data found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id || `${item.key || 'menu'}-${item.title || 'title'}-${index}`}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.key}</TableCell>
                <TableCell>{item.path || '-'}</TableCell>
                <TableCell>{item.parentTitle || '-'}</TableCell>
                <TableCell>{item.isActive ? 'Active' : 'Inactive'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      aria-label="Edit menu"
                      onClick={() => onEdit(item)}
                    >
                      <Pencil />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label="Delete menu" onClick={() => onDelete(item.id)}>
                      <Trash2 />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <StandardPagination page={page} limit={limit} totalPages={totalPages} totalItems={totalItems} loading={loading} onPageChange={onPageChange} onLimitChange={onLimitChange} />
    </div>
  );
}
