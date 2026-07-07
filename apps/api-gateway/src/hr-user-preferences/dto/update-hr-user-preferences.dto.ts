import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsObject, IsOptional, IsString, Length } from 'class-validator';

/**
 * Update body for PUT /hr/user-preferences/me.
 * Mirrors adm_user_preferences shape: theme/language first-class, the rest of
 * the Setting → Tampilan tweaks (primary, density, fontScale, sidebar,
 * sidebarMenu, urlRouting) ride in `metadata` JSON — exactly what web-hr's
 * `use-appearance` sends.
 */
export class UpdateHrUserPreferencesDto {
  @ApiPropertyOptional({ description: 'UI theme (light | dark)' })
  @IsOptional()
  @IsString()
  theme?: string;

  @ApiPropertyOptional({ description: 'UI language (id | en | ja)' })
  @IsOptional()
  @IsString()
  @Length(2, 10)
  language?: string;

  @ApiPropertyOptional({
    description:
      'Free-form JSON for appearance tweaks (primary, density, fontScale, sidebar, sidebarMenu, urlRouting).',
  })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
