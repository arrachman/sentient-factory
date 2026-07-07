import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateProductionLogDto {
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

  @ApiPropertyOptional({ example: '2', description: 'Shift ID (mdp_shifts)' })
  @IsOptional()
  @IsString()
  shiftId?: string;

  @ApiPropertyOptional({ example: '15', description: 'Operator user ID (ERP adm_users)' })
  @IsOptional()
  @IsString()
  operatorId?: string;

  @ApiPropertyOptional({ example: 100, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  goodQty?: number;

  @ApiPropertyOptional({ example: 5, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  scrapQty?: number;

  @ApiPropertyOptional({ example: 2, default: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  reworkQty?: number;

  @ApiPropertyOptional({
    example: '9',
    description: 'Scrap reason ID (mdp_reason_codes, category=SCRAP)',
  })
  @IsOptional()
  @IsString()
  scrapReasonId?: string;

  @ApiProperty({ example: '2026-06-28T01:00:00.000Z' })
  @IsISO8601()
  startedAt!: string;

  @ApiPropertyOptional({ example: '2026-06-28T02:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  endedAt?: string;

  @ApiPropertyOptional({ example: 'Setengah batch pertama' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
