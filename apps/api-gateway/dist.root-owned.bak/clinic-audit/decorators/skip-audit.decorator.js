"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SkipAudit = exports.SKIP_AUDIT_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.SKIP_AUDIT_KEY = 'clinicSkipAudit';
const SkipAudit = () => (0, common_1.SetMetadata)(exports.SKIP_AUDIT_KEY, true);
exports.SkipAudit = SkipAudit;
//# sourceMappingURL=skip-audit.decorator.js.map