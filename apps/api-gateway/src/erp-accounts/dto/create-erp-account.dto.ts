import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';
import {
  ErpAccountType,
  ErpAccountKind,
  ErpNormalBalance,
  ErpCashFlowCategory,
} from '@prisma/client';

export const ERP_ACCOUNT_CODE_PATTERN = /^\d{4}\.\d{2}\.\d{3}$/;
export const ERP_ACCOUNT_CODE_MESSAGE =
  'code wajib mengikuti format NNNN.NN.NNN (4-2-3, contoh: 1101.01.001)';

export class CreateErpAccountDto {
  @ApiProperty({
    example: '1101.01.001',
    description:
      'Unique account code (format `NNNN.NN.NNN` 4-2-3). HEADER pakai trailing zero: `1100.00.000`. POSTABLE default: `1101.01.001`.',
  })
  @IsString()
  @MaxLength(11)
  @Matches(ERP_ACCOUNT_CODE_PATTERN, { message: ERP_ACCOUNT_CODE_MESSAGE })
  code!: string;

  @ApiProperty({ example: 'Cash on Hand' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiPropertyOptional({ example: 'Kas Besar' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  alias?: string;

  @ApiProperty({ enum: ErpAccountType, example: ErpAccountType.ASSET })
  @IsEnum(ErpAccountType)
  accountType!: ErpAccountType;

  @ApiProperty({ enum: ErpAccountKind, example: ErpAccountKind.POSTABLE })
  @IsEnum(ErpAccountKind)
  accountKind!: ErpAccountKind;

  @ApiProperty({ enum: ErpNormalBalance, example: ErpNormalBalance.DEBIT })
  @IsEnum(ErpNormalBalance)
  normalBalance!: ErpNormalBalance;

  @ApiPropertyOptional({ enum: ErpCashFlowCategory })
  @IsOptional()
  @IsEnum(ErpCashFlowCategory)
  cashFlowCategory?: ErpCashFlowCategory;

  @ApiPropertyOptional({ example: '1', description: 'Parent account ID (string BigInt)' })
  @IsOptional()
  @IsString()
  parentId?: string | null;

  @ApiPropertyOptional({ example: '1', description: 'Currency ID (string BigInt)' })
  @IsOptional()
  @IsString()
  currencyId?: string | null;

  @ApiPropertyOptional({ example: 1, description: 'Account level in hierarchy' })
  @IsOptional()
  level?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;

  @ApiPropertyOptional({ example: false, default: false })
  @IsOptional()
  @IsBoolean()
  isControlAccount?: boolean = false;

  @ApiPropertyOptional({ example: 'Bank BCA' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  bankName?: string;

  @ApiPropertyOptional({ example: '1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankAccountNo?: string;

  @ApiPropertyOptional({ example: 'Opening balance notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
