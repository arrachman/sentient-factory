import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateSessionDto {
  @ApiProperty({ example: '1', description: 'User ID' })
  @IsString()
  userId!: string;

  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  @MaxLength(512)
  token!: string;

  @ApiProperty({
    example: '2026-02-20T10:00:00.000Z',
    description: 'Session expiry date-time in ISO format',
  })
  @IsDateString()
  expiresAt!: string;

  @ApiPropertyOptional({ example: '192.168.1.10' })
  @IsOptional()
  @IsString()
  @MaxLength(120)
  ipAddress?: string;

  @ApiPropertyOptional({ example: 'Mozilla/5.0 ...' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  userAgent?: string;
}
