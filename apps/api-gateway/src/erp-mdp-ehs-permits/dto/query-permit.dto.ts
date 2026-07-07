import { ApiPropertyOptional } from '@nestjs/swagger';
import { MdpEhsPermitStatus, MdpEhsPermitType } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

const SORTABLE_FIELDS = ['createdAt', 'code', 'status'] as const;
type SortableField = (typeof SORTABLE_FIELDS)[number];

export class QueryEhsPermitDto {
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

  @ApiPropertyOptional({ description: 'search code/name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: MdpEhsPermitStatus })
  @IsOptional()
  @IsEnum(MdpEhsPermitStatus)
  status?: MdpEhsPermitStatus;

  @ApiPropertyOptional({ enum: MdpEhsPermitType })
  @IsOptional()
  @IsEnum(MdpEhsPermitType)
  type?: MdpEhsPermitType;

  @ApiPropertyOptional({ enum: SORTABLE_FIELDS })
  @IsOptional()
  @IsIn(SORTABLE_FIELDS)
  sortBy?: SortableField;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  sortDir?: 'asc' | 'desc';
}
