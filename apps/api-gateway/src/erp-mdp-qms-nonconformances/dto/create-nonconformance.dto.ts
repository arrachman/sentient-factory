import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpQmsNcrSeverity, MdpQmsNcrStatus, MdpQmsDisposition } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateQmsNonconformanceDto {
  @ApiProperty({ example: "NCR-2606-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ enum: MdpQmsNcrSeverity })
  @IsOptional()
  @IsEnum(MdpQmsNcrSeverity)
  severity?: MdpQmsNcrSeverity;

  @ApiPropertyOptional({ enum: MdpQmsNcrStatus })
  @IsOptional()
  @IsEnum(MdpQmsNcrStatus)
  status?: MdpQmsNcrStatus;

  @ApiPropertyOptional({ enum: MdpQmsDisposition })
  @IsOptional()
  @IsEnum(MdpQmsDisposition)
  disposition?: MdpQmsDisposition;

  @ApiPropertyOptional({ example: "INSPECTION" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  sourceType?: string;

  @ApiPropertyOptional({ description: "md_items id (ERP)" })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional({ description: "mes_production_orders id" })
  @IsOptional()
  @IsString()
  productionOrderId?: string;

  @ApiPropertyOptional({ description: "qms_inspections id" })
  @IsOptional()
  @IsString()
  inspectionId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qtyAffected?: number;

  @ApiPropertyOptional({ example: "GRN" })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  erpReferenceType?: string;

  @ApiPropertyOptional({ description: "ERP doc id" })
  @IsOptional()
  @IsString()
  erpReferenceId?: string;

  @ApiProperty()
  @IsDateString()
  detectedAt!: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  detectedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  closedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
