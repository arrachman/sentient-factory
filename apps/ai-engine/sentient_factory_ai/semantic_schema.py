from __future__ import annotations

from datetime import datetime, timezone

import psycopg2
from psycopg2.extras import RealDictCursor

from .models import SemanticColumn, SemanticSchemaResponse, SemanticTable


SYSTEM_SCHEMAS = ("pg_catalog", "information_schema")


def build_semantic_schema(database_url: str, table_limit: int, sample_limit: int, include_samples: bool) -> SemanticSchemaResponse:
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
