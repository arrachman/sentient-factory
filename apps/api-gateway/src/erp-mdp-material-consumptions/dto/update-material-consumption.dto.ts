import { PartialType } from '@nestjs/swagger';
import { CreateMaterialConsumptionDto } from './create-material-consumption.dto';

export class UpdateMaterialConsumptionDto extends PartialType(CreateMaterialConsumptionDto) {}
