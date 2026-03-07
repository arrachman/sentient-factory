import { Pencil, RefreshCw, Save, Trash2, X } from 'lucide-react';
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
  pathDrafts: Record<number, string>;
  sortDrafts: Record<number, string>;
  dirtySortCount: number;
  batchSorting: boolean;
  onPathDraftChange: (id: number, value: string) => void;
  onSortDraftChange: (id: number, value: string) => void;
  onResetBatchSort: () => void;
  onSubmitBatchSort: () => void;
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
  pathDrafts,
  sortDrafts,
  dirtySortCount,
  batchSorting,
  onPathDraftChange,
  onSortDraftChange,
  onResetBatchSort,
  onSubmitBatchSort,
  onEdit,
  onDelete,
  onPageChange,
  onLimitChange,
}: AdministratorMenuListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 grid grid-cols-1 gap-2 md:grid-cols-[1fr_260px]">
        <div className="relative flex-1">
          <Input
            placeholder="Search by key, title, path, icon..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pr-8"
          />
          {search ? (
            <button
              type="button"
              aria-label="Reset search"
              onClick={() => onSearchChange('')}
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
          placeholder="Filter group"
          searchPlaceholder="Search group..."
          emptyText="No group found."
          triggerClassName="h-9 text-sm"
        />
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 rounded-md border border-dashed p-3">
        <p className="text-sm text-muted-foreground">
          Bulk edit current page. Changed rows: <span className="font-medium text-foreground">{dirtySortCount}</span>
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResetBatchSort} disabled={batchSorting || dirtySortCount === 0}>
            <RefreshCw />
            Reset
          </Button>
          <Button onClick={onSubmitBatchSort} disabled={batchSorting || dirtySortCount === 0}>
            <Save />
            {batchSorting ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[60px]">No</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Key</TableHead>
            <TableHead className="w-[120px]">Sort</TableHead>
            <TableHead className="min-w-[240px]">Path</TableHead>
            <TableHead>Parent</TableHead>
            <TableHead>Status</TableHead>
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
              <TableCell colSpan={8}>No menu data found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={item.id || `${item.key || 'menu'}-${item.title || 'title'}-${index}`}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.key}</TableCell>
                <TableCell>
                  <Input
                    type="number"
                    min={0}
                    value={sortDrafts[item.id] ?? String(item.sortOrder ?? 0)}
                    onChange={(e) => onSortDraftChange(item.id, e.target.value)}
                    className="h-8"
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={pathDrafts[item.id] ?? item.path ?? ''}
                    onChange={(e) => onPathDraftChange(item.id, e.target.value)}
                    placeholder="/app/..."
                    className="h-8 min-w-[220px]"
                  />
                </TableCell>
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
