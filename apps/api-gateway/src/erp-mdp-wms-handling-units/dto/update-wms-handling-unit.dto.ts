import { PartialType } from '@nestjs/swagger';
import { CreateWmsHandlingUnitDto } from './create-wms-handling-unit.dto';

export class UpdateWmsHandlingUnitDto extends PartialType(CreateWmsHandlingUnitDto) {}
