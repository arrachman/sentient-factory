import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDateString,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';
import {
  ErpCashBankDirectionDto,
  ErpDocumentStatusDto,
} from './create-cash-bank-transaction.dto';

export const CASH_BANK_SORTABLE = [
  'docNumber',
  'transactionDate',
  'amount',
  'status',
  'createdAt',
] as const;

export class QueryCashBankTransactionDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ description: 'docNumber / description / contactPerson' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CASH_BANK_SORTABLE, default: 'transactionDate' })
  @IsOptional()
  @IsIn(CASH_BANK_SORTABLE as unknown as string[])
  sortBy?: string = 'transactionDate';

  @ApiPropertyOptional({ enum: ['asc', 'desc'], default: 'desc' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc' = 'desc';

  @ApiPropertyOptional({ enum: ErpCashBankDirectionDto })
  @IsOptional()
  @IsEnum(ErpCashBankDirectionDto)
  direction?: ErpCashBankDirectionDto;

  @ApiPropertyOptional({ enum: ErpDocumentStatusDto })
  @IsOptional()
  @IsEnum(ErpDocumentStatusDto)
  status?: ErpDocumentStatusDto;

  @ApiPropertyOptional({ description: 'transactionDate >= (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'transactionDate <= (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional() @IsOptional() @IsString() branchId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() locationId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() partnerId?: string;
}
