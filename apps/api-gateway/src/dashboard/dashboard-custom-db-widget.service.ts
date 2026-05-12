import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { asJson, escapeSqlLiteral } from './dashboard.utils';

@Injectable()
export class DashboardCustomDbWidgetService {
  constructor(private readonly prisma: PrismaService) {}

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

    const wCols = `dashboard_id, widget_key, title, short_label, description,
        widget_kind, chart_type, source_table, result_kind, ui_config,
        filter_binding, empty_state, span_class_name, widget_order, is_active`;
    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (${wCols})
      VALUES (
        ${dashboardId}, '${escapeSqlLiteral(widgetKey)}',
        '${escapeSqlLiteral(title)}', '${escapeSqlLiteral(title.slice(0, 48))}',
        ${description ? `'${escapeSqlLiteral(description)}'` : 'NULL'},
        '${escapeSqlLiteral(normalizedWidgetKind)}',
        ${normalizedChartType ? `'${escapeSqlLiteral(normalizedChartType)}'` : 'NULL'},
        NULL, '${escapeSqlLiteral(normalizedWidgetKind === 'chart' ? 'categorical' : 'table')}',
        '${escapeSqlLiteral(uiConfigJson)}'::jsonb, '[]'::jsonb,
        'No pinned widget data yet.', '${escapeSqlLiteral(spanClassName)}',
        ${widgetOrder}, true
      ) RETURNING widget_id::text
    `);
    const widgetId = insertedRows[0]?.widget_id;

    const qCols = `widget_id, query_key, label, purpose, sql_template,
        count_sql, query_params, output_columns, default_limit, is_active`;
    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard_widget_query (${qCols})
      VALUES (
        ${widgetId}, '${escapeSqlLiteral(queryKey)}',
        '${escapeSqlLiteral(queryLabel)}', 'Pinned from Senti AI',
        '${escapeSqlLiteral(sqlTemplate)}', NULL, '[]'::jsonb,
        '${escapeSqlLiteral(JSON.stringify(outputColumns))}'::jsonb, 50, true
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

    const existingRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(
      `SELECT widget_id::text FROM public.dashboard_widget WHERE widget_id::text = '${widgetIdSql}' LIMIT 1`,
    );
    if (!existingRows.length) throw new NotFoundException('Widget tidak ditemukan.');

    const validChartTypes = ['bar', 'vertical_bar', 'line', 'pie', 'donut', 'area', 'horizontal_bar', 'scatter'];
    const updates: string[] = [];
    if (title) {
      updates.push(`title = '${escapeSqlLiteral(title)}'`);
      updates.push(`short_label = '${escapeSqlLiteral(title.slice(0, 48))}'`);
    }
    if (body?.description !== undefined) {
      updates.push(description ? `description = '${escapeSqlLiteral(description)}'` : 'description = NULL');
    }
    if (spanClassName) updates.push(`span_class_name = '${escapeSqlLiteral(spanClassName)}'`);
    if (widgetOrder !== null) updates.push(`widget_order = ${widgetOrder}`);
    if (chartType !== null) {
      const nc = validChartTypes.includes(chartType) ? chartType : '';
      updates.push(nc ? `chart_type = '${nc}'` : 'chart_type = NULL');
      updates.push(nc ? "widget_kind = CASE WHEN widget_kind IN ('table', 'list', 'summary', 'metric') THEN widget_kind ELSE 'chart' END" : 'widget_kind = widget_kind');
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
    const rows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(
      `SELECT widget_id::text FROM public.dashboard_widget WHERE widget_id::text = '${widgetIdSql}' LIMIT 1`,
    );
    if (!rows.length) throw new NotFoundException('Widget tidak ditemukan.');
    await this.prisma.$executeRawUnsafe(
      `DELETE FROM public.dashboard_widget WHERE widget_id::text = '${widgetIdSql}'`,
    );
    return { success: true };
  }

  async duplicateCustomDbWidget(widgetId: string) {
    const widgetIdSql = escapeSqlLiteral(widgetId);
    const sourceRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT w.widget_id::text, w.dashboard_id::text, w.widget_key, w.title,
        w.short_label, COALESCE(w.description, '') AS description,
        w.widget_kind, COALESCE(w.chart_type, '') AS chart_type,
        COALESCE(w.source_table, '') AS source_table, w.result_kind,
        w.ui_config, w.filter_binding, COALESCE(w.empty_state, '') AS empty_state
      FROM public.dashboard_widget w
      WHERE w.widget_id::text = '${widgetIdSql}' LIMIT 1
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
    const wCols = `dashboard_id, widget_key, title, short_label, description,
        widget_kind, chart_type, source_table, result_kind, ui_config,
        filter_binding, empty_state, span_class_name, widget_order, is_active`;

    const insertedRows = await this.prisma.$queryRawUnsafe<Array<{ widget_id: string }>>(`
      INSERT INTO public.dashboard_widget (${wCols})
      SELECT dashboard_id,
        '${escapeSqlLiteral(duplicatedWidgetKey)}',
        '${escapeSqlLiteral(duplicatedTitle)}',
        '${escapeSqlLiteral(duplicatedTitle.slice(0, 48))}',
        description, widget_kind, chart_type, source_table, result_kind,
        ui_config, filter_binding, empty_state, span_class_name, ${nextOrder}, true
      FROM public.dashboard_widget
      WHERE widget_id::text = '${widgetIdSql}'
      RETURNING widget_id::text
    `);

    const duplicatedWidgetId = insertedRows[0]?.widget_id;
    const queryRows = await this.prisma.$queryRawUnsafe<Array<Record<string, unknown>>>(`
      SELECT query_key, label, COALESCE(purpose, '') AS purpose,
        sql_template, count_sql, query_params, output_columns, default_limit
      FROM public.dashboard_widget_query
      WHERE widget_id::text = '${widgetIdSql}' AND is_active = true
      ORDER BY query_key
    `);

    const qCols2 = `widget_id, query_key, label, purpose, sql_template,
        count_sql, query_params, output_columns, default_limit, is_active`;
    for (let index = 0; index < queryRows.length; index += 1) {
      const query = queryRows[index];
      const duplicateQueryKey =
        index === 0 ? `${duplicatedWidgetKey}-main` : `${duplicatedWidgetKey}-${index + 1}`;
      const duplicateQueryLabel = `${duplicatedTitle} Query${index > 0 ? ` ${index + 1}` : ''}`;
      await this.prisma.$executeRawUnsafe(`
        INSERT INTO public.dashboard_widget_query (${qCols2})
        VALUES (
          ${duplicatedWidgetId}, '${escapeSqlLiteral(duplicateQueryKey)}',
          '${escapeSqlLiteral(duplicateQueryLabel)}',
          ${query.purpose ? `'${escapeSqlLiteral(String(query.purpose))}'` : 'NULL'},
          '${escapeSqlLiteral(String(query.sql_template || ''))}',
          ${query.count_sql ? `'${escapeSqlLiteral(String(query.count_sql))}'` : 'NULL'},
          '${escapeSqlLiteral(JSON.stringify(asJson(query.query_params, [])))}'::jsonb,
          '${escapeSqlLiteral(JSON.stringify(asJson(query.output_columns, [])))}'::jsonb,
          ${query.default_limit ?? 'NULL'}, true
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

  private async findOrCreateCustomDashboardId(dashboardKey: string) {
    const identifier = escapeSqlLiteral(dashboardKey);
    const routeSegment = escapeSqlLiteral(this.resolveRouteSegment(dashboardKey));
    const dashboardWhere = `d.is_active = true AND (
          d.dashboard_key = '${identifier}'
          OR COALESCE(m.key, '') = '${identifier}'
          OR COALESCE(m.path, '') = '${identifier}'
          OR COALESCE(split_part(m.path, '/', array_length(string_to_array(m.path, '/'), 1)), '') = '${routeSegment}'
        )`;

    let rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE ${dashboardWhere} LIMIT 1
    `);

    if (rows.length) return rows[0].dashboard_id;

    const menuRows = await this.prisma.$queryRawUnsafe<Array<{ id: string; title: string }>>(`
      SELECT id::text, title FROM public.m0_menu WHERE is_active = true AND (
        key = '${identifier}'
        OR COALESCE(path, '') = '${identifier}'
        OR COALESCE(split_part(path, '/', array_length(string_to_array(path, '/'), 1)), '') = '${routeSegment}'
      ) LIMIT 1
    `);

    if (!menuRows.length) {
      throw new NotFoundException(`Dashboard/menu ${dashboardKey} tidak ditemukan.`);
    }

    const menuId = menuRows[0].id;
    const menuTitle = menuRows[0].title || dashboardKey;

    await this.prisma.$executeRawUnsafe(`
      INSERT INTO public.dashboard (
        menu_id, dashboard_key, title, short_label, description,
        icon_name, status, layout_config, default_filter_values, is_active
      ) VALUES (
        ${menuId}, '${identifier}',
        '${escapeSqlLiteral(menuTitle)}',
        '${escapeSqlLiteral(String(menuTitle).slice(0, 48))}',
        'Dashboard page generated from menu target.',
        'LayoutDashboard', 'active', '{}'::jsonb, '{}'::jsonb, true
      )
      ON CONFLICT (dashboard_key) DO UPDATE
      SET menu_id = EXCLUDED.menu_id, title = EXCLUDED.title,
          short_label = EXCLUDED.short_label, is_active = true
    `);

    rows = await this.prisma.$queryRawUnsafe<Array<{ dashboard_id: string }>>(`
      SELECT d.dashboard_id::text FROM public.dashboard d
      LEFT JOIN public.m0_menu m ON m.id = d.menu_id
      WHERE ${dashboardWhere} LIMIT 1
    `);

    if (!rows.length) {
      throw new InternalServerErrorException(`Dashboard ${dashboardKey} gagal dibuat.`);
    }

    return rows[0].dashboard_id;
  }

  private resolveRouteSegment(value: string) {
    const trimmed = value.trim().replace(/^\/+|\/+$/g, '');
    if (!trimmed) return '';
    const parts = trimmed.split('/');
    return parts[parts.length - 1] || '';
  }
}
