"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildInboundDetailCreateInput = buildInboundDetailCreateInput;
const audit_user_util_1 = require("../common/utils/audit-user.util");
function buildInboundDetailCreateInput(inboundId, lineNo, detail, item, actorId) {
    return {
        inboundId,
        lineNo,
        itemId: detail.itemId,
        qty: detail.qty,
        uomInput: detail.uomInput ?? null,
        itemCodeSnapshot: item.code,
        itemNameSnapshot: item.name,
        notes: detail.notes ?? null,
        createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
        updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
        batches: {
            create: detail.batches.map((batch, batchIndex) => ({
                lineNo: batchIndex + 1,
                batchIn: batch.batchIn,
                qty: batch.qty,
                expiredDate: batch.expiredDate ? new Date(batch.expiredDate) : null,
                notes: batch.notes ?? null,
                createdBy: (0, audit_user_util_1.toAuditUserId)(actorId),
                updatedBy: (0, audit_user_util_1.toAuditUserId)(actorId),
            })),
        },
    };
}
//# sourceMappingURL=inbound-detail.mapper.js.map