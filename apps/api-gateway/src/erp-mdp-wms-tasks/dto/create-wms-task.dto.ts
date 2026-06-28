import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpWmsTaskStatus, MdpWmsTaskType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWmsTaskDto {
  @ApiProperty({ example: 'WT-2606-0001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ enum: MdpWmsTaskType })
  @IsEnum(MdpWmsTaskType)
  type!: MdpWmsTaskType;

  @ApiPropertyOptional({ enum: MdpWmsTaskStatus, default: MdpWmsTaskStatus.OPEN })
  @IsOptional()
  @IsEnum(MdpWmsTaskStatus)
  status?: MdpWmsTaskStatus;

  @ApiPropertyOptional({ description: 'md_items id (ERP)' })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qty?: number;

  @ApiPropertyOptional({ example: 'PCS' })
  @IsOptional()
  @IsString()
  uomCode?: string;

  @ApiPropertyOptional({ description: 'md_storage_bins id (ERP)' })
  @IsOptional()
  @IsString()
  sourceBinId?: string;

  @ApiPropertyOptional({ description: 'md_storage_bins id (ERP)' })
  @IsOptional()
  @IsString()
  destBinId?: string;

  @ApiPropertyOptional({ description: 'mes_production_orders id' })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({ example: 'GRN', description: 'ERP doc kind' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  erpReferenceType?: string;

  @ApiPropertyOptional({ description: 'ERP doc id' })
  @IsOptional()
  @IsString()
  erpReferenceId?: string;

  @ApiPropertyOptional({ description: 'adm_users id (ERP)' })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  priority?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
