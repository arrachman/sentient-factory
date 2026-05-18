import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class QueryErpDocumentNumberingDto {
  @ApiPropertyOptional({ example: 'INV-OUT', description: 'Filter by document code' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  documentCode?: string;

  @ApiPropertyOptional({ example: true, description: 'Filter by active (not soft-deleted) status' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isActive?: boolean;
}
