import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { MdpQmsCapaType, MdpQmsCapaStatus } from '@prisma/client';
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateQmsCapaActionDto {
  @ApiProperty({ example: "CAPA-2606-0001" })
  @IsString()
  @MaxLength(50)
  code!: string;

  @ApiProperty()
  @IsString()
  @MaxLength(200)
  name!: string;

  @ApiPropertyOptional({ description: "qms_nonconformances id" })
  @IsOptional()
  @IsString()
  nonconformanceId?: string;

  @ApiPropertyOptional({ enum: MdpQmsCapaType })
  @IsOptional()
  @IsEnum(MdpQmsCapaType)
  type?: MdpQmsCapaType;

  @ApiPropertyOptional({ enum: MdpQmsCapaStatus })
  @IsOptional()
  @IsEnum(MdpQmsCapaStatus)
  status?: MdpQmsCapaStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  rootCause?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  actionPlan?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  completedAt?: string;

  @ApiPropertyOptional({ description: "adm_users id" })
  @IsOptional()
  @IsString()
  verifiedById?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsDateString()
  verifiedAt?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  effectiveness?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  notes?: string;
}
