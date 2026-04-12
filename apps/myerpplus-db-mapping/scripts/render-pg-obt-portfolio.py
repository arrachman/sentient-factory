#!/usr/bin/env python3
"""Render PostgreSQL bootstrap tables for the full OBT portfolio from the concept doc."""

from __future__ import annotations

import re
from pathlib import Path


ROOT = Path("/home/rania/apps/sentient-factory")
CONCEPT_DOC = ROOT / "docs" / "docs" / "08-obt" / "konsep-obt-m0-m12.md"
OUT_FILE = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-tables"
    / "pg_create_table_obt_portfolio.sql"
)

EXCLUDED = {
    # Explicitly marked as not recommended as the main semantic name.
    "obt_m5_sales_document_line_flow",
}


COMMON_COLUMNS = [
    "obt_id bigserial PRIMARY KEY",
    "obt_name text NOT NULL",
    "source_module text",
    "source_doc_type text",
    "source_header_id text",
    "source_detail_id text",
    "source_allocation_id text",
    "doc_no text",
    "doc_date timestamptz",
    "doc_status_code text",
    "doc_status_name text",
    "branch_code text",
    "branch_name text",
    "location_code text",
    "location_name text",
    "contact_id text",
    "contact_code text",
    "contact_name text",
    "item_id text",
    "item_code text",
    "item_name text",
    "uom_code text",
    "upstream_doc_no text",
    "downstream_doc_no text",
    "lineage_path text",
    "qty numeric(20,6)",
    "amount numeric(20,6)",
    "currency_code text",
    "exchange_rate numeric(20,6)",
    "input_user_id text",
    "input_user_name text",
    "modified_user_id text",
    "modified_user_name text",
    "source_payload jsonb",
    "etl_batch_id text",
    "etl_loaded_at timestamptz NOT NULL DEFAULT now()",
    "etl_updated_at timestamptz NOT NULL DEFAULT now()",
]


def extract_obt_names() -> list[str]:
    text = CONCEPT_DOC.read_text()
    names = sorted(set(re.findall(r"`(obt_[a-z0-9_]+)`", text)))
    return [name for name in names if name not in EXCLUDED]


def render_table(table_name: str) -> str:
    cols = ",\n    ".join(COMMON_COLUMNS)
    return f"""CREATE TABLE IF NOT EXISTS public.{table_name} (
    {cols}
);

CREATE INDEX IF NOT EXISTS idx_{table_name}_doc_date
    ON public.{table_name} (doc_date);

CREATE INDEX IF NOT EXISTS idx_{table_name}_doc_no
    ON public.{table_name} (doc_no);

CREATE INDEX IF NOT EXISTS idx_{table_name}_source_header_id
    ON public.{table_name} (source_header_id);

CREATE INDEX IF NOT EXISTS idx_{table_name}_source_detail_id
    ON public.{table_name} (source_detail_id);

CREATE INDEX IF NOT EXISTS idx_{table_name}_contact_code
    ON public.{table_name} (contact_code);

CREATE INDEX IF NOT EXISTS idx_{table_name}_item_code
    ON public.{table_name} (item_code);

"""


def main() -> None:
    names = extract_obt_names()
    OUT_FILE.parent.mkdir(parents=True, exist_ok=True)
    header = [
        "-- Auto-generated bootstrap OBT portfolio tables from docs/docs/08-obt/konsep-obt-m0-m12.md",
        "-- These are empty ETL targets with a shared output contract.",
        f"-- Table count: {len(names)}",
        "",
    ]
    body = "".join(render_table(name) for name in names)
    OUT_FILE.write_text("\n".join(header) + body)
    print(f"rendered {OUT_FILE}")
    print(f"table_count={len(names)}")


if __name__ == "__main__":
    main()
