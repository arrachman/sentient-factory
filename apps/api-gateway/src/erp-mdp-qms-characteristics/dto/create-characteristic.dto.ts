import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpQmsCharacteristicType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateQmsCharacteristicDto {
  @ApiProperty({ description: "qms_inspection_plans id" })
  @IsString()
  planId!: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sequence?: number;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ enum: MdpQmsCharacteristicType })
  @IsOptional()
  @IsEnum(MdpQmsCharacteristicType)
  characteristicType?: MdpQmsCharacteristicType;

  @ApiPropertyOptional({ example: "MM" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  uomCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  nominal?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  lowerLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  upperLimit?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
