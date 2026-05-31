import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';

export enum ErpCashBankDirectionDto {
  RECEIPT = 'RECEIPT',
  DISBURSEMENT = 'DISBURSEMENT',
}

/** Full Senti approval state machine (§2.7) — mirrors DB ErpDocumentStatus. */
export enum ErpDocumentStatusDto {
  DRAFT = 'DRAFT',
  NEED_APPROVE = 'NEED_APPROVE',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  POSTED = 'POSTED',
  VOID = 'VOID',
  CANCELLED = 'CANCELLED',
}

export class CashBankLineDto {
  @ApiProperty({ example: '101', description: 'Contra CoA account (md_accounts) id' })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiPropertyOptional({ description: 'Defaults to header currency when omitted' })
  @IsOptional()
  @IsString()
  currencyId?: string;

  @ApiPropertyOptional({ example: '1.000000' })
  @IsOptional()
  @IsNumberString()
  exchangeRate?: string;

  @ApiProperty({ example: '455000.0000' })
  @IsNumberString()
  amount!: string;

  @ApiPropertyOptional({ example: '0.0000' })
  @IsOptional()
  @IsNumberString()
  amountFx?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() costCenterId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() divisionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() subdivisionId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() projectId?: string;

  @ApiPropertyOptional({ description: 'User-defined grid column values (Kustomisasi Grid), keyed by dataField' })
  @IsOptional()
  @IsObject()
  customFields?: Record<string, unknown>;

  @ApiProperty({ example: 1 })
  @IsInt()
  @Min(1)
  lineNo!: number;
}

export class CreateCashBankTransactionDto {
  @ApiPropertyOptional({ description: 'Manual doc number; omit (or set auto=true) to server-generate' })
  @IsOptional()
  @IsString()
  docNumber?: string;

  @ApiPropertyOptional({ description: 'Auto-generate docNumber via sys_document_numberings', default: true })
  @IsOptional()
  @IsBoolean()
  auto?: boolean;

  @ApiProperty({ enum: ErpCashBankDirectionDto, example: ErpCashBankDirectionDto.RECEIPT })
  @IsEnum(ErpCashBankDirectionDto)
  direction!: ErpCashBankDirectionDto;

  @ApiProperty({ example: '1', description: 'Branch (md_branches) id — Cabang' })
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @ApiPropertyOptional({ description: 'Location (md_locations) id — Lokasi' })
  @IsOptional()
  @IsString()
  locationId?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() source?: string;

  @ApiProperty({ example: '2026-03-06' })
  @IsDateString()
  transactionDate!: string;

  @ApiPropertyOptional({ description: 'Fiscal period id; derived from transactionDate when omitted' })
  @IsOptional()
  @IsString()
  fiscalPeriodId?: string;

  @ApiProperty({ example: '5', description: 'Cash/bank GL account (md_accounts) id — Akun Kas [D]' })
  @IsString()
  @IsNotEmpty()
  bankAccountId!: string;

  @ApiPropertyOptional({ description: 'Partner (md_partners) id — Terima Dari' })
  @IsOptional()
  @IsString()
  partnerId?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() contactPerson?: string;

  @ApiProperty({ example: 'PENGEMBALIAN UANG LEBIH PARCEL' })
  @IsString()
  @IsNotEmpty()
  description!: string;

  @ApiPropertyOptional() @IsOptional() @IsString() notes?: string;

  @ApiProperty({ example: '1', description: 'Currency (md_currencies) id — Uang' })
  @IsString()
  @IsNotEmpty()
  currencyId!: string;

  @ApiProperty({ example: '1.000000' })
  @IsNumberString()
  exchangeRate!: string;

  @ApiPropertyOptional({ description: 'Header total; recomputed server-side as Σ line amounts' })
  @IsOptional()
  @IsNumberString()
  amount?: string;

  @ApiPropertyOptional({ enum: ErpDocumentStatusDto, default: ErpDocumentStatusDto.DRAFT })
  @IsOptional()
  @IsEnum(ErpDocumentStatusDto)
  status?: ErpDocumentStatusDto;

  @ApiPropertyOptional() @IsOptional() @IsString() legacyCode?: string;

  @ApiProperty({ type: [CashBankLineDto] })
  @IsArray()
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  @Type(() => CashBankLineDto)
  lines!: CashBankLineDto[];
}
