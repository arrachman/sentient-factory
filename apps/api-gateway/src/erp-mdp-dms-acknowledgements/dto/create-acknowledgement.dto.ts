import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDmsAcknowledgementDto {
  @ApiProperty({ description: "dms_documents id" })
  @IsString()
  documentId!: string;

  @ApiPropertyOptional({ description: "dms_revisions id" })
  @IsOptional()
  @IsString()
  revisionId?: string;

  @ApiProperty({ description: "adm_users id" })
  @IsString()
  userId!: string;

  @ApiProperty()
  @IsDateString()
  acknowledgedAt!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
