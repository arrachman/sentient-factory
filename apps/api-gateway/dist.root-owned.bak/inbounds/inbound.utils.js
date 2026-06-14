"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseInboundId = parseInboundId;
exports.ensureTransactionNoAvailable = ensureTransactionNoAvailable;
exports.resolveTransactionNo = resolveTransactionNo;
exports.ensureSupplierExists = ensureSupplierExists;
exports.ensureWarehouseExists = ensureWarehouseExists;
exports.getActiveItems = getActiveItems;
const common_1 = require("@nestjs/common");
const duplicate_util_1 = require("../common/errors/duplicate.util");
const inbound_transaction_utils_1 = require("./inbound-transaction.utils");
function parseInboundId(value, fieldLabel) {
    return (0, inbound_transaction_utils_1.parseIntStrict)(String(value), fieldLabel);
}
async function ensureTransactionNoAvailable(prisma, transactionNo, exceptId) {
    const duplicate = await prisma.inbound.findFirst({
        where: { transactionNo, NOT: exceptId ? { id: exceptId } : undefined },
        select: { id: true, deletedAt: true },
    });
    if (duplicate) {
        (0, duplicate_util_1.throwDuplicate)({
            fieldLabel: 'Inbound transaction number',
            value: transactionNo,
            isSoftDeleted: Boolean(duplicate.deletedAt),
        });
    }
}
async function resolveTransactionNo(tx, prisma, transactionNo) {
    const candidate = transactionNo?.trim();
    if (candidate) {
        await ensureTransactionNoAvailable(prisma, candidate);
        return candidate;
    }
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const d = String(today.getDate()).padStart(2, '0');
    const prefix = `INB-${y}${m}${d}-`;
    const latestForDate = await tx.inbound.findFirst({
        where: { transactionNo: { startsWith: prefix } },
        select: { transactionNo: true },
        orderBy: { transactionNo: 'desc' },
    });
    const latestSuffix = Number.parseInt(latestForDate?.transactionNo?.slice(prefix.length) ?? '', 10);
    const nextSequence = Number.isInteger(latestSuffix) && latestSuffix > 0 ? latestSuffix + 1 : 1;
    return `${prefix}${String(nextSequence).padStart(4, '0')}`;
}
async function ensureSupplierExists(prisma, supplierId) {
    const supplier = await prisma.masterDataContact.findFirst({
        where: { id: supplierId, type: 'supplier', deletedAt: null },
        select: { id: true },
    });
    if (!supplier) {
        throw new common_1.BadRequestException('Supplier not found');
    }
}
async function ensureWarehouseExists(prisma, warehouseId) {
    const warehouse = await prisma.masterDataWarehouse.findFirst({
        where: { id: warehouseId, deletedAt: null },
        select: { id: true },
    });
    if (!warehouse) {
        throw new common_1.BadRequestException('Warehouse not found');
    }
}
async function getActiveItems(prisma, itemIds) {
    const uniqueItemIds = [...new Set(itemIds)];
    const items = await prisma.masterDataItem.findMany({
        where: { id: { in: uniqueItemIds }, isActive: true, deletedAt: null },
        select: { id: true, code: true, name: true, uom: { select: { id: true } } },
    });
    if (items.length !== uniqueItemIds.length) {
        throw new common_1.BadRequestException('One or more items are not found or inactive');
    }
    return new Map(items.map((item) => [
        item.id,
        { id: item.id, code: item.code, name: item.name, uomId: item.uom.id },
    ]));
}
//# sourceMappingURL=inbound.utils.js.map