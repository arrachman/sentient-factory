import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean, IsDateString, IsInt, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, Min,
} from 'class-validator';

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateShiftDto {
  @ApiProperty({ example: 'PAGI' }) @IsString() @IsNotEmpty() @MaxLength(40) code!: string;
  @ApiProperty({ example: 'Shift Pagi' }) @IsString() @IsNotEmpty() @MaxLength(120) name!: string;
  @ApiProperty({ example: '08:00' }) @Matches(TIME_RE, { message: 'startTime HH:mm' }) startTime!: string;
  @ApiProperty({ example: '16:00' }) @Matches(TIME_RE, { message: 'endTime HH:mm' }) endTime!: string;
  @ApiPropertyOptional({ example: 60 }) @IsOptional() @Type(() => Number) @IsInt() @Min(0) breakMinutes?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateShiftDto {
  @IsOptional() @IsString() @MaxLength(40) code?: string;
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @Matches(TIME_RE) startTime?: string;
  @IsOptional() @Matches(TIME_RE) endTime?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(0) breakMinutes?: number;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class CreateShiftAssignmentDto {
  @ApiProperty({ example: 12 }) @Type(() => Number) @IsInt() @Min(1) appUserId!: number;
  @ApiProperty({ example: 1 }) @Type(() => Number) @IsInt() @Min(1) shiftId!: number;
  @ApiProperty({ example: '2026-07-01' }) @IsDateString() workDate!: string;
}
export class QueryShiftAssignmentDto {
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) userId?: number;
}

export class CreateProjectDto {
  @ApiProperty({ example: 'PROJ-A' }) @IsString() @IsNotEmpty() @MaxLength(40) code!: string;
  @ApiProperty({ example: 'Implementasi Klien A' }) @IsString() @IsNotEmpty() @MaxLength(120) name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) clientName?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isBillable?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
export class UpdateProjectDto {
  @IsOptional() @IsString() @MaxLength(40) code?: string;
  @IsOptional() @IsString() @MaxLength(120) name?: string;
  @IsOptional() @IsString() @MaxLength(120) clientName?: string;
  @IsOptional() @IsBoolean() isBillable?: boolean;
  @IsOptional() @IsBoolean() isActive?: boolean;
}
export class CreateProjectTimeDto {
  @ApiProperty({ example: 1 }) @Type(() => Number) @IsInt() @Min(1) projectId!: number;
  @ApiProperty({ example: '2026-07-01' }) @IsDateString() workDate!: string;
  @ApiProperty({ example: 120 }) @Type(() => Number) @IsInt() @Min(0) minutes!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(120) activity?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(500) note?: string;
}
export class QueryProjectTimeDto {
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) page?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) limit?: number;
  @IsOptional() @IsDateString() dateFrom?: string;
  @IsOptional() @IsDateString() dateTo?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) projectId?: number;
}
