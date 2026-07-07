import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'mes' })
  @IsString()
  @MaxLength(80)
  code!: string;

  @ApiProperty({ example: 'Manufacturing Execution' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiPropertyOptional({ description: 'parent mdp_menus id (self-tree)' })
  @IsOptional()
  @IsString()
  parentId?: string;

  @ApiPropertyOptional({ example: '/app/mes' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  path?: string;

  @ApiPropertyOptional({ example: 'Factory', description: 'lucide icon name' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string;

  @ApiPropertyOptional({ example: 'mes', description: 'MOM module key' })
  @IsOptional()
  @IsString()
  @MaxLength(40)
  moduleKey?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sequence?: number = 0;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
