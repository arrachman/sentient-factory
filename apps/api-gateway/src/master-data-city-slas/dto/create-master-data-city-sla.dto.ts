import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class CreateMasterDataCitySlaDto {
  @ApiProperty({ example: 'cm123city456def', description: 'City UUID' })
  @IsString()
  @MaxLength(100)
  cityId!: string;

  @ApiProperty({ example: 7, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stdLeadTimeDays!: number;

  @ApiProperty({ example: 1, default: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stdReturnDoDays!: number;
}
