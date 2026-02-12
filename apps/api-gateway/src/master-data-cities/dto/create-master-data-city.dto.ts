import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateMasterDataCityDto {
  @ApiProperty({ example: 'cm123abc456def', description: 'Province UUID' })
  @IsString()
  @MaxLength(100)
  provinceId!: string;

  @ApiProperty({ example: 'Surabaya' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: '60111' })
  @IsString()
  @MaxLength(20)
  postalCode!: string;
}
