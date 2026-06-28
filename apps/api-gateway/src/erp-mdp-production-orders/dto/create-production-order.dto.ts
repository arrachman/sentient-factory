import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMesOrderStatus } from '@prisma/client';
import {
  IsEnum,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateProductionOrderDto {
  @ApiProperty({ example: 'MO-2606-0001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: '12', description: 'Finished-good item ID (ERP md_items, BigInt string)' })
  @IsString()
  itemId!: string;

  @ApiPropertyOptional({ example: '34', description: 'ERP work order ID (mfg_work_orders)' })
  @IsOptional()
  @IsString()
  erpWorkOrderId?: string;

  @ApiPropertyOptional({ example: '5', description: 'Work center ID' })
  @IsOptional()
  @IsString()
  workCenterId?: string;

  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  plannedQty!: number;

  @ApiPropertyOptional({ example: 'PCS' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  uomCode?: string;

  @ApiPropertyOptional({ enum: MdpMesOrderStatus, default: MdpMesOrderStatus.RELEASED })
  @IsOptional()
  @IsEnum(MdpMesOrderStatus)
  status?: MdpMesOrderStatus;

  @ApiPropertyOptional({ example: '2026-06-28T01:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  plannedStartAt?: string;

  @ApiPropertyOptional({ example: '2026-06-28T09:00:00.000Z' })
  @IsOptional()
  @IsISO8601()
  plannedEndAt?: string;

  @ApiPropertyOptional({ example: '1', description: 'ERP branch ID (md_branches)' })
  @IsOptional()
  @IsString()
  branchId?: string;

  @ApiPropertyOptional({ example: 'Batch produksi awal' })
  @IsOptional()
  @IsString()
  notes?: string;
}
