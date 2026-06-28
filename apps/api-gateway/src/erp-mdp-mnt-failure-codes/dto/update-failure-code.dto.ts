import { PartialType } from '@nestjs/swagger';
import { CreateMntFailureCodeDto } from './create-failure-code.dto';

export class UpdateMntFailureCodeDto extends PartialType(CreateMntFailureCodeDto) {}
