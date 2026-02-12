import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataContactDto } from './create-master-data-contact.dto';

export class UpdateMasterDataContactDto extends PartialType(CreateMasterDataContactDto) {}
