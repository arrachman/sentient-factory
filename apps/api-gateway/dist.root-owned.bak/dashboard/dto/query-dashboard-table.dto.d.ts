import { QueryDashboardRangeDto } from './query-dashboard-range.dto';
export declare class QueryDashboardTableDto extends QueryDashboardRangeDto {
    page?: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}
