import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ErpUserLevel } from '@prisma/client';

export class CreateErpUserDto {
  @ApiProperty({ example: 'johndoe', description: 'Unique username (code)' })
  @IsString()
  @MaxLength(50)
  username!: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(150)
  email?: string;

  @ApiProperty({ example: 'Secret@123', description: 'Plain password — will be hashed by service' })
  @IsString()
  @MinLength(8)
  @MaxLength(100)
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MaxLength(150)
  fullName!: string;

  @ApiProperty({ enum: ErpUserLevel, example: ErpUserLevel.CENTRAL })
  @IsEnum(ErpUserLevel)
  erpLevel!: ErpUserLevel;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({
    example: '1',
    description: 'Branch ID as numeric string (BigInt)',
  })
  @IsOptional()
  @IsString()
  branchId?: string;
}
