"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deriveUsername = deriveUsername;
exports.userSelect = userSelect;
exports.mapPsikologToResponse = mapPsikologToResponse;
exports.buildPsikologWhereClause = buildPsikologWhereClause;
exports.groupServiceIdsByUser = groupServiceIdsByUser;
exports.validateAvatarUrl = validateAvatarUrl;
const common_1 = require("@nestjs/common");
function deriveUsername(email, fullName) {
    const fromName = fullName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    if (fromName.length >= 3)
        return fromName;
    return email.split('@')[0]?.toLowerCase() || `psikolog-${Date.now()}`;
}
function userSelect() {
    return {
        select: {
            id: true,
            email: true,
            username: true,
            fullName: true,
            avatarUrl: true,
            phone: true,
            isActive: true,
            lastLogin: true,
            createdAt: true,
        },
    };
}
function mapPsikologToResponse(user, profile, serviceIds = []) {
    return {
        id: profile.id,
        userId: user.id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        phone: user.phone,
        isActive: profile.isActive && user.isActive,
        title: profile.title,
        specialty: profile.specialty,
        color: profile.color,
        license: profile.license,
        defaultSlots: profile.defaultSlots,
        weeklyAvailability: (profile.weeklyAvailability ?? {}),
        serviceIds,
        bio: profile.bio,
        lastLogin: user.lastLogin,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
    };
}
function buildPsikologWhereClause(query) {
    const where = {
        deletedAt: null,
        user: { deletedAt: null },
    };
    if (typeof query.isActive === 'boolean') {
        where['isActive'] = query.isActive;
    }
    if (query.specialty?.trim()) {
        where['specialty'] = { has: query.specialty.trim() };
    }
    if (query.search?.trim()) {
        const q = query.search.trim();
        where['OR'] = [
            { title: { contains: q, mode: 'insensitive' } },
            { license: { contains: q, mode: 'insensitive' } },
            { user: { fullName: { contains: q, mode: 'insensitive' } } },
            { user: { email: { contains: q, mode: 'insensitive' } } },
        ];
    }
    return where;
}
function groupServiceIdsByUser(rows) {
    const map = new Map();
    for (const r of rows) {
        const arr = map.get(r.psikologUserId) ?? [];
        arr.push(r.serviceId);
        map.set(r.psikologUserId, arr);
    }
    return map;
}
function validateAvatarUrl(avatarUrl) {
    if (!avatarUrl)
        return;
    const isDataUrl = avatarUrl.startsWith('data:image/');
    const isHttpUrl = avatarUrl.startsWith('http://') || avatarUrl.startsWith('https://');
    if (!isDataUrl && !isHttpUrl) {
        throw new common_1.BadRequestException('avatarUrl harus data URL (data:image/...;base64,...) atau URL absolut');
    }
    if (isDataUrl && avatarUrl.length > 1_500_000) {
        throw new common_1.BadRequestException('Foto terlalu besar — maksimal ~1MB setelah resize');
    }
}
//# sourceMappingURL=psikolog.utils.js.map