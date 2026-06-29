import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpLmsCourseCategory, MdpLmsCourseStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateLmsCourseDto {
  @ApiProperty({ example: "CRS-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ enum: MdpLmsCourseCategory })
  @IsOptional()
  @IsEnum(MdpLmsCourseCategory)
  category?: MdpLmsCourseCategory;

  @ApiPropertyOptional({ enum: MdpLmsCourseStatus })
  @IsOptional()
  @IsEnum(MdpLmsCourseStatus)
  status?: MdpLmsCourseStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  durationHours?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  validityMonths?: number;
}
