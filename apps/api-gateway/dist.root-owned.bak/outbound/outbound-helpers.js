"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeRequiredDoNumber = normalizeRequiredDoNumber;
exports.parseId = parseId;
exports.parseOptionalId = parseOptionalId;
exports.parseOptionalActorUserId = parseOptionalActorUserId;
exports.parseOptionalActorId = parseOptionalActorId;
exports.normalizeAuditActor = normalizeAuditActor;
exports.isMissingWarehouseColumnError = isMissingWarehouseColumnError;
exports.normalizeAndValidateDetails = normalizeAndValidateDetails;
const common_1 = require("@nestjs/common");
const audit_user_util_1 = require("../common/utils/audit-user.util");
function normalizeRequiredDoNumber(value) {
    const doNumber = String(value ?? '').trim();
    if (!doNumber) {
        throw new common_1.BadRequestException('DO number is required');
    }
    return doNumber;
}
function parseId(value, label) {
    if (typeof value === 'number') {
        if (Number.isInteger(value) && value > 0) {
            return value;
        }
        throw new common_1.BadRequestException(`${label} must be a valid integer`);
    }
    const normalized = String(value ?? '').trim();
    if (!normalized) {
        throw new common_1.BadRequestException(`${label} is required`);
    }
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        throw new common_1.BadRequestException(`${label} must be a valid integer`);
    }
    return parsed;
}
function parseOptionalId(value, label) {
    if (typeof value === 'undefined' || value === null) {
        return undefined;
    }
    if (typeof value === 'string' && !value.trim()) {
        return undefined;
    }
    return parseId(value, label);
}
function parseOptionalActorUserId(actorId) {
    if (typeof actorId === 'undefined' || actorId === null) {
        return undefined;
    }
    const normalized = String(actorId).trim();
    if (!normalized) {
        return undefined;
    }
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return undefined;
    }
    return parsed;
}
function parseOptionalActorId(actorId) {
    if (typeof actorId === 'number') {
        return Number.isInteger(actorId) ? actorId : undefined;
    }
    const parsed = Number(String(actorId ?? '').trim());
    return Number.isInteger(parsed) ? parsed : undefined;
}
function normalizeAuditActor(actorId) {
    const normalized = (0, audit_user_util_1.toAuditUserId)(actorId);
    return normalized ?? undefined;
}
function isMissingWarehouseColumnError(error) {
    const code = String(error?.code ?? '').trim();
    const metaText = JSON.stringify(error?.meta ?? {})
        .toLowerCase()
        .trim();
    return code === 'P2022' && metaText.includes('warehouse_id');
}
function normalizeAndValidateDetails(details) {
    if (!details.length) {
        throw new common_1.BadRequestException('At least one detail row is required');
    }
    const seen = new Set();
    return details.map((raw) => {
        const itemId = parseId(raw.itemId, 'detail.itemId');
        const batchNumber = raw.batchNumber.trim();
        if (!itemId) {
            throw new common_1.BadRequestException('Detail itemId is required');
        }
        if (!batchNumber) {
            throw new common_1.BadRequestException('Detail batchNumber is required');
        }
        const compositeKey = `${String(itemId)}::${batchNumber.toLowerCase()}`;
        if (seen.has(compositeKey)) {
            throw new common_1.BadRequestException(`Duplicate item and batch combination: ${itemId} - ${batchNumber}`);
        }
        seen.add(compositeKey);
        return {
            ...raw,
            itemId,
            batchNumber,
        };
    });
}
//# sourceMappingURL=outbound-helpers.js.map