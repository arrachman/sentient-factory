import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpWmsPostingStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsISO8601, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWmsMovementDto {
  @ApiProperty({ example: 'WM-2606-0001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiPropertyOptional({ description: 'wms_tasks id' })
  @IsOptional()
  @IsString()
  taskId?: string;

  @ApiProperty({ description: 'md_items id (ERP)' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qty!: number;

  @ApiPropertyOptional({ example: 'PCS' })
  @IsOptional()
  @IsString()
  uomCode?: string;

  @ApiPropertyOptional({ description: 'md_storage_bins id (ERP)' })
  @IsOptional()
  @IsString()
  fromBinId?: string;

  @ApiPropertyOptional({ description: 'md_storage_bins id (ERP)' })
  @IsOptional()
  @IsString()
  toBinId?: string;

  @ApiPropertyOptional({ description: 'wms_handling_units id' })
  @IsOptional()
  @IsString()
  handlingUnitId?: string;

  @ApiProperty({ example: '2026-06-28T03:00:00.000Z' })
  @IsISO8601()
  movedAt!: string;

  @ApiPropertyOptional({ description: 'adm_users id (ERP)' })
  @IsOptional()
  @IsString()
  movedById?: string;

  @ApiPropertyOptional({ enum: MdpWmsPostingStatus, default: MdpWmsPostingStatus.PENDING })
  @IsOptional()
  @IsEnum(MdpWmsPostingStatus)
  postingStatus?: MdpWmsPostingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
