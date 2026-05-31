import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** One item branch assignment (legacy "Branch" tab: Cabang + Cost Center). */
export class ItemBranchDto {
  @ApiProperty({ example: '1', description: 'Branch ID (Cabang, BigInt as string)' })
  @IsString()
  @IsNotEmpty()
  branchId!: string;

  @ApiProperty({ example: '1', description: 'Cost center ID (Cost Center, BigInt as string)' })
  @IsString()
  @IsNotEmpty()
  costCenterId!: string;
}
