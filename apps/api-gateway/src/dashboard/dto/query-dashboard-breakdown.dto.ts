import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { QueryDashboardRangeDto } from './query-dashboard-range.dto';

export class QueryDashboardBreakdownDto extends QueryDashboardRangeDto {
  @ApiPropertyOptional({
    example: 'status',
    description: 'Dimension/grouping field. Must be validated against allowed columns.',
  })
  @IsOptional()
  @IsString()
  groupBy?: string;
}
