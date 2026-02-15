import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateOutboundDetailDto {
  @ApiProperty({ example: 'cm123abc456def' })
  @IsString()
  @MaxLength(100)
  itemId!: string;

  @ApiProperty({ example: 'BATCH-20260213-001' })
  @IsString()
  @MaxLength(100)
  batchNumber!: string;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  qtyPcs?: number;

  @ApiProperty({ example: 1250.5 })
  @IsNumber()
  @Min(0.001)
  qtyKg!: number;

  @ApiPropertyOptional({ example: 'Frozen box condition OK' })
  @IsOptional()
  @IsString()
  notes?: string;
}
