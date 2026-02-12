import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength } from 'class-validator';

export class CreateMasterDataProvinceDto {
  @ApiProperty({ example: 'Jawa Timur' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'ID-JI', description: 'ISO standard code, e.g. ID-JI for East Java' })
  @IsString()
  @MaxLength(20)
  isoCode!: string;
}
