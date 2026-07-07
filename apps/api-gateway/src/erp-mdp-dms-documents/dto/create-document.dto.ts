import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpDmsCategory, MdpDmsDocStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateDmsDocumentDto {
  @ApiProperty({ example: "DOC-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ enum: MdpDmsCategory })
  @IsOptional()
  @IsEnum(MdpDmsCategory)
  category?: MdpDmsCategory;

  @ApiPropertyOptional({ enum: MdpDmsDocStatus })
  @IsOptional()
  @IsEnum(MdpDmsDocStatus)
  status?: MdpDmsDocStatus;

  @ApiPropertyOptional({ example: "A" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  currentRevision?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  ownerId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  effectiveAt?: string;
}
