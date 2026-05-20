"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizePhoneId = normalizePhoneId;
exports.formatPhoneDisplay = formatPhoneDisplay;
function normalizePhoneId(input) {
    if (!input)
        return null;
    const cleaned = String(input).replace(/[^\d+]/g, '');
    const noPlus = cleaned.startsWith('+') ? cleaned.slice(1) : cleaned;
    if (noPlus.length < 8)
        return null;
    let normalized;
    if (noPlus.startsWith('62')) {
        normalized = noPlus;
    }
    else if (noPlus.startsWith('0')) {
        normalized = '62' + noPlus.slice(1);
    }
    else if (noPlus.startsWith('8')) {
        normalized = '62' + noPlus;
    }
    else {
        normalized = noPlus;
    }
    if (normalized.length < 10 || normalized.length > 15)
        return null;
    return normalized;
}
function formatPhoneDisplay(normalized) {
    if (!normalized)
        return '—';
    const digits = normalized.replace(/\D/g, '');
    if (digits.startsWith('62') && digits.length >= 11) {
        const rest = digits.slice(2);
        if (rest.length === 11) {
            return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 7)}-${rest.slice(7)}`;
        }
        if (rest.length === 10) {
            return `+62 ${rest.slice(0, 3)}-${rest.slice(3, 6)}-${rest.slice(6)}`;
        }
        return `+62 ${rest}`;
    }
    return normalized;
}
//# sourceMappingURL=phone.util.js.map