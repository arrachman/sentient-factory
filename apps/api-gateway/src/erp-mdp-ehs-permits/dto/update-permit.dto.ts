import { PartialType } from '@nestjs/swagger';
import { CreateEhsPermitDto } from './create-permit.dto';

export class UpdateEhsPermitDto extends PartialType(CreateEhsPermitDto) {}
