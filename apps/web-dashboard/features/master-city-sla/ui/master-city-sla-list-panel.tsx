import { Pencil, RefreshCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { StandardPagination } from '@/components/ui/standard-pagination';
import type { MasterDataCitySla } from '@/features/master-city-sla/model/types';

type MasterCitySlaListPanelProps = {
  items: MasterDataCitySla[];
  loading: boolean;
  searchInput: string;
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  onSearchInputChange: (value: string) => void;
  onSearchSubmit: () => void;
  onSearchReset: () => void;
  onEdit: (item: MasterDataCitySla) => void;
  onDelete: (uuid: string) => void;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
};

export function MasterCitySlaListPanel({
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
}: MasterCitySlaListPanelProps) {
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
            <TableHead className="text-right">Std Lead Time</TableHead>
            <TableHead className="text-right">Std Return DO</TableHead>
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
              <TableCell colSpan={7}>No city SLA data found.</TableCell>
            </TableRow>
          ) : (
            items.map((item, index) => (
              <TableRow key={`${item.uuid || item.cityId || 'city-sla'}-${index}`}>
                <TableCell>{(page - 1) * limit + index + 1}</TableCell>
                <TableCell>{item.city?.province ? `${item.city.province.name} (${item.city.province.isoCode})` : '-'}</TableCell>
                <TableCell>{item.city?.name || '-'}</TableCell>
                <TableCell>{item.city?.postalCode || '-'}</TableCell>
                <TableCell className="text-right">{item.stdLeadTimeDays}</TableCell>
                <TableCell className="text-right">{item.stdReturnDoDays}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon" aria-label="Edit city SLA" onClick={() => onEdit(item)}>
                      <Pencil />
                    </Button>
                    <Button variant="destructive" size="icon" aria-label="Delete city SLA" onClick={() => onDelete(item.uuid)}>
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
