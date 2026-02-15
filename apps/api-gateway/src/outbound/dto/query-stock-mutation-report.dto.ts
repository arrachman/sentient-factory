import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class QueryStockMutationReportDto {
  @ApiPropertyOptional({ example: 'cm123warehouse456' })
  @IsOptional()
  @IsString()
  warehouseId?: string;

  @ApiPropertyOptional({ example: 'cm123supplier456' })
  @IsOptional()
  @IsString()
  supplierId?: string;

  @ApiPropertyOptional({ example: 'cm123item456' })
  @IsOptional()
  @IsString()
  itemId?: string;
}
