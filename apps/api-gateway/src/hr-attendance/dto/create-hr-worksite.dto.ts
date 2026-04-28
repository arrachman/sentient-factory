import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsLatitude, IsLongitude, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { IsInt } from 'class-validator';

export class CreateHrWorksiteDto {
  @ApiProperty({ example: 'Head Office' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ example: 'HQ' })
  @IsString()
  @IsNotEmpty()
  code!: string;

  @ApiProperty({ example: -6.2 })
  @Type(() => Number)
  @IsLatitude()
  latitude!: number;

  @ApiProperty({ example: 106.8166 })
  @Type(() => Number)
  @IsLongitude()
  longitude!: number;

  @ApiProperty({ example: 100 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  radiusMeters!: number;

  @ApiProperty({ example: true, required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
