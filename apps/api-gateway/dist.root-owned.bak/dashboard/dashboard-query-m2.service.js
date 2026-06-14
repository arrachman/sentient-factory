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
exports.DashboardQueryM2Service = void 0;
const common_1 = require("@nestjs/common");
const dashboard_mysql_service_1 = require("./dashboard-mysql.service");
let DashboardQueryM2Service = class DashboardQueryM2Service {
    dashboardMysqlService;
    constructor(dashboardMysqlService) {
        this.dashboardMysqlService = dashboardMysqlService;
    }
    async topContactsM2Sm(normalizedRange) {
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
    async contactDrilldownM2Sm(normalizedRange, kontakId) {
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
    async breakdownM2Status(normalizedRange, sourceCode) {
        return this.executePresetBreakdown('m2', 'status', 'breakdown_status.sql', normalizedRange, sourceCode);
    }
    async breakdownM2Cashflow(normalizedRange, sourceCode) {
        return this.executePresetBreakdown('m2', 'cashflow', 'breakdown_cashflow.sql', normalizedRange, sourceCode);
    }
    async breakdownM2Branch(normalizedRange, sourceCode) {
        return this.executePresetBreakdown('m2', 'branch', 'breakdown_branch.sql', normalizedRange, sourceCode);
    }
    validateKontakId(rawKontakId) {
        const kontakId = Number(rawKontakId);
        if (!Number.isFinite(kontakId) || kontakId <= 0) {
            throw new common_1.BadRequestException('kontakId harus berupa angka positif.');
        }
        return kontakId;
    }
    async executePresetBreakdown(domain, type, fileName, normalizedRange, sourceCode) {
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
        }
        catch (error) {
            if (error instanceof common_1.BadRequestException || error instanceof common_1.InternalServerErrorException) {
                throw error;
            }
            const reason = error instanceof Error ? error.message : 'unknown error';
            throw new common_1.InternalServerErrorException(`Dashboard query failed (${domain}/breakdown_${type}): ${reason}`);
        }
    }
};
exports.DashboardQueryM2Service = DashboardQueryM2Service;
exports.DashboardQueryM2Service = DashboardQueryM2Service = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [dashboard_mysql_service_1.DashboardMysqlService])
], DashboardQueryM2Service);
//# sourceMappingURL=dashboard-query-m2.service.js.map