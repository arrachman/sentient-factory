import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';

class UpdateMenuSortItemDto {
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  id!: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  sortOrder!: number;

  @ApiPropertyOptional({ example: '/app/administrator/menu' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  path?: string | null;
}

export class UpdateMenuSortBatchDto {
  @ApiProperty({ type: [UpdateMenuSortItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateMenuSortItemDto)
  items!: UpdateMenuSortItemDto[];
}
