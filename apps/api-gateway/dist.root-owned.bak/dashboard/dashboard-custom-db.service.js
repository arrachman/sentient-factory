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
exports.DashboardCustomDbService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const dashboard_utils_1 = require("./dashboard.utils");
const dashboard_custom_db_widget_service_1 = require("./dashboard-custom-db-widget.service");
let DashboardCustomDbService = class DashboardCustomDbService {
    prisma;
    customDbWidgetService;
    constructor(prisma, customDbWidgetService) {
        this.prisma = prisma;
        this.customDbWidgetService = customDbWidgetService;
    }
    async customDbPinTargets() {
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT
        COALESCE(d.dashboard_id::text, '') AS dashboard_id,
        COALESCE(d.dashboard_key, m.key) AS dashboard_key,
        COALESCE(d.title, m.title) AS dashboard_title,
        m.id::text AS menu_id,
        m.key AS menu_key,
        m.title AS menu_title,
        COALESCE(m.path, '') AS route_path
      FROM public.m0_menu m
      LEFT JOIN public.m0_menu parent
        ON parent.id = m.parent_id
      LEFT JOIN public.dashboard d
        ON d.menu_id = m.id
       AND d.is_active = true
      WHERE m.is_active = true
        AND COALESCE(m.is_visible, true) = true
        AND COALESCE(m.path, '') <> ''
        AND (
          parent.key = 'dashboard'
          OR m.key = 'dashboard'
          OR m.path LIKE '/app/dashboard/%'
        )
      ORDER BY m.sort_order NULLS LAST, m.id
    `);
        return { success: true, data: rows };
    }
    async customDbCatalog(dashboardKey) {
        const identifier = (0, dashboard_utils_1.escapeSqlLiteral)(dashboardKey);
        const dashboardRows = await this.prisma.$queryRawUnsafe(this.buildCustomDashboardLookupSql(identifier));
        if (!dashboardRows.length) {
            throw new common_1.NotFoundException(`Dashboard ${dashboardKey} not found.`);
        }
        const dashboard = dashboardRows[0];
        const resolvedDashboardKey = String(dashboard.dashboard_key || dashboardKey);
        const widgets = await this.prisma.$queryRawUnsafe(`
      SELECT
        w.widget_id::text,
        w.widget_key,
        w.title,
        w.short_label,
        COALESCE(w.description, '') AS description,
        w.widget_kind,
        COALESCE(w.chart_type, '') AS chart_type,
        COALESCE(w.source_table, '') AS source_table,
        w.result_kind,
        w.ui_config,
        w.filter_binding,
        COALESCE(w.empty_state, '') AS empty_state,
        COALESCE(w.span_class_name, '') AS span_class_name,
        w.widget_order
      FROM public.dashboard_widget w
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(resolvedDashboardKey)}'
        AND w.is_active = true
      ORDER BY w.widget_order, w.widget_key
    `);
        const widgetQueries = await this.prisma.$queryRawUnsafe(`
      SELECT
        q.widget_id::text,
        q.query_key,
        q.label,
        COALESCE(q.purpose, '') AS purpose,
        q.sql_template,
        COALESCE(q.count_sql, '') AS count_sql,
        q.query_params,
        q.output_columns,
        q.default_limit
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(resolvedDashboardKey)}'
        AND q.is_active = true
      ORDER BY q.query_key
    `);
        const filters = await this.prisma.$queryRawUnsafe(`
      SELECT
        f.filter_key,
        f.label,
        f.filter_type,
        f.data_type,
        f.source_type,
        COALESCE(f.source_table, '') AS source_table,
        COALESCE(f.source_query, '') AS source_query,
        f.static_options,
        COALESCE(f.placeholder, '') AS placeholder,
        f.query_param_name,
        f.default_value,
        COALESCE(f.depends_on_filter_key, '') AS depends_on_filter_key,
        f.allows_multiple,
        f.is_required,
        f.sort_order
      FROM public.dashboard_filter f
      JOIN public.dashboard d ON d.dashboard_id = f.dashboard_id
      WHERE d.dashboard_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(resolvedDashboardKey)}'
        AND f.is_active = true
      ORDER BY f.sort_order, f.filter_key
    `);
        const widgetsWithQueries = widgets.map((widget) => ({
            ...widget,
            ui_config: (0, dashboard_utils_1.asJson)(widget.ui_config, {}),
            filter_binding: (0, dashboard_utils_1.asJson)(widget.filter_binding, []),
            widget_order: Number(widget.widget_order || 0),
            queries: widgetQueries
                .filter((query) => query.widget_id === widget.widget_id)
                .map((query) => ({
                ...query,
                query_params: (0, dashboard_utils_1.asJson)(query.query_params, []),
                output_columns: (0, dashboard_utils_1.asJson)(query.output_columns, []),
                default_limit: typeof query.default_limit === 'number'
                    ? query.default_limit
                    : query.default_limit
                        ? Number(query.default_limit)
                        : null,
            })),
        }));
        const filtersWithOptions = [];
        for (const filter of filters) {
            let options = (0, dashboard_utils_1.asJson)(filter.static_options, []);
            if (filter.source_type === 'query' &&
                typeof filter.source_query === 'string' &&
                filter.source_query.trim()) {
                const optionRows = await this.prisma.$queryRawUnsafe(filter.source_query);
                options = optionRows
                    .map((row) => row[Object.keys(row)[0]])
                    .filter(Boolean);
            }
            filtersWithOptions.push({
                ...filter,
                static_options: (0, dashboard_utils_1.asJson)(filter.static_options, []),
                default_value: (0, dashboard_utils_1.asJson)(filter.default_value, null),
                allows_multiple: Boolean(filter.allows_multiple),
                is_required: Boolean(filter.is_required),
                sort_order: Number(filter.sort_order || 0),
                options,
            });
        }
        return {
            success: true,
            data: {
                ...dashboard,
                layout_config: (0, dashboard_utils_1.asJson)(dashboard.layout_config, {}),
                default_filter_values: (0, dashboard_utils_1.asJson)(dashboard.default_filter_values, {}),
                widgets: widgetsWithQueries,
                filters: filtersWithOptions,
            },
        };
    }
    async updateCustomDbCatalog(dashboardKey, body) {
        const title = typeof body?.title === 'string' ? body.title.trim() : '';
        const description = typeof body?.description === 'string'
            ? body.description.trim()
            : body?.description === null
                ? ''
                : '';
        if (!title && body?.description === undefined) {
            throw new common_1.BadRequestException('Tidak ada perubahan yang dikirim.');
        }
        const dashboardId = await this.findCustomDashboardIdOrThrow(dashboardKey);
        const updates = [];
        if (title) {
            updates.push(`title = '${(0, dashboard_utils_1.escapeSqlLiteral)(title)}'`);
            updates.push(`short_label = '${(0, dashboard_utils_1.escapeSqlLiteral)(title.slice(0, 48))}'`);
        }
        if (body?.description !== undefined) {
            updates.push(description
                ? `description = '${(0, dashboard_utils_1.escapeSqlLiteral)(description)}'`
                : 'description = NULL');
        }
        await this.prisma.$executeRawUnsafe(`
      UPDATE public.dashboard
      SET ${updates.join(', ')}
      WHERE dashboard_id = ${dashboardId}
    `);
        return { success: true };
    }
    async executeCustomDbQuery(dashboardKey, queryKey, params) {
        const resolvedDashboardKey = await this.findResolvedDashboardKeyOrThrow(dashboardKey);
        const rows = await this.prisma.$queryRawUnsafe(`
      SELECT q.sql_template, q.label, q.output_columns
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(resolvedDashboardKey)}'
        AND q.query_key = '${(0, dashboard_utils_1.escapeSqlLiteral)(queryKey)}'
        AND d.is_active = true
        AND w.is_active = true
        AND q.is_active = true
      LIMIT 1
    `);
        if (!rows.length) {
            throw new common_1.NotFoundException('Query metadata not found.');
        }
        const row = rows[0];
        const renderedSql = this.renderSqlTemplate(String(row.sql_template || ''), params);
        const normalizedSql = renderedSql.trim();
        if (!/^(select|with)\b/i.test(normalizedSql)) {
            throw new common_1.BadRequestException('Only SELECT query is allowed.');
        }
        const resultRows = await this.prisma.$queryRawUnsafe(normalizedSql);
        const declaredColumns = (0, dashboard_utils_1.asJson)(row.output_columns, []);
        const columns = resultRows.length ? Object.keys(resultRows[0]) : declaredColumns;
        return {
            success: true,
            data: {
                label: row.label,
                sql: normalizedSql,
                columns,
                rows: resultRows,
            },
        };
    }
    async pinCustomDbWidget(body) {
        return this.customDbWidgetService.pinCustomDbWidget(body);
    }
    async updateCustomDbWidget(widgetId, body) {
        return this.customDbWidgetService.updateCustomDbWidget(widgetId, body);
    }
    async deleteCustomDbWidget(widgetId) {
        return this.customDbWidgetService.deleteCustomDbWidget(widgetId);
    }
    async duplicateCustomDbWidget(widgetId) {
        return this.customDbWidgetService.duplicateCustomDbWidget(widgetId);
    }
    buildCustomDashboardLookupSql(identifier) {
        return `
      SELECT
        d.dashboard_id::text,
        d.menu_id::text,
        COALESCE(m.key, '') AS menu_key,
        COALESCE(m.path, '') AS route_path,
        d.dashboard_key,
        d.title,
        d.short_label,
        COALESCE(d.description, '') AS description,
        COALESCE(d.icon_name, '') AS icon_name,
        d.status,
        d.layout_config,
        d.default_filter_values
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${identifier}'
        )
      ORDER BY CASE WHEN d.dashboard_key = '${identifier}' THEN 0 ELSE 1 END
      LIMIT 1
    `;
    }
    async findCustomDashboardIdOrThrow(dashboardKey) {
        const rows = await this.prisma.$queryRawUnsafe(this.buildCustomDashboardLookupSql((0, dashboard_utils_1.escapeSqlLiteral)(dashboardKey)));
        if (!rows.length) {
            throw new common_1.NotFoundException(`Dashboard ${dashboardKey} not found.`);
        }
        return rows[0].dashboard_id;
    }
    async findResolvedDashboardKeyOrThrow(dashboardKey) {
        const rows = await this.prisma.$queryRawUnsafe(this.buildCustomDashboardLookupSql((0, dashboard_utils_1.escapeSqlLiteral)(dashboardKey)));
        if (!rows.length) {
            throw new common_1.NotFoundException(`Dashboard ${dashboardKey} not found.`);
        }
        return rows[0].dashboard_key;
    }
    renderSqlTemplate(template, params) {
        return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
            const raw = params[key];
            if (raw === 'Semua Warehouse') {
                return "''";
            }
            return this.toSqlLiteral(raw);
        });
    }
    toSqlLiteral(value) {
        if (value === null || value === undefined || value === '') {
            return 'NULL';
        }
        if (typeof value === 'number') {
            return Number.isFinite(value) ? String(value) : 'NULL';
        }
        if (typeof value === 'boolean') {
            return value ? 'TRUE' : 'FALSE';
        }
        return `'${(0, dashboard_utils_1.escapeSqlLiteral)(String(value))}'`;
    }
};
exports.DashboardCustomDbService = DashboardCustomDbService;
exports.DashboardCustomDbService = DashboardCustomDbService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        dashboard_custom_db_widget_service_1.DashboardCustomDbWidgetService])
], DashboardCustomDbService);
//# sourceMappingURL=dashboard-custom-db.service.js.map