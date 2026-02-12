import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataItemDto } from './create-master-data-item.dto';

export class UpdateMasterDataItemDto extends PartialType(CreateMasterDataItemDto) {}
