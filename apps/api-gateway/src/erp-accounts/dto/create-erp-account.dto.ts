import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ErpAccountType,
  ErpAccountKind,
  ErpNormalBalance,
  ErpCashFlowCategory,
} from '@prisma/client';

export class CreateErpAccountDto {
  @ApiProperty({ example: '1-1001', description: 'Unique account code' })
  @IsString()
  @MaxLength(50)
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
