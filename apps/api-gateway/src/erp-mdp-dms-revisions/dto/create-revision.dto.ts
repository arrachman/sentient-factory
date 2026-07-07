import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpDmsRevisionStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDmsRevisionDto {
  @ApiProperty({ description: "dms_documents id" })
  @IsString()
  documentId!: string;

  @ApiProperty({ example: "B" })
  @IsString()
  @MaxLength(20)
  revisionCode!: string;

  @ApiPropertyOptional({ enum: MdpDmsRevisionStatus })
  @IsOptional()
  @IsEnum(MdpDmsRevisionStatus)
  status?: MdpDmsRevisionStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(300)
  filePath?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  changeSummary?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  approvedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  approvedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
