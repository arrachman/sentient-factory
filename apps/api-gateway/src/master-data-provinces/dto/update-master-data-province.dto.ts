import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataProvinceDto } from './create-master-data-province.dto';

export class UpdateMasterDataProvinceDto extends PartialType(CreateMasterDataProvinceDto) {}
