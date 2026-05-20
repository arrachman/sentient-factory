"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditResource = exports.AUDIT_RESOURCE_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.AUDIT_RESOURCE_KEY = 'clinicAuditResource';
const AuditResource = (resource) => (0, common_1.SetMetadata)(exports.AUDIT_RESOURCE_KEY, resource);
exports.AuditResource = AuditResource;
//# sourceMappingURL=audit-resource.decorator.js.map