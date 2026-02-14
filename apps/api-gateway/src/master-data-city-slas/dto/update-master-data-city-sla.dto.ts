import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataCitySlaDto } from './create-master-data-city-sla.dto';

export class UpdateMasterDataCitySlaDto extends PartialType(CreateMasterDataCitySlaDto) {}
