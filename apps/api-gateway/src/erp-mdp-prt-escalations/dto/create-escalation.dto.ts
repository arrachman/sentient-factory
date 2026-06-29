import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpPrtEscalationStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreatePrtEscalationDto {
  @ApiProperty({ description: "prt_issues id" })
  @IsString()
  issueId!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  level?: number;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  escalatedToId?: string;

  @ApiProperty()
  @IsDateString()
  escalatedAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiPropertyOptional({ enum: MdpPrtEscalationStatus })
  @IsOptional()
  @IsEnum(MdpPrtEscalationStatus)
  status?: MdpPrtEscalationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  reason?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
