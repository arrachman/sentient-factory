"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toAuditUserId = toAuditUserId;
function toAuditUserId(actorId) {
    if (actorId === undefined || actorId === null) {
        return null;
    }
    const parsed = Number(String(actorId).trim());
    if (!Number.isInteger(parsed) || parsed <= 0) {
        return null;
    }
    return parsed;
}
//# sourceMappingURL=audit-user.util.js.map