import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export const ROOM_TYPES = ['konseling', 'anak', 'tes', 'seminar'] as const;
export type RoomType = (typeof ROOM_TYPES)[number];

export class CreateRoomDto {
  @ApiProperty({ example: 'Sage Room' })
  @IsString()
  @MaxLength(120)
  name!: string;

  @ApiProperty({ example: 'konseling', enum: ROOM_TYPES })
  @IsIn(ROOM_TYPES)
  type!: RoomType;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  capacity?: number;

  @ApiPropertyOptional({
    description: 'Daftar fasilitas (mis. ["Sofa","Meja","AC","Tisu"]). Max 30.',
    example: ['Sofa', 'Meja', 'AC', 'Tisu'],
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(30)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  facilities?: string[];

  @ApiPropertyOptional({
    description: 'Catatan freeform admin (mis. "AC service 2026-02-01")',
  })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateRoomDto extends PartialType(CreateRoomDto) {}

export class QueryRoomDto {
  @ApiPropertyOptional({ default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ default: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number = 50;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: ROOM_TYPES })
  @IsOptional()
  @IsIn(ROOM_TYPES)
  type?: RoomType;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'string') {
      const v = value.trim().toLowerCase();
      if (v === 'true') return true;
      if (v === 'false') return false;
    }
    return value;
  })
  @IsBoolean()
  isActive?: boolean;
}
