import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateErpCityDto {
  @ApiProperty({ example: 'CTYC-001' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'City Sample' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ example: "1", description: "Province id" })
  @IsString()
  provinceId!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
