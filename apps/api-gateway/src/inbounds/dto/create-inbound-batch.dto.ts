import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateInboundBatchDto {
  @ApiProperty({ example: '100P' })
  @IsString()
  @MaxLength(100)
  batchIn!: string;

  @ApiProperty({ example: 10 })
  @IsNumber()
  @Min(0.0001)
  qty!: number;

  @ApiPropertyOptional({ example: '2026-02-25' })
  @IsOptional()
  @IsDateString()
  expiredDate?: string;

  @ApiPropertyOptional({ example: 'Batch from supplier lot A' })
  @IsOptional()
  @IsString()
  notes?: string;
}
