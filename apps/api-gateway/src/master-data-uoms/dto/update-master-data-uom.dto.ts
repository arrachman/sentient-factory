import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataUomDto } from './create-master-data-uom.dto';

export class UpdateMasterDataUomDto extends PartialType(CreateMasterDataUomDto) {}
