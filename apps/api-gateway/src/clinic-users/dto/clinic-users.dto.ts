import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

const CLINIC_ROLE_NAMES = [
  'clinic-admin',
  'clinic-psikolog',
  'clinic-owner',
  'clinic-resepsionis',
  'clinic-marketing',
  'clinic-intern',
] as const;

export class CreateClinicUserDto {
  @ApiProperty({ example: 'newuser@althea.local' })
  @IsEmail()
  @MaxLength(255)
  email!: string;

  @ApiProperty({ example: 'Nama User' })
  @IsString()
  @MaxLength(255)
  fullName!: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(120)
  username?: string;

  @ApiPropertyOptional({ example: 'Test1234!' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(120)
  password?: string;

  @ApiProperty({
    description: 'Daftar role yang di-assign ke user (minimal 1)',
    example: ['clinic-admin'],
    type: [String],
    enum: CLINIC_ROLE_NAMES,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsString({ each: true })
  roles!: string[];

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateClinicUserDto extends PartialType(CreateClinicUserDto) {}

export class QueryClinicUserDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiPropertyOptional({ description: 'Search by email/fullName/username' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by role name' })
  @IsOptional()
  @IsString()
  role?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === 'true') return true;
      if (v === 'false') return false;
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
