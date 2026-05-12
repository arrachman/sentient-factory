import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';

@Injectable()
export class DashboardCustomDbService {
  private readonly logger = new Logger(DashboardCustomDbService.name);

  constructor(private readonly prisma: PrismaService) {}

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
    const dashboardKey = (body?.dashboardKey || '').trim();
    const title = (body?.title || '').trim();
    const description = (body?.description || '').trim();
    const widgetKind = (body?.widgetKind || 'table').trim();
    const chartType = (body?.chartType || '').trim();
    const spanClassName = (body?.spanClassName || 'lg:col-span-6').trim() || 'lg:col-span-6';
    const sqlTemplate = (body?.sqlTemplate || '').trim();
    const outputColumns = Array.isArray(body?.outputColumns)
      ? body.outputColumns.filter(
          (value): value is string => typeof value === 'string' && value.trim().length > 0,
        )
      : [];
    const queryLabel = (body?.queryLabel || title || 'Pinned Widget Query').trim();

    if (!dashboardKey || !title || !sqlTemplate) {
      throw new BadRequestException('dashboardKey, title, dan sqlTemplate wajib diisi.');
    }
    if (!/^(select|with)\b/i.test(sqlTemplate)) {
      throw new BadRequestException('Hanya query SELECT/WITH yang dapat di-pin.');
    }

    const nowSuffix = Date.now().toString().slice(-8);
    const baseKey = this.slugify(title) || 'pinned-widget';
    const widgetKey = `${baseKey}-${nowSuffix}`;
    const queryKey = `${widgetKey}-main`;
    const normalizedWidgetKind = ['chart', 'table', 'list', 'summary', 'metric'].includes(
      widgetKind,
    )
      ? widgetKind
      : 'table';
    const normalizedChartType =
      normalizedWidgetKind === 'chart' &&
      ['bar', 'vertical_bar', 'line', 'pie', 'donut', 'area', 'horizontal_bar', 'scatter'].includes(
        chartType,
      )
        ? chartType
        : normalizedWidgetKind === 'chart'
          ? 'bar'
          : '';

    const dashboardId = await this.findOrCreateCustomDashboardId(dashboardKey);
    const orderRows = await this.prisma.$queryRawUnsafe<Array<{ next_widget_order: number }>>(`
      SELECT COALESCE(MAX(widget_order), 0) + 1 AS next_widget_order
      FROM public.dashboard_widget
      WHERE dashboard_id = ${dashboardId}
    `);
    const widgetOrder = Number(orderRows[0]?.next_widget_order || 1);
    const uiConfigJson = JSON.stringify({
      component: normalizedWidgetKind === 'chart' ? 'PinnedChartCard' : 'PinnedTableCard',
    });

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (
        dashboard_id,
        widget_key,
        title,
        short_label,
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        widget_order,
        is_active
      )
      VALUES (
        ${dashboardId},
        '${escapeSqlLiteral(widgetKey)}',
        '${escapeSqlLiteral(title)}',
        '${escapeSqlLiteral(title.slice(0, 48))}',
        ${description ? `'${escapeSqlLiteral(description)}'` : 'NULL'},
        '${escapeSqlLiteral(normalizedWidgetKind)}',
        ${normalizedChartType ? `'${escapeSqlLiteral(normalizedChartType)}'` : 'NULL'},
        NULL,
        '${escapeSqlLiteral(normalizedWidgetKind === 'chart' ? 'categorical' : 'table')}',
        '${escapeSqlLiteral(uiConfigJson)}'::jsonb,
        '[]'::jsonb,
        'No pinned widget data yet.',
        '${escapeSqlLiteral(spanClassName)}',
        ${widgetOrder},
        true
      )
      RETURNING widget_id::text
    `);
    const widgetId = insertedRows[0]?.widget_id;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard_widget_query (
        widget_id,
        query_key,
        label,
        purpose,
        sql_template,
        count_sql,
        query_params,
        output_columns,
        default_limit,
        is_active
      )
      VALUES (
        ${widgetId},
        '${escapeSqlLiteral(queryKey)}',
        '${escapeSqlLiteral(queryLabel)}',
        'Pinned from Senti AI',
        '${escapeSqlLiteral(sqlTemplate)}',
        NULL,
        '[]'::jsonb,
        '${escapeSqlLiteral(JSON.stringify(outputColumns))}'::jsonb,
        50,
        true
      )
    `);

    return {
      success: true,
      data: {
        dashboard_key: dashboardKey,
        widget_key: widgetKey,
        query_key: queryKey,
      },
    };
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
    const widgetIdSql = escapeSqlLiteral(widgetId);
    const title = typeof body?.title === 'string' ? body.title.trim() : '';
    const description =
      typeof body?.description === 'string'
        ? body.description.trim()
        : body?.description === null
          ? ''
          : '';
    const spanClassName =
      typeof body?.spanClassName === 'string' && body.spanClassName.trim()
        ? body.spanClassName.trim()
        : null;
    const widgetOrder =
      typeof body?.widgetOrder === 'number' && Number.isFinite(body.widgetOrder)
        ? Math.max(1, Math.floor(body.widgetOrder))
        : null;
    const chartType =
      typeof body?.chartType === 'string' && body.chartType.trim()
        ? body.chartType.trim().toLowerCase()
        : body?.chartType === null
          ? ''
          : null;
    const defaultLimit =
      typeof body?.defaultLimit === 'number' && Number.isFinite(body.defaultLimit)
        ? Math.max(1, Math.floor(body.defaultLimit))
        : body?.defaultLimit === null
          ? null
          : undefined;

    if (
      !title &&
      !spanClassName &&
      widgetOrder === null &&
      body?.description === undefined &&
      chartType === null &&
      defaultLimit === undefined
    ) {
      throw new BadRequestException('Tidak ada perubahan yang dikirim.');
    }

    const existingRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      SELECT widget_id::text
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);
    if (!existingRows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

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
    if (spanClassName) {
      updates.push(`span_class_name = '${escapeSqlLiteral(spanClassName)}'`);
    }
    if (widgetOrder !== null) {
      updates.push(`widget_order = ${widgetOrder}`);
    }
    if (chartType !== null) {
      const normalizedChartType = [
        'bar',
        'vertical_bar',
        'line',
        'pie',
        'donut',
        'area',
        'horizontal_bar',
        'scatter',
      ].includes(chartType)
        ? chartType
        : '';
      updates.push(
        normalizedChartType ? `chart_type = '${normalizedChartType}'` : 'chart_type = NULL',
      );
      updates.push(
        normalizedChartType
          ? "widget_kind = CASE WHEN widget_kind IN ('table', 'list', 'summary', 'metric') THEN widget_kind ELSE 'chart' END"
          : 'widget_kind = widget_kind',
      );
    }

    if (updates.length) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.dashboard_widget
        SET ${updates.join(', ')}
        WHERE widget_id::text = '${widgetIdSql}'
      `);
    }

    if (defaultLimit !== undefined) {
      await this.prisma.$executeRawUnsafe(`
        UPDATE public.dashboard_widget_query
        SET default_limit = ${defaultLimit === null ? 'NULL' : defaultLimit}
        WHERE widget_id IN (
          SELECT widget_id
          FROM public.dashboard_widget
          WHERE widget_id::text = '${widgetIdSql}'
        )
      `);
    }

    return { success: true };
  }

  async deleteCustomDbWidget(widgetId: string) {
    const widgetIdSql = escapeSqlLiteral(widgetId);
    const rows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      SELECT widget_id::text
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);
    if (!rows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    await this.prisma.$executeRawUnsafe(`
      DELETE FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
    `);

    return { success: true };
  }

  async duplicateCustomDbWidget(widgetId: string) {
    const widgetIdSql = escapeSqlLiteral(widgetId);
    const sourceRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        w.widget_id::text,
        w.dashboard_id::text,
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
        COALESCE(w.empty_state, '') AS empty_state
      FROM public.dashboard_widget w
      WHERE w.widget_id::text = '${widgetIdSql}'
      LIMIT 1
    `);

    if (!sourceRows.length) {
      throw new NotFoundException('Widget tidak ditemukan.');
    }

    const source = sourceRows[0];
    const dashboardId = String(source.dashboard_id);
    const orderRows = await this.prisma.$queryRawUnsafe<Array<{ next_widget_order: number }>>(`
      SELECT COALESCE(MAX(widget_order), 0) + 1 AS next_widget_order
      FROM public.dashboard_widget
      WHERE dashboard_id = ${dashboardId}
    `);
    const nextOrder = Number(orderRows[0]?.next_widget_order || 1);
    const nowSuffix = Date.now().toString().slice(-8);
    const duplicatedTitle = `${String(source.title || 'Widget')} Copy`;
    const duplicatedWidgetKey = `${this.slugify(duplicatedTitle) || 'widget-copy'}-${nowSuffix}`;

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (
        dashboard_id,
        widget_key,
        title,
        short_label,
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        widget_order,
        is_active
      )
      SELECT
        dashboard_id,
        '${escapeSqlLiteral(duplicatedWidgetKey)}',
        '${escapeSqlLiteral(duplicatedTitle)}',
        '${escapeSqlLiteral(duplicatedTitle.slice(0, 48))}',
        description,
        widget_kind,
        chart_type,
        source_table,
        result_kind,
        ui_config,
        filter_binding,
        empty_state,
        span_class_name,
        ${nextOrder},
        true
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      RETURNING widget_id::text
    `);

    const duplicatedWidgetId = insertedRows[0]?.widget_id;
    const queryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT
        query_key,
        label,
        COALESCE(purpose, '') AS purpose,
        sql_template,
        count_sql,
        query_params,
        output_columns,
        default_limit
      FROM public.dashboard_widget_query
      WHERE widget_id::text = '${widgetIdSql}'
        AND is_active = true
      ORDER BY query_key
    `);

    for (let index = 0; index < queryRows.length; index += 1) {
      const query = queryRows[index];
      const duplicateQueryKey =
        index === 0 ? `${duplicatedWidgetKey}-main` : `${duplicatedWidgetKey}-${index + 1}`;
      const duplicateQueryLabel = `${duplicatedTitle} Query${index > 0 ? ` ${index + 1}` : ''}`;
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.dashboard_widget_query (
          widget_id,
          query_key,
          label,
          purpose,
          sql_template,
          count_sql,
          query_params,
          output_columns,
          default_limit,
          is_active
        )
        VALUES (
          ${duplicatedWidgetId},
          '${escapeSqlLiteral(duplicateQueryKey)}',
          '${escapeSqlLiteral(duplicateQueryLabel)}',
          ${query.purpose ? `'${escapeSqlLiteral(String(query.purpose))}'` : 'NULL'},
          '${escapeSqlLiteral(String(query.sql_template || ''))}',
          ${query.count_sql ? `'${escapeSqlLiteral(String(query.count_sql))}'` : 'NULL'},
          '${escapeSqlLiteral(JSON.stringify(asJson(query.query_params, [])))}'::jsonb,
          '${escapeSqlLiteral(JSON.stringify(asJson(query.output_columns, [])))}'::jsonb,
          ${query.default_limit ?? 'NULL'},
          true
        )
      `);
    }

    return {
      success: true,
      data: {
        widget_id: duplicatedWidgetId,
        widget_key: duplicatedWidgetKey,
      },
    };
  }

  private slugify(value: string) {
    return value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .slice(0, 48);
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

  private async findOrCreateCustomDashboardId(dashboardKey: string) {
    const identifier = escapeSqlLiteral(dashboardKey);
    const routeSegment = escapeSqlLiteral(this.resolveRouteSegment(dashboardKey));

    let rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (rows.length) {
      return rows[0].dashboard_id;
    }

    const menuRows = await this.prisma.$queryRawUnsafe<Array<{ id: string; title: string }>>(`
      SELECT id::text, title
      FROM public.m0_menu
      WHERE is_active = true
        AND (
          key = '${identifier}'
          OR COALESCE(path, '') = '${identifier}'
          OR COALESCE(split_part(path, '/', array_length(string_to_array(path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (!menuRows.length) {
      throw new NotFoundException(`Dashboard/menu ${dashboardKey} tidak ditemukan.`);
    }

    const menuId = menuRows[0].id;
    const menuTitle = menuRows[0].title || dashboardKey;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard (
        menu_id,
        dashboard_key,
        title,
        short_label,
        description,
        icon_name,
        status,
        layout_config,
        default_filter_values,
        is_active
      )
      VALUES (
        ${menuId},
        '${identifier}',
        '${escapeSqlLiteral(menuTitle)}',
        '${escapeSqlLiteral(String(menuTitle).slice(0, 48))}',
        'Dashboard page generated from menu target.',
        'LayoutDashboard',
        'active',
        '{}'::jsonb,
        '{}'::jsonb,
        true
      )
      ON CONFLICT (dashboard_key) DO UPDATE
      SET menu_id = EXCLUDED.menu_id,
          title = EXCLUDED.title,
          short_label = EXCLUDED.short_label,
          is_active = true
    `);

    rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text
      FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE d.is_active = true
        AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )
      LIMIT 1
    `);

    if (!rows.length) {
      throw new InternalServerErrorException(`Dashboard ${dashboardKey} gagal dibuat.`);
    }

    return rows[0].dashboard_id;
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

  private resolveRouteSegment(value: string) {
    const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) {
      return '';
    }
    const parts = trimmed.split('/');
    return parts[parts.length - 1] || '';
  }
}
