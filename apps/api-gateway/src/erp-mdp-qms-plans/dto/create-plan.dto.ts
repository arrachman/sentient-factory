import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpQmsInspectionType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQmsPlanDto {
  @ApiProperty({ example: "QIP-INC-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: "Incoming Steel Plate" })
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: MdpQmsInspectionType })
  @IsEnum(MdpQmsInspectionType)
  type!: MdpQmsInspectionType;

  @ApiPropertyOptional({ description: "md_items id (ERP)" })
  @IsOptional()
  @IsString()
  itemId?: string;

  @ApiPropertyOptional({ description: "mes_operations id" })
  @IsOptional()
  @IsString()
  operationId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
