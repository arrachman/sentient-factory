import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DashboardMysqlService } from './dashboard-mysql.service';
import { QueryDashboardRangeDto } from './dto/query-dashboard-range.dto';

type M2Domain = 'm2';

@Injectable()
export class DashboardQueryM2Service {
  constructor(private readonly dashboardMysqlService: DashboardMysqlService) {}

  // ── M2/SM ──────────────────────────────────────────────────────────────────

  async topContactsM2Sm(normalizedRange: { fromDate: string; toDate: string }) {
    const sql = `
      SELECT
        COALESCE(CAST(j.tkontak AS CHAR), '0') AS kontak_key,
        COUNT(*) AS total_trx,
        COALESCE(SUM(COALESCE(j.tkredit, 0)), 0) AS total_payment,
        COALESCE(SUM(ABS(COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0))), 0) AS movement_amount
      FROM m2_transaction_journal j
      WHERE DATE(j.ttgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND j.tsumber = 'SM'
      GROUP BY kontak_key
      ORDER BY total_payment DESC, total_trx DESC
      LIMIT 10;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_sm_top_contacts', query: normalizedRange, rows },
    };
  }

  async contactDrilldownM2Sm(
    normalizedRange: { fromDate: string; toDate: string },
    kontakId: number,
  ) {
    const sql = `
      SELECT
        j.tid,
        DATE(j.ttgl) AS trx_date,
        j.tcabang AS cabang,
        j.tsumber AS sumber,
        j.tnotransaksi AS no_transaksi,
        j.tkontak AS kontak_id,
        j.tmatauang AS mata_uang,
        COALESCE(j.tdebit, 0) AS debit,
        COALESCE(j.tkredit, 0) AS kredit,
        (COALESCE(j.tdebit, 0) - COALESCE(j.tkredit, 0)) AS net_amount,
        j.tstatus,
        j.tstatuslunas,
        j.turaian
      FROM m2_transaction_journal j
      WHERE DATE(j.ttgl) BETWEEN '${normalizedRange.fromDate}' AND '${normalizedRange.toDate}'
        AND j.tsumber = 'SM'
        AND j.tkontak = ${Math.trunc(kontakId)}
      ORDER BY COALESCE(j.tkredit, 0) DESC, j.ttgl DESC
      LIMIT 20;
    `;
    const rows = await this.dashboardMysqlService.executeRawQuery(sql);
    return {
      success: true,
      data: { type: 'm2_sm_contact_drilldown', query: { ...normalizedRange, kontakId }, rows },
    };
  }

  // ── M2 preset breakdowns ───────────────────────────────────────────────────

  async breakdownM2Status(
    normalizedRange: { fromDate: string; toDate: string },
    sourceCode: string | null,
  ) {
    return this.executePresetBreakdown('m2', 'status', 'breakdown_status.sql', normalizedRange, sourceCode);
  }

  async breakdownM2Cashflow(
    normalizedRange: { fromDate: string; toDate: string },
    sourceCode: string | null,
  ) {
    return this.executePresetBreakdown('m2', 'cashflow', 'breakdown_cashflow.sql', normalizedRange, sourceCode);
  }

  async breakdownM2Branch(
    normalizedRange: { fromDate: string; toDate: string },
    sourceCode: string | null,
  ) {
    return this.executePresetBreakdown('m2', 'branch', 'breakdown_branch.sql', normalizedRange, sourceCode);
  }

  // ── helpers ───────────────────────────────────────────────────────────────

  validateKontakId(rawKontakId?: string): number {
    const kontakId = Number(rawKontakId);
    if (!Number.isFinite(kontakId) || kontakId <= 0) {
      throw new BadRequestException('kontakId harus berupa angka positif.');
    }
    return kontakId;
  }

  private async executePresetBreakdown(
    domain: M2Domain,
    type: 'status' | 'cashflow' | 'branch',
    fileName: string,
    normalizedRange: { fromDate: string; toDate: string },
    sourceCode: string | null,
  ) {
    try {
      const rows = await this.dashboardMysqlService.executeTemplate(domain, fileName, {
        fromDate: normalizedRange.fromDate,
        toDate: normalizedRange.toDate,
        sourceCode,
      });

      return {
        success: true,
        data: {
          domain,
          type: `breakdown_${type}`,
          query: normalizedRange,
          sqlTemplatePath: this.dashboardMysqlService.getTemplatePath(domain, fileName),
          rows,
        },
      };
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error;
      }
      const reason = error instanceof Error ? error.message : 'unknown error';
      throw new InternalServerErrorException(
        `Dashboard query failed (${domain}/breakdown_${type}): ${reason}`,
      );
    }
  }
}
