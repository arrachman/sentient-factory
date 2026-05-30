import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

/** One item storage placement (legacy "Lokasi" tab: Gudang + Lokasi). */
export class ItemLocationDto {
  @ApiProperty({ example: '1', description: 'Warehouse ID (Gudang, BigInt as string)' })
  @IsString()
  @IsNotEmpty()
  warehouseId!: string;

  @ApiProperty({ example: '1', description: 'Location ID (Lokasi, BigInt as string)' })
  @IsString()
  @IsNotEmpty()
  locationId!: string;
}
