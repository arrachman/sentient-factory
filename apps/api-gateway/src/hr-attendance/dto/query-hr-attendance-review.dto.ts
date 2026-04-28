import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class QueryHrAttendanceReviewDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ example: 'pending' })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'needs_clarification'])
  reviewStatus?: string;

  @ApiPropertyOptional({ example: 'outside_geofence' })
  @IsOptional()
  @IsString()
  reasonCode?: string;

  @ApiPropertyOptional({ example: 'staff' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ example: 'low-confidence' })
  @IsOptional()
  @IsString()
  @IsIn(['idle', 'scanning', 'success', 'failure', 'low-confidence'])
  validationUiState?: string;
}
