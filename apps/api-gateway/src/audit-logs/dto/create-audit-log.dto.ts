import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateAuditLogDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  userId?: number;

  @ApiProperty({ example: 'UPDATE' })
  @IsString()
  @MaxLength(100)
  action!: string;

  @ApiProperty({ example: 'USER' })
  @IsString()
  @MaxLength(120)
  entityType!: string;

  @ApiPropertyOptional({ example: '25' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  entityId?: string;

  @ApiPropertyOptional({ example: { before: { isActive: true } } })
  @IsOptional()
  oldData?: unknown;

  @ApiPropertyOptional({ example: { after: { isActive: false } } })
  @IsOptional()
  newData?: unknown;

  @ApiPropertyOptional({ example: '127.0.0.1' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  userAgent?: string;
}
