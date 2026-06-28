import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsISO8601, IsOptional, IsString } from 'class-validator';

export class CreateLaborLogDto {
  @ApiProperty({ example: '3', description: 'Operation ID (mes_operations, BigInt string)' })
  @IsString()
  operationId!: string;

  @ApiProperty({ example: '15', description: 'Operator user ID (ERP adm_users, BigInt string)' })
  @IsString()
  operatorId!: string;

  @ApiPropertyOptional({ example: '2', description: 'Shift ID (mdp_shifts)' })
  @IsOptional()
  @IsString()
  shiftId?: string;

  @ApiProperty({ example: '2026-06-28T01:00:00.000Z' })
  @IsISO8601()
  startedAt!: string;

  @ApiPropertyOptional({
    example: '2026-06-28T05:00:00.000Z',
    description: 'Null = clocked-in/ongoing',
  })
  @IsOptional()
  @IsISO8601()
  endedAt?: string;
}
