import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataWarehouseDto } from './create-master-data-warehouse.dto';

export class UpdateMasterDataWarehouseDto extends PartialType(CreateMasterDataWarehouseDto) {}
