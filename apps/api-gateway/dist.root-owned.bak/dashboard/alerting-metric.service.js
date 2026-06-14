"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertingMetricService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
let AlertingMetricService = class AlertingMetricService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async alertingBusinessMetrics(moduleKey) {
        const where = ['deleted_at IS NULL', 'is_active = true'];
        if (moduleKey && moduleKey !== 'all') {
            where.push(`module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}'`);
        }
        const rows = await this.prisma.$queryRawUnsafe(`
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
    async alertingSystemMetrics(moduleKey) {
        const where = ['deleted_at IS NULL', 'is_active = true'];
        if (moduleKey && moduleKey !== 'all') {
            where.push(`module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}'`);
        }
        const rows = await this.prisma.$queryRawUnsafe(`
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
    async alertingMetricBuilderContext(moduleKey, metricKey) {
        const where = ['is_active = true'];
        if (moduleKey && moduleKey !== 'all') {
            where.push(`module_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(moduleKey)}'`);
        }
        if (metricKey) {
            where.push(`metric_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(metricKey)}'`);
        }
        const rows = await this.prisma.$queryRawUnsafe(`
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
    mapAlertingBusinessMetricRow(row) {
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
            supported_dimensions: (0, dashboard_utils_1.asJson)(row.supported_dimensions, []),
            default_filters: (0, dashboard_utils_1.asJson)(row.default_filters, {}),
            tags: (0, dashboard_utils_1.asJson)(row.tags, []),
            owner_name: row.owner_name,
            review_status: row.review_status,
        };
    }
    mapAlertingSystemMetricRow(row) {
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
            supported_dimensions: (0, dashboard_utils_1.asJson)(row.supported_dimensions, []),
            supported_filters: (0, dashboard_utils_1.asJson)(row.supported_filters, []),
            default_filters: (0, dashboard_utils_1.asJson)(row.default_filters, {}),
            tags: (0, dashboard_utils_1.asJson)(row.tags, []),
            owner_name: row.owner_name,
            review_status: row.review_status,
        };
    }
    mapAlertingMetricBuilderContextRow(row) {
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
            supported_dimensions: (0, dashboard_utils_1.asJson)(row.supported_dimensions, []),
            default_filters: (0, dashboard_utils_1.asJson)(row.default_filters, {}),
            tags: (0, dashboard_utils_1.asJson)(row.tags, []),
            owner_name: row.owner_name,
            review_status: row.review_status,
            goal_count: Number(row.goal_count || 0),
            goals: (0, dashboard_utils_1.asJson)(row.goals, []),
            condition_mapping_count: Number(row.condition_mapping_count || 0),
            condition_mappings: (0, dashboard_utils_1.asJson)(row.condition_mappings, []),
        };
    }
};
exports.AlertingMetricService = AlertingMetricService;
exports.AlertingMetricService = AlertingMetricService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AlertingMetricService);
//# sourceMappingURL=alerting-metric.service.js.map