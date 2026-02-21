import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PAGE_LIMIT_OPTIONS } from '@/shared/constants/pagination';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

type StandardPaginationProps = {
  page: number;
  limit: number;
  totalPages: number;
  totalItems: number;
  loading?: boolean;
  onPageChange: (nextPage: number) => void;
  onLimitChange: (nextLimit: number) => void;
  className?: string;
};

const VISIBLE_PAGE_COUNT = 3;

export function StandardPagination({
  page,
  limit,
  totalPages,
  totalItems,
  loading = false,
  onPageChange,
  onLimitChange,
  className,
}: StandardPaginationProps) {
  const safeTotalPages = Math.max(1, totalPages || 1);
  const currentPage = Math.min(Math.max(1, page || 1), safeTotalPages);

  const startPage = Math.max(1, Math.min(currentPage - 1, safeTotalPages - VISIBLE_PAGE_COUNT + 1));
  const endPage = Math.min(safeTotalPages, startPage + VISIBLE_PAGE_COUNT - 1);
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <div className={cn('mt-4 flex items-center justify-between gap-3', className)}>
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          Total {totalItems} items • Page {currentPage} of {safeTotalPages}
        </p>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Limit</span>
          <select
            className="h-8 rounded-md border bg-background px-2 text-xs"
            value={String(limit)}
            onChange={(event) => onLimitChange(Number(event.target.value))}
            disabled={loading}
            aria-label="Rows per page"
          >
            {PAGE_LIMIT_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={loading || currentPage <= 1}
        >
          <ChevronLeft />
          Prev
        </Button>

        {pages.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? 'primary' : 'outline'}
            size="sm"
            onClick={() => onPageChange(pageNumber)}
            disabled={loading}
            aria-current={pageNumber === currentPage ? 'page' : undefined}
          >
            {pageNumber}
          </Button>
        ))}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={loading || currentPage >= safeTotalPages}
        >
          Next
          <ChevronRight />
        </Button>
      </div>
    </div>
  );
}
