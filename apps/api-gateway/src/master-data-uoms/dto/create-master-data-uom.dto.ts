import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateMasterDataUomDto {
  @ApiProperty({ example: 'KG', description: 'ISO standard code' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Kilogram' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'weight' })
  @IsString()
  @MaxLength(50)
  type!: string;
}
