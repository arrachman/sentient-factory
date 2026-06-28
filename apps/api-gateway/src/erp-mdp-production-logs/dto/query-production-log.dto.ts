import { ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMesPostingStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORTABLE_FIELDS = ['startedAt', 'endedAt', 'createdAt'] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export class QueryProductionLogDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;

  @ApiPropertyOptional({ description: 'Filter by production order ID (BigInt string)' })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({ description: 'Filter by operation ID (BigInt string)' })
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiPropertyOptional({ enum: MdpMesPostingStatus })
  @IsOptional()
  @IsEnum(MdpMesPostingStatus)
  postingStatus?: MdpMesPostingStatus;

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: SortableField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
