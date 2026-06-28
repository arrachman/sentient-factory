import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORTABLE_FIELDS = ['createdAt', 'code'] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export class QueryQmsPlanDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'search code/name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: SortableField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
