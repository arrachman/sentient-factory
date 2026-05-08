import { ApiPropertyOptional, OmitType, PartialType } from '@nestjs/swagger';
import { CreatePsikologDto } from './create-psikolog.dto';

/**
 * Update DTO — semua field opsional. Tapi exclude:
 * - `email` & `username` → immutable identifier (hindari conflict)
 * - `password` → ganti via endpoint terpisah (security)
 */
export class UpdatePsikologDto extends PartialType(
  OmitType(CreatePsikologDto, ['email', 'username', 'password'] as const),
) {}
