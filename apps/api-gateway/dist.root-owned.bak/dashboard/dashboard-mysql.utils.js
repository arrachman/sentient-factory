"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMysqlConfig = getMysqlConfig;
exports.getTemplateRootCandidates = getTemplateRootCandidates;
exports.resolveTemplateRoot = resolveTemplateRoot;
exports.resolveTemplateRootForDomain = resolveTemplateRootForDomain;
exports.resolveTemplateRootForDomainAndFile = resolveTemplateRootForDomainAndFile;
exports.quoteString = quoteString;
exports.quoteDate = quoteDate;
exports.assertInt = assertInt;
exports.assertIdentifier = assertIdentifier;
const common_1 = require("@nestjs/common");
const fs_1 = require("fs");
const path_1 = require("path");
function getMysqlConfig(configService) {
    const host = configService.get('DASHBOARD_MYSQL_HOST') ??
        configService.get('MYSQL_HOST') ??
        '127.0.0.1';
    const port = Number(configService.get('DASHBOARD_MYSQL_PORT') ??
        configService.get('MYSQL_PORT') ??
        '3307');
    const user = configService.get('DASHBOARD_MYSQL_USER') ??
        configService.get('MYSQL_USER') ??
        'root';
    const password = configService.get('DASHBOARD_MYSQL_PASSWORD') ??
        configService.get('MYSQL_ROOT_PASSWORD') ??
        configService.get('MYSQL_PASSWORD') ??
        '';
    const database = configService.get('DASHBOARD_MYSQL_DATABASE') ??
        configService.get('MYSQL_DATABASE') ??
        'myerpplus';
    return { host, port, user, password, database };
}
function getTemplateRootCandidates(configuredRoot) {
    return [
        configuredRoot,
        (0, path_1.resolve)('/myerpplus-db-mapping/dashboard-mapping/sql-templates'),
        (0, path_1.resolve)(process.cwd(), 'sql-templates'),
        (0, path_1.resolve)(process.cwd(), '../myerpplus-db-mapping/dashboard-mapping/sql-templates'),
        (0, path_1.resolve)(process.cwd(), '../../apps/myerpplus-db-mapping/dashboard-mapping/sql-templates'),
        (0, path_1.resolve)(__dirname, '../../../myerpplus-db-mapping/dashboard-mapping/sql-templates'),
    ].filter((value) => Boolean(value));
}
function resolveTemplateRoot(candidates) {
    const root = candidates.find((candidate) => (0, fs_1.existsSync)(candidate));
    if (!root) {
        throw new common_1.InternalServerErrorException(`Dashboard SQL template root not found. Checked: ${candidates.join(', ')}`);
    }
    return root;
}
function resolveTemplateRootForDomain(candidates, domain) {
    const rootWithDomain = candidates.find((candidate) => (0, fs_1.existsSync)((0, path_1.resolve)(candidate, domain)));
    if (rootWithDomain) {
        return rootWithDomain;
    }
    return resolveTemplateRoot(candidates);
}
function resolveTemplateRootForDomainAndFile(candidates, domain, fileName) {
    const rootWithFile = candidates.find((candidate) => (0, fs_1.existsSync)((0, path_1.resolve)(candidate, domain, fileName)));
    if (rootWithFile) {
        return rootWithFile;
    }
    return resolveTemplateRootForDomain(candidates, domain);
}
function quoteString(value) {
    return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}
function quoteDate(value) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw new common_1.InternalServerErrorException(`Invalid date literal format: ${value}`);
    }
    return `'${value}'`;
}
function assertInt(value, label) {
    if (!Number.isInteger(value) || value < 0) {
        throw new common_1.InternalServerErrorException(`Invalid integer for ${label}`);
    }
    return String(value);
}
function assertIdentifier(value, label) {
    if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
        throw new common_1.InternalServerErrorException(`Unsafe SQL identifier for ${label}`);
    }
    return value;
}
//# sourceMappingURL=dashboard-mysql.utils.js.map