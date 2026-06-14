"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DOMAIN_FIELD_ALLOWLIST = void 0;
exports.assertDomain = assertDomain;
exports.normalizeRange = normalizeRange;
exports.resolveAllowedGroupBy = resolveAllowedGroupBy;
exports.resolveAllowedSortBy = resolveAllowedSortBy;
exports.resolveM2SourceCode = resolveM2SourceCode;
exports.wrapExecutionError = wrapExecutionError;
exports.filterExistingColumns = filterExistingColumns;
const common_1 = require("@nestjs/common");
const SUPPORTED_DOMAINS = ['m1', 'm', 'm2', 'm2r', 'so'];
exports.DOMAIN_FIELD_ALLOWLIST = {
    m1: {
        groupBy: [
            'sumber',
            'cabang',
            'lokasi',
            'gudang',
            'tipebarang',
            'tipehpp',
            'matauang',
            'divisi',
            'subdivisi',
        ],
        sortBy: ['id', 'tgl', 'inputtgl', 'postingtgl', 'saldojml', 'saldonilai', 'saldohpp'],
    },
    m: {
        groupBy: ['abstatus', 'abshift', 'abkaryawan', 'abtgl'],
        sortBy: ['adid', 'adtgl', 'adinputtgl', 'admodifikasitgl', 'adtotalpotongan', 'adkurs'],
    },
    m2r: {
        groupBy: ['apstatuslunas', 'apkontaknama', 'apsumber', 'apmatauang', 'aptgl'],
        sortBy: ['nmtahun', 'nmbulan', 'nmsaldo', 'nmdebit', 'nmkredit', 'nmanggaran'],
    },
    m2: {
        groupBy: ['tsumber', 'tcabang', 'tmatauang', 'tstatus', 'tstatuslunas'],
        sortBy: [
            'tid',
            'ttgl',
            'tinputtgl',
            'tpostingtgl',
            'tcabang',
            'tsumber',
            'tdebit',
            'tkredit',
            'tstatus',
            'tstatuslunas',
        ],
    },
    so: {
        groupBy: ['sostatus', 'sostatusrealisasi', 'socustomer', 'sobagianpenjualan'],
        sortBy: [
            'soid',
            'sotgl',
            'socustomer',
            'sobagianpenjualan',
            'sostatus',
            'sostatusrealisasi',
            'total_lines',
            'total_qty',
            'grand_total',
            'total_paid',
        ],
    },
};
function assertDomain(domain) {
    if (SUPPORTED_DOMAINS.includes(domain)) {
        return domain;
    }
    throw new common_1.BadRequestException(`Unsupported domain '${domain}'. Allowed domains: ${SUPPORTED_DOMAINS.join(', ')}`);
}
function normalizeRange(query) {
    const now = new Date();
    const toDate = query.toDate ?? now.toISOString().slice(0, 10);
    const defaultFrom = new Date(now);
    defaultFrom.setDate(defaultFrom.getDate() - 30);
    const fromDate = query.fromDate ?? defaultFrom.toISOString().slice(0, 10);
    if (fromDate > toDate) {
        throw new common_1.BadRequestException('fromDate must be less than or equal to toDate');
    }
    return { fromDate, toDate };
}
function resolveAllowedGroupBy(domain, input) {
    const allowed = exports.DOMAIN_FIELD_ALLOWLIST[domain].groupBy;
    if (!input) {
        return allowed[0];
    }
    if (!allowed.includes(input)) {
        throw new common_1.BadRequestException(`groupBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`);
    }
    return input;
}
function resolveAllowedSortBy(domain, input) {
    const allowed = exports.DOMAIN_FIELD_ALLOWLIST[domain].sortBy;
    if (!input) {
        return allowed[0];
    }
    if (!allowed.includes(input)) {
        throw new common_1.BadRequestException(`sortBy '${input}' is not allowed for domain '${domain}'. Allowed: ${allowed.join(', ')}`);
    }
    return input;
}
function resolveM2SourceCode(domain, feature) {
    if (domain !== 'm2' || !feature) {
        return null;
    }
    const featureToSource = {
        m2_aj: 'AJ',
        m2_bd: 'BD',
        m2_cb: 'CB',
        m2_cr: 'CR',
        m2_cd: 'CD',
        m2_gj: 'GJ',
        m2_jm: 'JM',
        m2_rg: 'RG',
        m2_rgc: 'RGC',
        m2_rm: 'RM',
        m2_sg: 'SG',
        m2_sgc: 'SGC',
        m2_sm: 'SM',
        m2_template: 'TJ',
    };
    const normalized = feature.trim().toLowerCase();
    return featureToSource[normalized] ?? null;
}
function wrapExecutionError(error, domain, endpoint) {
    if (error instanceof common_1.BadRequestException) {
        return error;
    }
    if (error instanceof common_1.InternalServerErrorException) {
        return error;
    }
    const reason = error instanceof Error ? error.message : 'unknown error';
    return new common_1.InternalServerErrorException(`Dashboard query failed (${domain}/${endpoint}): ${reason}`);
}
function filterExistingColumns(candidates, columns) {
    if (!columns || columns.size === 0) {
        return [...candidates];
    }
    return candidates.filter((candidate) => columns.has(candidate));
}
//# sourceMappingURL=dashboard-query.utils.js.map