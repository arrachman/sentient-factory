import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateHrSettingDto {
  @ApiProperty({ example: 'true' })
  @IsString()
  value!: string;
}
