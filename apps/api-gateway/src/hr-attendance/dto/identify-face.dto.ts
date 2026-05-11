import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

export class IdentifyFaceDto {
  @IsArray()
  @ArrayMinSize(16)
  @ArrayMaxSize(512)
  @IsNumber({}, { each: true })
  faceEmbedding!: number[];

  @IsOptional()
  @IsNumber()
  faceDetectionCount?: number;

  @IsOptional()
  @IsString()
  faceDetectionMode?: string;
}
