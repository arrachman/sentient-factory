import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class AskM2InsightDto {
  @ApiProperty({
    example: 'Kenapa net cashflow bulan ini turun?',
    description: 'Pertanyaan bebas user terkait dashboard finance m2.',
  })
  @IsString()
  @MaxLength(1000)
  question!: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ example: '2025-12-31' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ example: 'm2_aj', description: 'Feature/menu context (optional)' })
  @IsOptional()
  @IsString()
  @MaxLength(64)
  feature?: string;
}

