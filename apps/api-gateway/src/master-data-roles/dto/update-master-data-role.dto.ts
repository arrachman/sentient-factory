import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataRoleDto } from './create-master-data-role.dto';

export class UpdateMasterDataRoleDto extends PartialType(CreateMasterDataRoleDto) {}
