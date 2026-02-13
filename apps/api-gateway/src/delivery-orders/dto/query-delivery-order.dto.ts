import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDateString, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const DELIVERY_ORDER_STATUSES = ['DRAFT', 'SHIPPED', 'RECEIVED', 'CLOSED', 'CANCELLED'] as const;

export class QueryDeliveryOrderDto {
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

  @ApiPropertyOptional({ example: 'DO-2026' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: DELIVERY_ORDER_STATUSES })
  @IsOptional()
  @IsString()
  @IsIn(DELIVERY_ORDER_STATUSES)
  status?: (typeof DELIVERY_ORDER_STATUSES)[number];

  @ApiPropertyOptional({ example: 'cm123abc456def' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ example: '2026-02-01' })
  @IsOptional()
  @IsDateString()
  doDateFrom?: string;

  @ApiPropertyOptional({ example: '2026-02-29' })
  @IsOptional()
  @IsDateString()
  doDateTo?: string;
}
