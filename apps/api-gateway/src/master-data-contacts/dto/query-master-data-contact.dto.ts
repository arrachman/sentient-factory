import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const CONTACT_TYPES = ['customer', 'supplier', 'company'] as const;

export class QueryMasterDataContactDto {
  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ example: 10, default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;

  @ApiPropertyOptional({ example: 'sentient' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CONTACT_TYPES })
  @IsOptional()
  @IsString()
  @IsIn(CONTACT_TYPES)
  type?: (typeof CONTACT_TYPES)[number];
}
