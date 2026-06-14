import { InternalServerErrorException } from '@nestjs/common';
import { existsSync } from 'fs';
import { resolve } from 'path';

export type MysqlConfig = {
  host: string;
  port: number;
  user: string;
  password: string;
  database: string;
};

type EnvReader = {
  get<T = string>(key: string): T | undefined;
};

export function getMysqlConfig(configService: EnvReader): MysqlConfig {
  const host =
    configService.get<string>('DASHBOARD_MYSQL_HOST') ??
    configService.get<string>('MYSQL_HOST') ??
    '127.0.0.1';
  const port = Number(
    configService.get<string>('DASHBOARD_MYSQL_PORT') ??
      configService.get<string>('MYSQL_PORT') ??
      '3307',
  );
  const user =
    configService.get<string>('DASHBOARD_MYSQL_USER') ??
    configService.get<string>('MYSQL_USER') ??
    'root';
  const password =
    configService.get<string>('DASHBOARD_MYSQL_PASSWORD') ??
    configService.get<string>('MYSQL_ROOT_PASSWORD') ??
    configService.get<string>('MYSQL_PASSWORD') ??
    '';
  const database =
    configService.get<string>('DASHBOARD_MYSQL_DATABASE') ??
    configService.get<string>('MYSQL_DATABASE') ??
    'myerpplus';

  return { host, port, user, password, database };
}

export function getTemplateRootCandidates(configuredRoot: string | undefined): string[] {
  return [
    configuredRoot,
    resolve('/myerpplus-db-mapping/dashboard-mapping/sql-templates'),
    resolve(process.cwd(), 'sql-templates'),
    resolve(process.cwd(), '../myerpplus-db-mapping/dashboard-mapping/sql-templates'),
    resolve(process.cwd(), '../../apps/myerpplus-db-mapping/dashboard-mapping/sql-templates'),
    resolve(__dirname, '../../../myerpplus-db-mapping/dashboard-mapping/sql-templates'),
  ].filter((value): value is string => Boolean(value));
}

export function resolveTemplateRoot(candidates: string[]): string {
  const root = candidates.find((candidate) => existsSync(candidate));
  if (!root) {
    throw new InternalServerErrorException(
      `Dashboard SQL template root not found. Checked: ${candidates.join(', ')}`,
    );
  }
  return root;
}

export function resolveTemplateRootForDomain(
  candidates: string[],
  domain: string,
): string {
  const rootWithDomain = candidates.find((candidate) => existsSync(resolve(candidate, domain)));
  if (rootWithDomain) {
    return rootWithDomain;
  }
  return resolveTemplateRoot(candidates);
}

export function resolveTemplateRootForDomainAndFile(
  candidates: string[],
  domain: string,
  fileName: string,
): string {
  const rootWithFile = candidates.find((candidate) =>
    existsSync(resolve(candidate, domain, fileName)),
  );
  if (rootWithFile) {
    return rootWithFile;
  }
  return resolveTemplateRootForDomain(candidates, domain);
}

export function quoteString(value: string): string {
  return `'${value.replaceAll('\\', '\\\\').replaceAll("'", "\\'")}'`;
}

export function quoteDate(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new InternalServerErrorException(`Invalid date literal format: ${value}`);
  }
  return `'${value}'`;
}

export function assertInt(value: number, label: string): string {
  if (!Number.isInteger(value) || value < 0) {
    throw new InternalServerErrorException(`Invalid integer for ${label}`);
  }
  return String(value);
}

export function assertIdentifier(value: string, label: string): string {
  if (!/^[A-Za-z_][A-Za-z0-9_]*$/.test(value)) {
    throw new InternalServerErrorException(`Unsafe SQL identifier for ${label}`);
  }
  return value;
}
