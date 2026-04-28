export type CdcEnvelope = {
  topic: string;
  key: string;
  payload: Record<string, unknown>;
};

export type DomainUpsert = {
  tableName: string;
  primaryKey: string;
  row: Record<string, unknown>;
};

export function buildDomainUpserts(event: CdcEnvelope): DomainUpsert[] {
  void event;
  return [];
}
