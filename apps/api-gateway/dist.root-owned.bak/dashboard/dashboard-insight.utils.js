"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractConfidenceAverage = extractConfidenceAverage;
exports.normalizeRange = normalizeRange;
exports.resolveM2SourceCode = resolveM2SourceCode;
exports.wrapExecutionError = wrapExecutionError;
const common_1 = require("@nestjs/common");
function extractConfidenceAverage(response) {
    if (!response || typeof response !== 'object') {
        return null;
    }
    const items = response.insightItems;
    if (!Array.isArray(items) || items.length === 0) {
        const direct = response.confidence;
        return typeof direct === 'number' ? direct : null;
    }
    const nums = items
        .map((item) => (typeof item?.confidence === 'number' ? item.confidence : null))
        .filter((value) => value !== null);
    if (nums.length === 0) {
        return null;
    }
    return nums.reduce((acc, value) => acc + value, 0) / nums.length;
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
//# sourceMappingURL=dashboard-insight.utils.js.map