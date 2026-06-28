import { ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMesOrderStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORTABLE_FIELDS = ['code', 'status', 'plannedStartAt', 'createdAt'] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export class QueryProductionOrderDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: MdpMesOrderStatus })
  @IsOptional()
  @IsEnum(MdpMesOrderStatus)
  status?: MdpMesOrderStatus;

  @ApiPropertyOptional({ description: 'Filter by work center ID (BigInt string)' })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: SortableField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
