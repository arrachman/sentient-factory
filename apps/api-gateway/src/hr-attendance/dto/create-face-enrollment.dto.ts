import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsArray, IsNumber, IsObject, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateFaceEnrollmentDto {
  @ApiPropertyOptional({ example: 12 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  targetAppUserId?: number;

  @ApiPropertyOptional({ example: 0.88 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  qualityScore?: number;

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

  @ApiPropertyOptional({ example: 0.96 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  @Max(1)
  livenessScore?: number;

  @ApiPropertyOptional({ example: 'browser' })
  @IsOptional()
  @IsString()
  faceDetectionMode?: string;

  @ApiPropertyOptional({ type: Object })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
