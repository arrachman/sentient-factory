from __future__ import annotations

import json
from datetime import datetime, timezone
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
    schema_source: str = "postgres_introspection",
    source: str | None = None,
    schema_key: str = "all",
    manifest_path: str | Path | None = None,
    query_text: str | None = None,
) -> SemanticSchemaResponse:
    effective_source = source or schema_source

    if effective_source == "myerpplus_file":
        return _build_from_file(manifest_path=manifest_path)

    return _build_from_postgres(
        database_url=database_url,
        table_limit=table_limit,
        sample_limit=sample_limit,
        include_samples=include_samples,
    )


def _build_from_file(manifest_path: str | Path | None) -> SemanticSchemaResponse:
    schema_file = _resolve_schema_file_path(manifest_path)
    payload = json.loads(schema_file.read_text(encoding="utf-8"))
    if payload.get("artifact") == "obt-agent-mapping":
        return _build_from_obt_agent_mapping(payload)
    semantic_tables: list[SemanticTable] = []

    for table in payload.get("tables", []):
        columns = [
            SemanticColumn(name=name, description=description)
            for name, description in table.get("columns", {}).items()
        ]
        semantic_tables.append(
            SemanticTable(
                schema="myerpplus",
                name=str(table.get("table_name", "")),
                alias=table.get("alias"),
                table_description=table.get("description"),
                synonyms=list(table.get("synonyms", [])),
                always_apply_filters=table.get("always_apply_filters"),
                columns=columns,
                metrics=dict(table.get("metrics", {})),
                relationships=list(table.get("relationships", [])),
            )
        )

    return SemanticSchemaResponse(
        generated_at=datetime.now(timezone.utc).isoformat(),
        source="myerpplus_file:semantic-schema.json",
        tables=semantic_tables,
    )


def _build_from_obt_agent_mapping(payload: dict[str, object]) -> SemanticSchemaResponse:
    semantic_tables: list[SemanticTable] = []

    for obt in payload.get("canonical_obts", []):
        if not isinstance(obt, dict):
            continue
        name = str(obt.get("name", ""))
        if not name:
            continue

        columns = [
            SemanticColumn(name="domain", description=str(obt.get("domain", ""))),
            SemanticColumn(name="business_grain", description=str(obt.get("business_grain", ""))),
            SemanticColumn(name="status", description=str(obt.get("status", ""))),
            SemanticColumn(
                name="current_row_count",
                data_type="integer",
                nullable=True,
                description=f"Current rollout row count for {name}.",
            ),
            SemanticColumn(
                name="physical_targets",
                data_type="json",
                nullable=True,
                description="Physical PostgreSQL targets that currently implement this canonical OBT.",
            ),
            SemanticColumn(
                name="source_tables",
                data_type="json",
                nullable=True,
                description="Primary source families used to build this canonical OBT.",
            ),
            SemanticColumn(
                name="safe_join_path",
                data_type="json",
                nullable=True,
                description="Safe join hints for agent usage.",
            ),
            SemanticColumn(name="notes", description=str(obt.get("notes", ""))),
        ]

        semantic_tables.append(
            SemanticTable(
                schema="obt",
                name=name,
                alias=name,
                table_description=str(obt.get("business_grain", "")),
                synonyms=[str(obt.get("domain", "")), str(obt.get("status", ""))],
                columns=columns,
                metrics={"current_row_count": str(obt.get("current_row_count", 0))},
                relationships=[
                    {"type": "physical_target", "target": target}
                    for target in obt.get("physical_targets", [])
                    if isinstance(target, str)
                ],
            )
        )

    for output in payload.get("active_physical_outputs", []):
        if not isinstance(output, dict):
            continue
        name = str(output.get("name", ""))
        if not name:
            continue
        semantic_tables.append(
            SemanticTable(
                schema="obt_physical",
                name=name,
                alias=name,
                table_description=f"Active physical OBT output mapped to {output.get('canonical_parent', '')}",
                columns=[
                    SemanticColumn(name="domain", description=str(output.get("domain", ""))),
                    SemanticColumn(name="canonical_parent", description=str(output.get("canonical_parent", ""))),
                    SemanticColumn(
                        name="current_row_count",
                        data_type="integer",
                        nullable=True,
                        description=f"Current row count for active physical output {name}.",
                    ),
                ],
                metrics={"current_row_count": str(output.get("current_row_count", 0))},
                relationships=[
                    {"type": "canonical_parent", "target": str(output.get("canonical_parent", ""))}
                ],
            )
        )

    return SemanticSchemaResponse(
        generated_at=datetime.now(timezone.utc).isoformat(),
        source="myerpplus_file:obt-agent-mapping.json",
        tables=semantic_tables,
    )


def _resolve_schema_file_path(manifest_path: str | Path | None) -> Path:
    candidates: list[Path] = []
    if manifest_path is not None:
        candidates.append(Path(manifest_path))

    module_path = Path(__file__).resolve()
    candidates.append(Path("apps/myerpplus-db-mapping/db/obt-agent-mapping.json"))
    candidates.append(Path("apps/myerpplus-db-mapping/db/semantic-schema.json"))
    candidates.append(Path("/tmp/myerpplus-db-mapping/db/obt-agent-mapping.json"))
    candidates.append(Path("/tmp/myerpplus-db-mapping/db/semantic-schema.json"))
    candidates.append(Path("/myerpplus-db-mapping/db/obt-agent-mapping.json"))
    candidates.append(Path("/myerpplus-db-mapping/db/semantic-schema.json"))

    for parent in module_path.parents:
        candidates.append(parent / "apps/myerpplus-db-mapping/db/obt-agent-mapping.json")
        candidates.append(parent / "apps/myerpplus-db-mapping/db/semantic-schema.json")
        candidates.append(parent / "myerpplus-db-mapping/db/obt-agent-mapping.json")
        candidates.append(parent / "myerpplus-db-mapping/db/semantic-schema.json")

    for candidate in candidates:
        resolved = candidate.resolve()
        if resolved.exists():
            return resolved

    raise FileNotFoundError("Unable to locate obt-agent-mapping.json or semantic-schema.json")


def _build_from_postgres(
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
