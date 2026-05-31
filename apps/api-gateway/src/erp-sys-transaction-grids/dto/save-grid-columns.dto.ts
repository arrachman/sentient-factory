import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min, ValidateNested,
} from 'class-validator';

export const GRID_COLUMN_KINDS = ['STANDARD', 'CUSTOM'] as const;
export const GRID_DATA_TYPES = ['TEXT', 'NUMBER', 'DATE', 'LOOKUP'] as const;

export class GridColumnInputDto {
  @ApiProperty({ example: 0 }) @IsInt() @Min(0) sortOrder!: number;
  @ApiProperty({ example: 'Akun (No · Nama)' }) @IsString() headerText!: string;
  @ApiProperty({ example: 'accountId' }) @IsString() dataField!: string;
  @ApiProperty({ example: 160 }) @IsInt() @Min(0) width!: number;
  @ApiProperty({ example: true }) @IsBoolean() isVisible!: boolean;
  @ApiProperty({ example: false }) @IsBoolean() isRequired!: boolean;
  @ApiProperty({ example: true }) @IsBoolean() isEditable!: boolean;
  @ApiProperty({ enum: GRID_COLUMN_KINDS }) @IsIn(GRID_COLUMN_KINDS) kind!: (typeof GRID_COLUMN_KINDS)[number];
  @ApiProperty({ enum: GRID_DATA_TYPES }) @IsIn(GRID_DATA_TYPES) dataType!: (typeof GRID_DATA_TYPES)[number];
  @ApiPropertyOptional({ example: 'account' }) @IsOptional() @IsString() lookupSource?: string;
}

export class SaveGridColumnsDto {
  @ApiProperty({ type: [GridColumnInputDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => GridColumnInputDto)
  columns!: GridColumnInputDto[];
}
