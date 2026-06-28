import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMaterialConsumptionDto {
  @ApiProperty({
    example: '7',
    description: 'Production order ID (mes_production_orders, BigInt string)',
  })
  @IsString()
  productionOrderId!: string;

  @ApiPropertyOptional({ example: '3', description: 'Operation ID (mes_operations)' })
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiProperty({ example: '12', description: 'Component item ID (ERP md_items, BigInt string)' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0)
  qty!: number;

  @ApiPropertyOptional({ example: 'KG' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  uomCode?: string;

  @ApiPropertyOptional({ example: '88', description: 'Source bin ID (ERP md_storage_bins)' })
  @IsOptional()
  @IsString()
  sourceBinId?: string;

  @ApiProperty({ example: '2026-06-28T01:00:00.000Z' })
  @IsISO8601()
  consumedAt!: string;
}
