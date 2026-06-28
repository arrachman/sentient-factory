import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMntFailureCodeType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateMntFailureCodeDto {
  @ApiProperty({ example: "FC-BEARING" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiProperty({ enum: MdpMntFailureCodeType })
  @IsEnum(MdpMntFailureCodeType)
  type!: MdpMntFailureCodeType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;
}
