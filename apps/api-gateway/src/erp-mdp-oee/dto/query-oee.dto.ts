import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

/**
 * OEE is a derived overlay (no own tables). The query selects the time window
 * and an optional work-center scope; everything else is computed from mes/qms.
 */
export class QueryOeeDto {
  @ApiPropertyOptional({ description: 'Window start (ISO-8601). Defaults to 30 days ago.' })
  @IsOptional()
  @IsISO8601()
  from?: string;

  @ApiPropertyOptional({ description: 'Window end (ISO-8601). Defaults to now.' })
  @IsOptional()
  @IsISO8601()
  to?: string;

  @ApiPropertyOptional({ description: 'Scope to a single work center ID (BigInt string)' })
  @IsOptional()
  @IsString()
  workCenterId?: string;
}
