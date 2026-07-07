import { PartialType } from '@nestjs/swagger';
import { CreateDmsDocumentDto } from './create-document.dto';

export class UpdateDmsDocumentDto extends PartialType(CreateDmsDocumentDto) {}
