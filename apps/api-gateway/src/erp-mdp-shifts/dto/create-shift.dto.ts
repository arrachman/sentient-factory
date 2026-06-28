import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const HHMM = /^([01]\d|2[0-3]):[0-5]\d$/;

export class CreateShiftDto {
  @ApiProperty({ example: 'SHIFT-1' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Shift Pagi' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ example: '07:00', description: 'HH:mm local (Asia/Jakarta)' })
  @IsString()
  @Matches(HHMM, { message: 'startTime must be HH:mm (00:00–23:59)' })
  startTime!: string;

  @ApiProperty({ example: '15:00', description: 'HH:mm; may cross midnight' })
  @IsString()
  @Matches(HHMM, { message: 'endTime must be HH:mm (00:00–23:59)' })
  endTime!: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
