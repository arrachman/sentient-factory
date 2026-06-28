import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpWmsTaskStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateWmsPickDto {
  @ApiProperty({ description: 'wms_tasks id' })
  @IsString()
  taskId!: string;

  @ApiProperty({ description: 'md_items id (ERP)' })
  @IsString()
  itemId!: string;

  @ApiProperty({ example: 50 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qtyRequested!: number;

  @ApiPropertyOptional({ example: 0, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qtyPicked?: number;

  @ApiPropertyOptional({ description: 'md_storage_bins id (ERP)' })
  @IsOptional()
  @IsString()
  sourceBinId?: string;

  @ApiPropertyOptional({ description: 'wms_handling_units id' })
  @IsOptional()
  @IsString()
  handlingUnitId?: string;

  @ApiPropertyOptional({ enum: MdpWmsTaskStatus, default: MdpWmsTaskStatus.OPEN })
  @IsOptional()
  @IsEnum(MdpWmsTaskStatus)
  status?: MdpWmsTaskStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
