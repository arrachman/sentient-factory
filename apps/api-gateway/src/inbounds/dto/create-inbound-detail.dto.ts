import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { CreateInboundBatchDto } from './create-inbound-batch.dto';

export class CreateInboundDetailDto {
  @ApiProperty({ example: 'cm123abc456def' })
  @IsString()
  @MaxLength(100)
  itemId!: string;

  @ApiProperty({ example: 50 })
  @IsNumber()
  @Min(0.0001)
  qty!: number;

  @ApiPropertyOptional({ example: 'Barang A inbound' })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({
    example: 25,
    description: 'Input integer bebas untuk kebutuhan UOM kg/liter',
  })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  uomInput!: number;

  @ApiProperty({ type: [CreateInboundBatchDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateInboundBatchDto)
  batches!: CreateInboundBatchDto[];
}
