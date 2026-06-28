import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpReasonCodeCategory } from '@prisma/client';
import { IsBoolean, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateReasonCodeDto {
  @ApiProperty({ example: 'DT-CHANGEOVER' })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty({ example: 'Changeover / Setup' })
  @IsString()
  @MaxLength(150)
  name!: string;

  @ApiProperty({ enum: MdpReasonCodeCategory, example: MdpReasonCodeCategory.DOWNTIME })
  @IsEnum(MdpReasonCodeCategory)
  category!: MdpReasonCodeCategory;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean = true;
}
