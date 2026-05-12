import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';
import { DashboardCustomDbWidgetService } from './dashboard-custom-db-widget.service';

@Injectable()
export class DashboardCustomDbService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly customDbWidgetService: DashboardCustomDbWidgetService,
  ) {}

  async customDbPinTargets() {
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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

  async customDbCatalog(dashboardKey: string) {
    const identifier = escapeSqlLiteral(dashboardKey);
    const dashboardRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
      this.buildCustomDashboardLookupSql(identifier),
    );

    if (!dashboardRows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }

    const dashboard = dashboardRows[0];
    const resolvedDashboardKey = String(dashboard.dashboard_key || dashboardKey);

    const widgets = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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
      WHERE d.dashboard_key = '${escapeSqlLiteral(resolvedDashboardKey)}'
        AND w.is_active = true
      ORDER BY w.widget_order, w.widget_key
    `);

    const widgetQueries = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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
      WHERE d.dashboard_key = '${escapeSqlLiteral(resolvedDashboardKey)}'
        AND q.is_active = true
      ORDER BY q.query_key
    `);

    const filters = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
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
      WHERE d.dashboard_key = '${escapeSqlLiteral(resolvedDashboardKey)}'
        AND f.is_active = true
      ORDER BY f.sort_order, f.filter_key
    `);

    const widgetsWithQueries = widgets.map((widget) => ({
      ...widget,
      ui_config: asJson(widget.ui_config, {}),
      filter_binding: asJson(widget.filter_binding, []),
      widget_order: Number(widget.widget_order || 0),
      queries: widgetQueries
        .filter((query) => query.widget_id === widget.widget_id)
        .map((query) => ({
          ...query,
          query_params: asJson(query.query_params, []),
          output_columns: asJson(query.output_columns, []),
          default_limit:
            typeof query.default_limit === 'number'
              ? query.default_limit
              : query.default_limit
                ? Number(query.default_limit)
                : null,
        })),
    }));

    const filtersWithOptions: Array<Record<string, unknown>> = [];
    for (const filter of filters) {
      let options: unknown[] = asJson(filter.static_options, []);
      if (
        filter.source_type === 'query' &&
        typeof filter.source_query === 'string' &&
        filter.source_query.trim()
      ) {
        const optionRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(
          filter.source_query,
        );
        options = optionRows
          .map((row) => row[Object.keys(row)[0] as keyof typeof row])
          .filter(Boolean);
      }
      filtersWithOptions.push({
        ...filter,
        static_options: asJson(filter.static_options, []),
        default_value: asJson(filter.default_value, null),
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
        layout_config: asJson(dashboard.layout_config, {}),
        default_filter_values: asJson(dashboard.default_filter_values, {}),
        widgets: widgetsWithQueries,
        filters: filtersWithOptions,
      },
    };
  }

  async updateCustomDbCatalog(
    dashboardKey: string,
    body: { title?: string; description?: string | null },
  ) {
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body?.description === 'string'
        ? body.description.trim()
        : body?.description === null
          ? ''
          : '';

    if (!title && body?.description === undefined) {
      throw new BadRequestException('Tidak ada perubahan yang dikirim.');
    }

    const dashboardId = await this.findCustomDashboardIdOrThrow(dashboardKey);
    const updates: string[] = [];

    if (title) {
      updates.push(`title = '${escapeSqlLiteral(title)}'`);
      updates.push(`short_label = '${escapeSqlLiteral(title.slice(0, 48))}'`);
    }
    if (body?.description !== undefined) {
      updates.push(
        description
          ? `description = '${escapeSqlLiteral(description)}'`
          : 'description = NULL',
      );
    }

    await this.prisma.$executeRawUnsafe(`
      UPDATE public.dashboard
      SET ${updates.join(', ')}
      WHERE dashboard_id = ${dashboardId}
    `);

    return { success: true };
  }

  async executeCustomDbQuery(
    dashboardKey: string,
    queryKey: string,
    params: Record<string, unknown>,
  ) {
    const resolvedDashboardKey = await this.findResolvedDashboardKeyOrThrow(dashboardKey);
    const rows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT q.sql_template, q.label, q.output_columns
      FROM public.dashboard_widget_query q
      JOIN public.dashboard_widget w ON w.widget_id = q.widget_id
      JOIN public.dashboard d ON d.dashboard_id = w.dashboard_id
      WHERE d.dashboard_key = '${escapeSqlLiteral(resolvedDashboardKey)}'
        AND q.query_key = '${escapeSqlLiteral(queryKey)}'
        AND d.is_active = true
        AND w.is_active = true
        AND q.is_active = true
      LIMIT 1
    `);

    if (!rows.length) {
      throw new NotFoundException('Query metadata not found.');
    }

    const row = rows[0];
    const renderedSql = this.renderSqlTemplate(String(row.sql_template || ''), params);
    const normalizedSql = renderedSql.trim();
    if (!/^(select|with)\b/i.test(normalizedSql)) {
      throw new BadRequestException('Only SELECT query is allowed.');
    }

    const resultRows =
      await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(normalizedSql);
    const declaredColumns = asJson(row.output_columns, []);
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

  async pinCustomDbWidget(body: {
    dashboardKey?: string;
    title?: string;
    description?: string | null;
    widgetKind?: string;
    chartType?: string | null;
    spanClassName?: string | null;
    sqlTemplate?: string;
    outputColumns?: string[];
    queryLabel?: string;
  }) {
    return this.customDbWidgetService.pinCustomDbWidget(body);
  }

  async updateCustomDbWidget(
    widgetId: string,
    body: {
      title?: string;
      description?: string | null;
      spanClassName?: string | null;
      widgetOrder?: number | null;
      chartType?: string | null;
      defaultLimit?: number | null;
    },
  ) {
    return this.customDbWidgetService.updateCustomDbWidget(widgetId, body);
  }

  async deleteCustomDbWidget(widgetId: string) {
    return this.customDbWidgetService.deleteCustomDbWidget(widgetId);
  }

  async duplicateCustomDbWidget(widgetId: string) {
    return this.customDbWidgetService.duplicateCustomDbWidget(widgetId);
  }

  private buildCustomDashboardLookupSql(identifier: string) {
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

  private async findCustomDashboardIdOrThrow(dashboardKey: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(
      this.buildCustomDashboardLookupSql(escapeSqlLiteral(dashboardKey)),
    );
    if (!rows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }
    return rows[0].dashboard_id;
  }

  private async findResolvedDashboardKeyOrThrow(dashboardKey: string) {
    const rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_key: string }>>(
      this.buildCustomDashboardLookupSql(escapeSqlLiteral(dashboardKey)),
    );
    if (!rows.length) {
      throw new NotFoundException(`Dashboard ${dashboardKey} not found.`);
    }
    return rows[0].dashboard_key;
  }

  private renderSqlTemplate(template: string, params: Record<string, unknown>) {
    return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_match, key) => {
      const raw = params[key];
      if (raw === 'Semua Warehouse') {
        return "''";
      }
      return this.toSqlLiteral(raw);
    });
  }

  private toSqlLiteral(value: unknown) {
    if (value === null || value === undefined || value === '') {
      return 'NULL';
    }
    if (typeof value === 'number') {
      return Number.isFinite(value) ? String(value) : 'NULL';
    }
    if (typeof value === 'boolean') {
      return value ? 'TRUE' : 'FALSE';
    }
    return `'${escapeSqlLiteral(String(value))}'`;
  }
}
