import { PartialType } from '@nestjs/swagger';
import { CreateQmsCapaActionDto } from './create-capa-action.dto';

export class UpdateQmsCapaActionDto extends PartialType(CreateQmsCapaActionDto) {}
