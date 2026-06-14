"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.escapeSqlLiteral = escapeSqlLiteral;
exports.asJson = asJson;
exports.toNumber = toNumber;
exports.formatNumber = formatNumber;
exports.formatMoneyCompact = formatMoneyCompact;
exports.formatPercent = formatPercent;
exports.toAuditUserId = toAuditUserId;
exports.escapeHtml = escapeHtml;
function escapeSqlLiteral(value) {
    return value.replaceAll("'", "''");
}
function asJson(value, fallback) {
    if (value === null || value === undefined || value === '') {
        return fallback;
    }
    if (typeof value === 'object') {
        return value;
    }
    try {
        return JSON.parse(String(value));
    }
    catch {
        return fallback;
    }
}
function toNumber(value) {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === 'string') {
        const parsed = Number(value);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
}
function formatNumber(value) {
    return value.toLocaleString('id-ID', { maximumFractionDigits: 2 });
}
function formatMoneyCompact(value) {
    return `Rp ${value.toLocaleString('id-ID', {
        notation: 'compact',
        maximumFractionDigits: 2,
    })}`;
}
function formatPercent(value) {
    return `${value.toLocaleString('id-ID', { maximumFractionDigits: 2 })}%`;
}
function toAuditUserId(actorId) {
    if (typeof actorId === 'number' && Number.isInteger(actorId) && actorId > 0) {
        return actorId;
    }
    const parsed = Number(String(actorId ?? '').trim());
    if (Number.isInteger(parsed) && parsed > 0) {
        return parsed;
    }
    return null;
}
function escapeHtml(value) {
    return value
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;');
}
//# sourceMappingURL=dashboard.utils.js.map