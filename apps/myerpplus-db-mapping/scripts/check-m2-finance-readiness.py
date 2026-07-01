#!/usr/bin/env python3
"""Report m2 finance family readiness for OBT bootstrap."""

from __future__ import annotations

import importlib.util
from pathlib import Path


ROOT = Path("/opt/sentient-factory")
PG_RUNNER_PATH = ROOT / "apps" / "myerpplus-db-mapping" / "scripts" / "run-pg-obt-table-sql.py"

WATCH_GROUPS = {
    "finance_document_header": ["m2_cr", "m2_cd", "m2_rm", "m2_sm", "m2_cb", "m2_gj"],
    "finance_document_line": ["m2_cr_detail", "m2_cd_detail", "m2_rm_detail", "m2_sm_detail", "m2_cb_detail", "m2_gj_detail"],
    "finance_allocation": ["m2_rm_pay", "m2_sm_pay", "m2_cb_pay"],
    "finance_budgeting": ["m2_bd", "m2_bd_detail"],
    "finance_adjustment": ["m2_aj", "m2_aj_detail"],
}


def load_pg_runner():
    spec = importlib.util.spec_from_file_location("pg_runner", PG_RUNNER_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load PostgreSQL runner from {PG_RUNNER_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def main() -> int:
    pg_runner = load_pg_runner()
    pg_runner.load_env_files()
    client = pg_runner.SimplePgClient(pg_runner.resolve_database_url())
    client.connect()
    try:
        print("group\ttable_name\trow_count\tstatus")
        for group, tables in WATCH_GROUPS.items():
            for table in tables:
                try:
                    _, rows = client.query(f"SELECT COUNT(*) FROM myerpplus_landing.{table}")
                    count = int(rows[0][0]) if rows else 0
                    status = "ready" if count > 0 else "empty"
                except RuntimeError as error:
                    if 'does not exist' in str(error):
                        count = -1
                        status = "missing"
                    else:
                        raise
                print(f"{group}\t{table}\t{count}\t{status}")
    finally:
        client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
