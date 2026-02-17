import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMasterDataPermissionDto {
  @ApiProperty({ example: 'user:create' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'user' })
  @IsString()
  @MaxLength(80)
  module!: string;

  @ApiProperty({ example: 'create' })
  @IsString()
  @MaxLength(80)
  action!: string;

  @ApiPropertyOptional({ example: 'Permission to create users' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;
}
