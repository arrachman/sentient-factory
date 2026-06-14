"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeWarehouseId = normalizeWarehouseId;
exports.normalizeRoleIds = normalizeRoleIds;
exports.serializeUser = serializeUser;
const common_1 = require("@nestjs/common");
function normalizeWarehouseId(warehouseId) {
    if (warehouseId === undefined) {
        return undefined;
    }
    const normalized = warehouseId.trim();
    if (!normalized.length)
        return null;
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed)) {
        throw new common_1.BadRequestException('Warehouse ID is invalid');
    }
    return parsed;
}
function normalizeRoleIds(roleIds, roleId) {
    if (Array.isArray(roleIds)) {
        const parsed = roleIds.map((value) => {
            const normalized = String(value ?? '').trim();
            const roleIdNumber = Number(normalized);
            if (!normalized.length || !Number.isInteger(roleIdNumber)) {
                throw new common_1.BadRequestException('Role IDs are invalid');
            }
            return roleIdNumber;
        });
        return Array.from(new Set(parsed));
    }
    if (roleId === undefined) {
        return undefined;
    }
    const normalized = roleId.trim();
    if (!normalized.length) {
        return [];
    }
    const parsed = Number(normalized);
    if (!Number.isInteger(parsed)) {
        throw new common_1.BadRequestException('Role ID is invalid');
    }
    return [parsed];
}
function serializeUser(user, warehouseMeta) {
    const { passwordHash: _passwordHash, ...safe } = user;
    return {
        ...safe,
        warehouseId: warehouseMeta?.warehouseId ?? null,
        warehouseName: warehouseMeta?.warehouseName ?? null,
        roleIds: user.roles?.map((item) => item.role.id) ?? [],
        roleId: user.roles?.[0]?.role?.id ?? null,
        roles: user.roles?.map((item) => item.role.name) ?? [],
        role: user.roles?.[0]?.role?.name ?? null,
    };
}
//# sourceMappingURL=user-admin.utils.js.map