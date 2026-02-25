import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { QueryDashboardRangeDto } from './query-dashboard-range.dto';

function normalizeSortOrder(value: unknown): 'asc' | 'desc' {
  const normalized = String(value ?? 'desc')
    .trim()
    .toLowerCase();
  return normalized === 'asc' ? 'asc' : 'desc';
}

export class QueryDashboardTableDto extends QueryDashboardRangeDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 50, default: 50, maximum: 200 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  pageSize?: number = 50;

  @ApiPropertyOptional({
    example: 'created_at',
    description: 'Sort column (must be validated against allow-list before query execution).',
  })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiPropertyOptional({ example: 'desc', enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @Transform(({ value }) => normalizeSortOrder(value))
  @IsIn(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc' = 'desc';
}
