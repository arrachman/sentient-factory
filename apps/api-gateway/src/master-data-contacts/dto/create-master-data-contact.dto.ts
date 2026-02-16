import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

const CONTACT_TYPES = ['customer', 'supplier', 'company'] as const;

export class CreateMasterDataContactDto {
  @ApiProperty({ example: 'CUST-001' })
  @IsString()
  @MaxLength(100)
  code!: string;

  @ApiProperty({ example: 'PT Sentient Customer A' })
  @IsString()
  @MaxLength(255)
  name!: string;

  @ApiPropertyOptional({ example: '01.234.567.8-999.000' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  tax?: string;

  @ApiPropertyOptional({ example: 'https://example.com' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  website?: string;

  @ApiPropertyOptional({ example: 'Kawasan Industri Sentient, Blok A1' })
  @IsOptional()
  @IsString()
  address?: string;

  @ApiPropertyOptional({ example: 'Jl. Industri Raya No. 12' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  street?: string;

  @ApiPropertyOptional({ example: 'Jakarta' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  city?: string;

  @ApiPropertyOptional({ example: 'DKI Jakarta' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  province?: string;

  @ApiPropertyOptional({ example: '12950' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  zipCode?: string;

  @ApiProperty({ enum: CONTACT_TYPES, example: 'customer' })
  @IsString()
  @IsIn(CONTACT_TYPES)
  type!: (typeof CONTACT_TYPES)[number];

  @ApiPropertyOptional({ example: 'Budi' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactFirstName?: string;

  @ApiPropertyOptional({ example: 'budi@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  contactEmail?: string;

  @ApiPropertyOptional({ example: '+6281234569' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  contactPhone?: string;
}
