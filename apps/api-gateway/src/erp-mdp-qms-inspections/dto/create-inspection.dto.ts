import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpQmsInspectionType, MdpQmsInspectionVerdict } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateQmsInspectionDto {
  @ApiProperty({ example: "QI-2606-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiPropertyOptional({ description: "qms_inspection_plans id" })
  @IsOptional()
  @IsString()
  planId?: string;

  @ApiProperty({ enum: MdpQmsInspectionType })
  @IsEnum(MdpQmsInspectionType)
  type!: MdpQmsInspectionType;

  @ApiPropertyOptional({ description: "md_items id (ERP)" })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional({ description: "mes_production_orders id" })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  lotCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  lotSize?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  sampleSize?: number;

  @ApiPropertyOptional({ enum: MdpQmsInspectionVerdict })
  @IsOptional()
  @IsEnum(MdpQmsInspectionVerdict)
  result?: MdpQmsInspectionVerdict;

  @ApiProperty()
  @IsDateString()
  inspectedAt!: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  inspectedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
