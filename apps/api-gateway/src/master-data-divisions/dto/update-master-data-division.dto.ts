import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataDivisionDto } from './create-master-data-division.dto';

export class UpdateMasterDataDivisionDto extends PartialType(CreateMasterDataDivisionDto) {}
