import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { escapeSqlLiteral, asJson } from './dashboard.utils';

@Injectable()
export class AlertingMetricService {
  constructor(private readonly prisma: PrismaService) {}

  async alertingBusinessMetrics(moduleKey?: string) {
    const where = ['deleted_at IS NULL', 'is_active = true'];
    if (moduleKey && moduleKey !== 'all') {
      where.push(`module_key = '${escapeSqlLiteral(moduleKey)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        metric_id, metric_key, label, short_label, module_key, description,
        business_definition, unit, value_type, comparison_type, source_type,
        source_ref, semantic_ref, system_metric_ref, supported_dimensions,
        default_filters, tags, owner_name, review_status
      FROM public.metric_business_registry
      WHERE ${where.join(' AND ')}
      ORDER BY module_key, sort_order, label
    `);

    return { success: true, data: rows.map((row) => this.mapAlertingBusinessMetricRow(row)) };
  }

  async alertingSystemMetrics(moduleKey?: string) {
    const where = ['deleted_at IS NULL', 'is_active = true'];
    if (moduleKey && moduleKey !== 'all') {
      where.push(`module_key = '${escapeSqlLiteral(moduleKey)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        system_metric_id, metric_key, label, module_key, description, source_table,
        source_type, resolver_key, aggregation_type, value_type, supported_dimensions,
        supported_filters, default_filters, tags, owner_name, review_status
      FROM public.metric_system_registry
      WHERE ${where.join(' AND ')}
      ORDER BY module_key, sort_order, label
    `);

    return { success: true, data: rows.map((row) => this.mapAlertingSystemMetricRow(row)) };
  }

  async alertingMetricBuilderContext(moduleKey?: string, metricKey?: string) {
    const where = ['is_active = true'];
    if (moduleKey && moduleKey !== 'all') {
      where.push(`module_key = '${escapeSqlLiteral(moduleKey)}'`);
    }
    if (metricKey) {
      where.push(`metric_key = '${escapeSqlLiteral(metricKey)}'`);
    }

    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        metric_id, metric_key, label, short_label, module_key, description,
        business_definition, unit, value_type, comparison_type, semantic_ref,
        canonical_semantic_key, semantic_label, semantic_entity_key, semantic_measure_key,
        semantic_definition, semantic_calculation_summary, system_metric_ref,
        system_metric_label, system_source_table, system_aggregation_type, source_type,
        source_ref, supported_dimensions, default_filters, tags, owner_name, review_status,
        goal_count, goals, condition_mapping_count, condition_mappings
      FROM public.v_metric_alert_builder_context
      WHERE ${where.join(' AND ')}
      ORDER BY module_key, sort_order, label
    `);

    return { success: true, data: rows.map((row) => this.mapAlertingMetricBuilderContextRow(row)) };
  }

  // ── Private helpers ──────────────────────────────────────────────────────────

  private mapAlertingBusinessMetricRow(row: Record<string, unknown>) {
    return {
      metric_id: Number(row.metric_id || 0),
      metric_key: row.metric_key,
      label: row.label,
      short_label: row.short_label,
      module_key: row.module_key,
      description: row.description,
      business_definition: row.business_definition,
      unit: row.unit,
      value_type: row.value_type,
      comparison_type: row.comparison_type,
      source_type: row.source_type,
      source_ref: row.source_ref,
      semantic_ref: row.semantic_ref,
      system_metric_ref: row.system_metric_ref,
      supported_dimensions: asJson(row.supported_dimensions, []),
      default_filters: asJson(row.default_filters, {}),
      tags: asJson(row.tags, []),
      owner_name: row.owner_name,
      review_status: row.review_status,
    };
  }

  private mapAlertingSystemMetricRow(row: Record<string, unknown>) {
    return {
      system_metric_id: Number(row.system_metric_id || 0),
      metric_key: row.metric_key,
      label: row.label,
      module_key: row.module_key,
      description: row.description,
      source_table: row.source_table,
      source_type: row.source_type,
      resolver_key: row.resolver_key,
      aggregation_type: row.aggregation_type,
      value_type: row.value_type,
      supported_dimensions: asJson(row.supported_dimensions, []),
      supported_filters: asJson(row.supported_filters, []),
      default_filters: asJson(row.default_filters, {}),
      tags: asJson(row.tags, []),
      owner_name: row.owner_name,
      review_status: row.review_status,
    };
  }

  private mapAlertingMetricBuilderContextRow(row: Record<string, unknown>) {
    return {
      metric_id: Number(row.metric_id || 0),
      metric_key: row.metric_key,
      label: row.label,
      short_label: row.short_label,
      module_key: row.module_key,
      description: row.description,
      business_definition: row.business_definition,
      unit: row.unit,
      value_type: row.value_type,
      comparison_type: row.comparison_type,
      semantic_ref: row.semantic_ref,
      canonical_semantic_key: row.canonical_semantic_key,
      semantic_label: row.semantic_label,
      semantic_entity_key: row.semantic_entity_key,
      semantic_measure_key: row.semantic_measure_key,
      semantic_definition: row.semantic_definition,
      semantic_calculation_summary: row.semantic_calculation_summary,
      system_metric_ref: row.system_metric_ref,
      system_metric_label: row.system_metric_label,
      system_source_table: row.system_source_table,
      system_aggregation_type: row.system_aggregation_type,
      source_type: row.source_type,
      source_ref: row.source_ref,
      supported_dimensions: asJson(row.supported_dimensions, []),
      default_filters: asJson(row.default_filters, {}),
      tags: asJson(row.tags, []),
      owner_name: row.owner_name,
      review_status: row.review_status,
      goal_count: Number(row.goal_count || 0),
      goals: asJson(row.goals, []),
      condition_mapping_count: Number(row.condition_mapping_count || 0),
      condition_mappings: asJson(row.condition_mappings, []),
    };
  }
}
