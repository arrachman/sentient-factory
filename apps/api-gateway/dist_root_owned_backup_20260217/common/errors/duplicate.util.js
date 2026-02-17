"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.duplicateMessage = duplicateMessage;
exports.throwDuplicate = throwDuplicate;
exports.isUniqueViolation = isUniqueViolation;
const common_1 = require("@nestjs/common");
function duplicateMessage(fieldLabel, value, isSoftDeleted = false) {
    const normalizedValue = typeof value === 'string' ? value.trim() : '';
    const hasValue = normalizedValue.length > 0;
    if (isSoftDeleted) {
        return hasValue
            ? `${fieldLabel} '${normalizedValue}' has been used before and cannot be reused`
            : `${fieldLabel} has been used before and cannot be reused`;
    }
    return hasValue ? `${fieldLabel} '${normalizedValue}' already exists` : `${fieldLabel} already exists`;
}
function throwDuplicate({ fieldLabel, value, isSoftDeleted = false, type = 'bad_request', }) {
    const message = duplicateMessage(fieldLabel, value, isSoftDeleted);
    if (type === 'conflict') {
        throw new common_1.ConflictException(message);
    }
    throw new common_1.BadRequestException(message);
}
function isUniqueViolation(error, targets) {
    const maybeError = error;
    if (maybeError?.code !== 'P2002') {
        return false;
    }
    const rawTarget = maybeError.meta?.target;
    const target = Array.isArray(rawTarget) ? rawTarget.join(',') : String(rawTarget ?? '');
    return targets.some((item) => target.includes(item));
}
//# sourceMappingURL=duplicate.util.js.map