import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpLmsEnrollmentStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateLmsEnrollmentDto {
  @ApiProperty({ description: "lms_courses id" })
  @IsString()
  courseId!: string;

  @ApiProperty({ description: "adm_users id" })
  @IsString()
  userId!: string;

  @ApiPropertyOptional({ enum: MdpLmsEnrollmentStatus })
  @IsOptional()
  @IsEnum(MdpLmsEnrollmentStatus)
  status?: MdpLmsEnrollmentStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  progressPct?: number;

  @ApiProperty()
  @IsDateString()
  enrolledAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  score?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(60)
  certificateCode?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  expiresAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
