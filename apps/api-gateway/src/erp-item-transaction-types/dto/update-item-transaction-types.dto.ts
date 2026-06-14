import { PartialType } from '@nestjs/swagger';
import { CreateErpItemTransactionTypeDto } from './create-item-transaction-types.dto';

export class UpdateErpItemTransactionTypeDto extends PartialType(CreateErpItemTransactionTypeDto) {}
