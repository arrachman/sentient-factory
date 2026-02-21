import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { MasterDataCity } from '@/features/master-city/model/types';

type MasterCityListPanelProps = {
  items: MasterDataCity[];
  loading: boolean;
  searchInput: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: MasterDataCity) => void;
  onDelete: (uuid: string) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function MasterCityListPanel({
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
}: MasterCityListPanelProps) {
  return (
    <div className="rounded-lg border p-5">
      <div className="mb-3 flex items-center gap-2">
        <div className="relative flex-1">
          <Input
            placeholder="Search by city, postal code, province..."
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
            <TableHead>Province</TableHead>
            <TableHead>City Name</TableHead>
            <TableHead>Postal Code</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow key="city-loading">
              <TableCell colSpan={5}>Loading...</TableCell>
            </TableRow>
          ) : items.length === 0 ? (
            <TableRow key="city-empty">
              <TableCell colSpan={5}>No city data found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={`${item.uuid || item.provinceId || 'city'}-${item.name || 'name'}-${index}`}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{item.province ? `${item.province.name} (${item.province.isoCode})` : '-'}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.postalCode}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit city" onClick={() => onEdit(item)}>
                      <Pencil />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label="Delete city" onClick={() => onDelete(item.uuid)}>
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
