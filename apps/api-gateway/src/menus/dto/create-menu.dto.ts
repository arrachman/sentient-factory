import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'administrator.users' })
  @IsString()
  @MaxLength(100)
  @Matches(/^[a-z0-9_.-]+$/i)
  key!: string;

  @ApiProperty({ example: 'Users' })
  @IsString()
  @MaxLength(120)
  title!: string;

  @ApiPropertyOptional({ example: '/app/administrator/users' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  path?: string;

  @ApiPropertyOptional({ example: 'Users' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  icon?: string;

  @ApiPropertyOptional({ example: 'ITEM', default: 'ITEM' })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  type?: string;

  @ApiPropertyOptional({ example: 1, nullable: true })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === null || value === undefined || value === '') {
      return undefined;
    }
    return Number(value);
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  parentId?: number | null;

  @ApiPropertyOptional({ example: 10, default: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(9999)
  sortOrder?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isVisible?: boolean;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @Type(() => Boolean)
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 'users.read' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  permissionName?: string;
}
