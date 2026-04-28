import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateHrAttendanceReviewDto {
  @ApiPropertyOptional({ example: 'Looks acceptable after manager review.' })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  @ApiPropertyOptional({ example: 'approved' })
  @IsOptional()
  @IsString()
  @IsIn(['pending', 'approved', 'rejected', 'needs_clarification'])
  reviewStatus?: 'pending' | 'approved' | 'rejected' | 'needs_clarification';
}
