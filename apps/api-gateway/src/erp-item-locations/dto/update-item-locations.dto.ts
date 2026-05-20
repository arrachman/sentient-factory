import { PartialType } from '@nestjs/swagger';
import { CreateErpItemLocationDto } from './create-item-locations.dto';

export class UpdateErpItemLocationDto extends PartialType(CreateErpItemLocationDto) {}
