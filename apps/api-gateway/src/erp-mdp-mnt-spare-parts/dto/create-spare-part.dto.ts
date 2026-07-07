import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpMntPostingStatus } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class CreateMntSparePartDto {
  @ApiProperty({ description: "mnt_work_orders id" })
  @IsString()
  workOrderId!: string;

  @ApiProperty({ description: "md_items id (ERP)" })
  @IsString()
  itemId!: string;

  @ApiProperty()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  qty!: number;

  @ApiPropertyOptional({ example: "PCS" })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  uomCode?: string;

  @ApiPropertyOptional({ enum: MdpMntPostingStatus })
  @IsOptional()
  @IsEnum(MdpMntPostingStatus)
  postingStatus?: MdpMntPostingStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
