import { PartialType } from '@nestjs/swagger';
import { CreateMasterDataPermissionDto } from './create-master-data-permission.dto';

export class UpdateMasterDataPermissionDto extends PartialType(CreateMasterDataPermissionDto) {}
