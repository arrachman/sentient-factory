import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { ErpPartnerCategoryKind } from '@prisma/client';

export class CreateErpPartnerCategoryDto {
  @ApiProperty({ example: 'CUST-RETAIL', description: 'Unique category code' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Retail Customer' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ enum: ErpPartnerCategoryKind, example: ErpPartnerCategoryKind.CUSTOMER })
  @IsEnum(ErpPartnerCategoryKind)
  kind!: ErpPartnerCategoryKind;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
