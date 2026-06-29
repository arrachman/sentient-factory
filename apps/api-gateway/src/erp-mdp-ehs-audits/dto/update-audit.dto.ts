import { PartialType } from '@nestjs/swagger';
import { CreateEhsAuditDto } from './create-audit.dto';

export class UpdateEhsAuditDto extends PartialType(CreateEhsAuditDto) {}
