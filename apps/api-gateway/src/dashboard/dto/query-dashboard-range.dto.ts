import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional } from 'class-validator';

export class QueryDashboardRangeDto {
  @ApiPropertyOptional({
    example: '2026-01-01',
    description: 'Start date (inclusive). Default handled at service level.',
  })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({
    example: '2026-01-31',
    description: 'End date (inclusive). Default handled at service level.',
  })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
