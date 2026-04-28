import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class ClockAttendanceDto {
  @ApiProperty({ example: -6.2 })
  @Type(() => Number)
  @IsNumber()
  latitude!: number;

  @ApiProperty({ example: 106.8166 })
  @Type(() => Number)
  @IsNumber()
  longitude!: number;

  @ApiPropertyOptional({ example: 0.91 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  faceScore?: number;

  @ApiPropertyOptional({ example: 0.78 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  livenessScore?: number;

  @ApiPropertyOptional({ example: 'outside_geofence' })
  @IsOptional()
  @IsString()
  reasonCode?: string;

  @ApiPropertyOptional({ example: 'data:image/jpeg;base64,...' })
  @IsOptional()
  @IsString()
  snapshotDataUrl?: string;

  @ApiPropertyOptional({ type: [Number], example: [0.12, -0.33, 0.48] })
  @IsOptional()
  @IsArray()
  @ArrayMinSize(16)
  @ArrayMaxSize(512)
  @IsNumber({}, { each: true })
  faceEmbedding?: number[];

  @ApiPropertyOptional({ example: 4 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  faceDetectionCount?: number;

  @ApiPropertyOptional({ example: 'browser' })
  @IsOptional()
  @IsString()
  faceDetectionMode?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  deviceInfo?: Record<string, unknown>;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
