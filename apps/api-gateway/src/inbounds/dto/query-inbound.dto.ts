import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const INBOUND_STATUSES = ['DRAFT', 'POSTED', 'CANCELLED'] as const;

export class QueryInboundDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'INB-2026' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: INBOUND_STATUSES })
  @IsOptional()
  @IsString()
  @IsIn(INBOUND_STATUSES)
  status?: (typeof INBOUND_STATUSES)[number];

  @ApiPropertyOptional({ example: 'cm123supplier456def' })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ example: 'cm123warehouse456def' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: '2026-02-01' })
  @IsOptional()
  @IsDateString()
  transactionDateFrom?: string;

  @ApiPropertyOptional({ example: '2026-02-29' })
  @IsOptional()
  @IsDateString()
  transactionDateTo?: string;
}
