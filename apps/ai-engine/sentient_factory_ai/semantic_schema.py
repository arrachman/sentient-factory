from __future__ import annotations

from datetime import datetime, timezone
import json
from pathlib import Path

import psycopg2
from psycopg2.extras import RealDictCursor

from .models import SemanticColumn, SemanticSchemaResponse, SemanticTable


SYSTEM_SCHEMAS = ("pg_catalog", "information_schema")


def build_semantic_schema(
    database_url: str,
    table_limit: int,
    sample_limit: int,
    include_samples: bool,
    *,
    schema_source: str = "postgres_introspection",
    schema_key: str = "all",
    manifest_path: Path | None = None,
    query_text: str | None = None,
) -> SemanticSchemaResponse:
    if schema_source == "myerpplus_file":
      return build_semantic_schema_from_manifest(
          manifest_path=manifest_path,
          schema_key=schema_key,
          query_text=query_text,
      )

    return build_semantic_schema_from_postgres(
        database_url=database_url,
        table_limit=table_limit,
        sample_limit=sample_limit,
        include_samples=include_samples,
    )


def build_semantic_schema_from_manifest(
    *,
    manifest_path: Path | None,
    schema_key: str = "all",
    query_text: str | None = None,
) -> SemanticSchemaResponse:
    resolved_manifest_path = _resolve_manifest_path(manifest_path)
    manifest = json.loads(resolved_manifest_path.read_text())
    selected_key = _infer_schema_key_from_query(query_text) if query_text else schema_key
    entry = next(
        (item for item in manifest["schemas"] if item["key"] == selected_key or item["domain"] == selected_key),
        None,
    )
    if entry is None:
        entry = next(item for item in manifest["schemas"] if item["key"] == "all")

    schema_file = resolved_manifest_path.parent / entry["file"]
    payload = json.loads(schema_file.read_text())

    semantic_tables: list[SemanticTable] = []
    for table in payload.get("tables", []):
        columns = [
            SemanticColumn(
                name=column_name,
                description=description,
            )
            for column_name, description in table.get("columns", {}).items()
        ]
        semantic_tables.append(
            SemanticTable(
                schema="myerpplus",
                name=str(table["table_name"]),
                alias=table.get("alias"),
                table_description=table.get("description"),
                synonyms=list(table.get("synonyms", [])),
                always_apply_filters=table.get("always_apply_filters"),
                metrics=dict(table.get("metrics", {})),
                relationships=list(table.get("relationships", [])),
                columns=columns,
                primary_key=[],
                row_count_estimate=None,
                sample_rows=[],
            )
        )

    return SemanticSchemaResponse(
        generated_at=datetime.now(timezone.utc).isoformat(),
        source=f"myerpplus_manifest:{entry['key']}",
        tables=semantic_tables,
    )


def build_semantic_schema_from_postgres(
    database_url: str,
    table_limit: int,
    sample_limit: int,
    include_samples: bool,
) -> SemanticSchemaResponse:
    with psycopg2.connect(database_url) as connection:
        with connection.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(
                """
                SELECT
                  t.table_schema,
                  t.table_name,
                  COALESCE(s.n_live_tup::bigint, 0) AS row_count_estimate
                FROM information_schema.tables t
                LEFT JOIN pg_stat_user_tables s
                  ON s.schemaname = t.table_schema
                 AND s.relname = t.table_name
                WHERE t.table_type = 'BASE TABLE'
                  AND t.table_schema NOT IN %s
                ORDER BY row_count_estimate DESC, t.table_schema, t.table_name
                LIMIT %s
                """,
                (SYSTEM_SCHEMAS, table_limit),
            )
            tables = cursor.fetchall()

            semantic_tables: list[SemanticTable] = []
            for table in tables:
                schema_name = str(table["table_schema"])
                table_name = str(table["table_name"])
                columns = _load_columns(cursor, schema_name, table_name)
                primary_key = _load_primary_key(cursor, schema_name, table_name)
                sample_rows = _load_sample_rows(cursor, schema_name, table_name, sample_limit) if include_samples else []
                semantic_tables.append(
                    SemanticTable(
                        schema=schema_name,
                        name=table_name,
                        columns=columns,
                        primary_key=primary_key,
                        row_count_estimate=int(table["row_count_estimate"]) if table["row_count_estimate"] is not None else None,
                        sample_rows=sample_rows,
                    )
                )

    return SemanticSchemaResponse(
        generated_at=datetime.now(timezone.utc).isoformat(),
        source="postgres_introspection",
        tables=semantic_tables,
    )


def _load_columns(cursor: RealDictCursor, schema_name: str, table_name: str) -> list[SemanticColumn]:
    cursor.execute(
        """
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_schema = %s AND table_name = %s
        ORDER BY ordinal_position
        """,
        (schema_name, table_name),
    )
    return [
        SemanticColumn(
            name=str(row["column_name"]),
            data_type=str(row["data_type"]),
            nullable=str(row["is_nullable"]) == "YES",
        )
        for row in cursor.fetchall()
    ]


def _load_primary_key(cursor: RealDictCursor, schema_name: str, table_name: str) -> list[str]:
    cursor.execute(
        """
        SELECT kcu.column_name
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu
          ON tc.constraint_name = kcu.constraint_name
         AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
          AND tc.table_schema = %s
          AND tc.table_name = %s
        ORDER BY kcu.ordinal_position
        """,
        (schema_name, table_name),
    )
    return [str(row["column_name"]) for row in cursor.fetchall()]


def _load_sample_rows(cursor: RealDictCursor, schema_name: str, table_name: str, sample_limit: int) -> list[dict[str, object]]:
    quoted_schema = schema_name.replace('"', '""')
    quoted_name = table_name.replace('"', '""')
    quoted_table = f'"{quoted_schema}"."{quoted_name}"'
    cursor.execute(f"SELECT * FROM {quoted_table} LIMIT %s", (sample_limit,))
    return [dict(row) for row in cursor.fetchall()]


def _resolve_manifest_path(manifest_path: Path | None) -> Path:
    candidates = []
    if manifest_path is not None:
        candidates.append(manifest_path)

    candidates.extend(
        [
            Path("apps/myerpplus-db-mapping/db/semantic-schema-manifest.json"),
            Path("../myerpplus-db-mapping/db/semantic-schema-manifest.json"),
        ]
    )

    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.exists():
            return resolved

    raise FileNotFoundError("semantic-schema-manifest.json not found")


def _infer_schema_key_from_query(query_text: str | None) -> str:
    q = str(query_text or "").lower()
    compact = f" {' '.join(q.replace('_', ' _ ').split())} "
    tokens = set(compact.strip().split())

    rules: list[tuple[str, list[str]]] = [
        ("sales", ["sales", "penjualan", "piutang", "invoice", "faktur", "so", "do", "quotation"]),
        ("purchasing", ["purchasing", "pembelian", "hutang", "supplier", "po", "grn", "rfq", "pr"]),
        ("inventory", ["inventory", "gudang", "stok", "mutasi", "warehouse", "opname"]),
        ("finance", ["finance", "accounting", "jurnal", "buku besar", "kas", "bank", "giro", "coa", "saldo awal"]),
        ("master", ["master", "referensi", "kontak", "barang", "item", "akun", "customer", "vendor"]),
        ("m1", ["m1_"]),
        ("m2", ["m2_"]),
        ("m3", ["m3_"]),
        ("m4", ["m4_"]),
        ("m5", ["m5_"]),
    ]

    def has_keyword(keyword: str) -> bool:
        if keyword.endswith("_"):
            return keyword in q
        if " " in keyword:
            return f" {keyword} " in compact
        if len(keyword) <= 3:
            return keyword in tokens
        return f" {keyword} " in compact

    for key, keywords in rules:
        if any(has_keyword(keyword) for keyword in keywords):
            return key

    return "all"
