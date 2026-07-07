import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpQmsResultStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateQmsResultDto {
  @ApiProperty({ description: "qms_inspections id" })
  @IsString()
  inspectionId!: string;

  @ApiPropertyOptional({ description: "qms_inspection_characteristics id" })
  @IsOptional()
  @IsString()
  characteristicId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  measuredValue?: number;

  @ApiPropertyOptional({ enum: MdpQmsResultStatus })
  @IsOptional()
  @IsEnum(MdpQmsResultStatus)
  status?: MdpQmsResultStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
