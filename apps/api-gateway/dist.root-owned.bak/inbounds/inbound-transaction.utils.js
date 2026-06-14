"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseIntStrict = parseIntStrict;
exports.normalizeAndValidateBatches = normalizeAndValidateBatches;
exports.normalizeAndValidateDetails = normalizeAndValidateDetails;
const common_1 = require("@nestjs/common");
function parseIntStrict(value, fieldLabel) {
    const parsed = Number(String(value ?? '').trim());
    if (!Number.isInteger(parsed)) {
        throw new common_1.BadRequestException(`${fieldLabel} is invalid`);
    }
    return parsed;
}
function normalizeAndValidateBatches(batches) {
    if (!batches.length) {
        throw new common_1.BadRequestException('At least one batch row is required for each detail');
    }
    const seenBatchNumbers = new Set();
    return batches.map((rawBatch) => {
        const batchIn = rawBatch.batchIn.trim();
        if (!batchIn) {
            throw new common_1.BadRequestException('Batch number is required');
        }
        const batchKey = batchIn.toLowerCase();
        if (seenBatchNumbers.has(batchKey)) {
            throw new common_1.BadRequestException(`Duplicate batch number in one detail: ${batchIn}`);
        }
        seenBatchNumbers.add(batchKey);
        const qty = Number(rawBatch.qty);
        if (!Number.isFinite(qty) || qty <= 0) {
            throw new common_1.BadRequestException(`Batch qty must be greater than 0 for batch ${batchIn}`);
        }
        return {
            batchIn,
            qty,
            expiredDate: rawBatch.expiredDate,
            notes: rawBatch.notes?.trim() || undefined,
        };
    });
}
function normalizeAndValidateDetails(details) {
    if (!details.length) {
        throw new common_1.BadRequestException('At least one detail row is required');
    }
    const seenItemIds = new Set();
    return details.map((rawDetail) => {
        const itemId = parseIntStrict(String(rawDetail.itemId), 'Detail itemId');
        if (seenItemIds.has(itemId)) {
            throw new common_1.BadRequestException(`Duplicate item in detail: ${itemId}`);
        }
        seenItemIds.add(itemId);
        const batches = normalizeAndValidateBatches(rawDetail.batches);
        const qtyFromBatches = batches.reduce((total, batch) => total + batch.qty, 0);
        const detailQty = Number(rawDetail.qty);
        const detailUomInput = Number(rawDetail.uomInput);
        if (!Number.isFinite(detailQty) || detailQty <= 0) {
            throw new common_1.BadRequestException(`Detail qty for item ${itemId} must be greater than 0`);
        }
        if (!Number.isInteger(detailUomInput) || detailUomInput < 0) {
            throw new common_1.BadRequestException(`Detail uomInput for item ${itemId} must be an integer and cannot be negative`);
        }
        if (Math.abs(detailQty - qtyFromBatches) > 0.0001) {
            throw new common_1.BadRequestException(`Detail qty must equal sum of batch qty for item ${itemId}. Detail qty=${detailQty}, batch total=${qtyFromBatches}`);
        }
        return {
            itemId,
            qty: detailQty,
            uomInput: detailUomInput,
            notes: rawDetail.notes?.trim() || undefined,
            batches,
        };
    });
}
//# sourceMappingURL=inbound-transaction.utils.js.map