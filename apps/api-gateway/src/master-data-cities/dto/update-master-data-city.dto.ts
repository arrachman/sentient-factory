import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataCityDto } from './create-master-data-city.dto';

export class UpdateMasterDataCityDto extends PartialType(CreateMasterDataCityDto) {}
