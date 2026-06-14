import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateErpPartnerDto {
  @ApiProperty({ example: 'CUST-001', description: 'Unique partner code' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'PT Maju Bersama' })
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ example: '1', description: 'ErpPartnerCategory ID (string → BigInt)' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isCustomer?: boolean = false;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isSupplier?: boolean = false;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isSalesman?: boolean = false;

  @ApiPropertyOptional({ example: '01.234.567.8-901.000' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxNumber?: string;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isTaxable?: boolean = false;

  @ApiPropertyOptional({
    example: '42',
    description:
      'ErpAccount ID (BigInt as string) — control account piutang (AR) untuk partner customer. Default override saat posting AR.',
  })
  @IsOptional()
  @IsString()
  receivableAccountId?: string | null;

  @ApiPropertyOptional({
    example: '43',
    description:
      'ErpAccount ID (BigInt as string) — control account hutang (AP) untuk partner supplier. Default override saat posting AP. Bisa di-split per mata uang / per kategori (mis. Hutang IDR vs Hutang USD).',
  })
  @IsOptional()
  @IsString()
  payableAccountId?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
