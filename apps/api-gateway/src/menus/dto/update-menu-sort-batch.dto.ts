import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsInt, ValidateNested } from 'class-validator';

class UpdateMenuSortItemDto {
  @ApiProperty({ example: 10 })
  @Type(() => Number)
  @IsInt()
  id!: number;

  @ApiProperty({ example: 20 })
  @Type(() => Number)
  @IsInt()
  sortOrder!: number;
}

export class UpdateMenuSortBatchDto {
  @ApiProperty({ type: [UpdateMenuSortItemDto] })
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => UpdateMenuSortItemDto)
  items!: UpdateMenuSortItemDto[];
}
