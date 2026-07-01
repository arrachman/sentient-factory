#!/usr/bin/env python3
"""Apply CDC current-state rows into landing and refresh OBT tables."""

from __future__ import annotations

import argparse
import importlib.util
from pathlib import Path


ROOT = Path("/opt/sentient-factory")
PG_RUNNER_PATH = ROOT / "apps" / "myerpplus-db-mapping" / "scripts" / "run-pg-obt-table-sql.py"
LANDING_UPSERT_SQL = (
    ROOT
    / "apps"
    / "myerpplus-db-mapping"
    / "db"
    / "obt-physical-sql"
    / "pgsql-landing"
    / "pg_upsert_myerpplus_landing_tables_from_cdc.sql"
)
OBT_INSERT_FILES = [
    "pg_insert_obt_admin_access.sql",
    "pg_insert_dim_branch.sql",
    "pg_insert_dim_location.sql",
    "pg_insert_dim_warehouse.sql",
    "pg_insert_dim_coa.sql",
    "pg_insert_dim_terms.sql",
    "pg_insert_dim_division.sql",
    "pg_insert_dim_project.sql",
    "pg_insert_dim_cost_center.sql",
    "pg_insert_dim_contact.sql",
    "pg_insert_dim_item.sql",
    "pg_insert_dim_item_warehouse_stock.sql",
    "pg_insert_obt_profit_loss_line.sql",
    "pg_insert_obt_cash_disbursement_line_flow.sql",
    "pg_insert_obt_cash_receipt_line_flow.sql",
    "pg_insert_obt_finance_allocation.sql",
    "pg_insert_obt_finance_payment_history_event.sql",
    "pg_insert_obt_finance_document_history_event.sql",
    "pg_insert_obt_finance_document_history_line_event.sql",
    "pg_insert_obt_finance_document.sql",
    "pg_insert_obt_receipt_money_line_flow.sql",
    "pg_insert_obt_finance_document_line.sql",
    "pg_insert_obt_inventory_request_event.sql",
    "pg_insert_dim_inventory_price_setup.sql",
    "pg_insert_dim_inventory_refuel_event.sql",
    "pg_insert_dim_inventory_daily_check.sql",
    "pg_insert_dim_inventory_rw.sql",
    "pg_insert_dim_inventory_note.sql",
    "pg_insert_dim_inventory_attachment.sql",
    "pg_insert_obt_inventory_document_event.sql",
    "pg_insert_obt_inventory_document_history_event.sql",
    "pg_insert_obt_inventory_document_history_line_event.sql",
    "pg_insert_obt_inventory_movement_line.sql",
    "pg_insert_obt_menu_authorization.sql",
    "pg_insert_dim_purchase_note.sql",
    "pg_insert_dim_purchase_attachment.sql",
    "pg_insert_obt_purchase_comparative_event.sql",
    "pg_insert_obt_purchase_invoice_exchange_event.sql",
    "pg_insert_obt_sales_order_line_flow.sql",
    "pg_insert_dim_sales_note.sql",
    "pg_insert_dim_sales_attachment.sql",
    "pg_insert_obt_sales_invoice_exchange_event.sql",
    "pg_insert_obt_sales_point_adjustment_event.sql",
    "pg_insert_obt_sales_closing_snapshot.sql",
    "pg_insert_obt_sales_forecast_event.sql",
    "pg_insert_obt_system_configuration.sql",
    "pg_insert_obt_purchase_document_line_event.sql",
    "pg_insert_obt_purchase_payment.sql",
    "pg_insert_obt_purchase_line_flow.sql",
    "pg_insert_dim_manufacturing_note.sql",
    "pg_insert_dim_manufacturing_attachment.sql",
    "pg_insert_obt_bom_route_snapshot.sql",
    "pg_insert_obt_manufacturing_execution.sql",
    "pg_insert_dim_asset_note.sql",
    "pg_insert_dim_asset_attachment.sql",
    "pg_insert_obt_asset_lifecycle.sql",
    "pg_insert_obt_asset_depreciation_event.sql",
    "pg_insert_obt_asset_mutation.sql",
    "pg_insert_obt_sales_receivable.sql",
    "pg_insert_obt_sales_line_flow.sql",
    "pg_insert_obt_pos_to_sales.sql",
]
OBT_SQL_DIR = (
    ROOT / "apps" / "myerpplus-db-mapping" / "db" / "obt-physical-sql" / "pgsql-tables"
)
DOMAIN_OBT_FILES = {
    "m0": [
        "pg_insert_obt_admin_access.sql",
        "pg_insert_obt_menu_authorization.sql",
        "pg_insert_obt_system_configuration.sql",
    ],
    "m1": [
        "pg_insert_dim_branch.sql",
        "pg_insert_dim_location.sql",
        "pg_insert_dim_warehouse.sql",
        "pg_insert_dim_coa.sql",
        "pg_insert_dim_terms.sql",
        "pg_insert_dim_division.sql",
        "pg_insert_dim_project.sql",
        "pg_insert_dim_cost_center.sql",
        "pg_insert_dim_contact.sql",
        "pg_insert_dim_item.sql",
        "pg_insert_dim_item_warehouse_stock.sql",
    ],
    "m2": [
        "pg_insert_dim_finance_note.sql",
        "pg_insert_dim_finance_attachment.sql",
        "pg_insert_dim_finance_giro_list.sql",
        "pg_insert_obt_cash_bank_movement.sql",
        "pg_insert_obt_profit_loss_line.sql",
        "pg_insert_obt_cash_disbursement_line_flow.sql",
        "pg_insert_obt_cash_receipt_line_flow.sql",
        "pg_insert_obt_finance_allocation.sql",
        "pg_insert_obt_finance_payment_history_event.sql",
        "pg_insert_obt_finance_document_history_event.sql",
        "pg_insert_obt_finance_document_history_line_event.sql",
        "pg_insert_obt_finance_budget_realization.sql",
        "pg_insert_obt_finance_document.sql",
        "pg_insert_obt_receipt_money_line_flow.sql",
        "pg_insert_obt_finance_document_line.sql",
    ],
    "m3": [
        "pg_insert_obt_inventory_request_event.sql",
        "pg_insert_dim_inventory_price_setup.sql",
        "pg_insert_dim_inventory_refuel_event.sql",
        "pg_insert_dim_inventory_daily_check.sql",
        "pg_insert_dim_inventory_rw.sql",
        "pg_insert_dim_inventory_note.sql",
        "pg_insert_dim_inventory_attachment.sql",
        "pg_insert_obt_inventory_document_event.sql",
        "pg_insert_obt_inventory_document_history_event.sql",
        "pg_insert_obt_inventory_document_history_line_event.sql",
        "pg_insert_obt_inventory_movement_line.sql",
    ],
    "m4": [
        "pg_insert_dim_purchase_note.sql",
        "pg_insert_dim_purchase_attachment.sql",
        "pg_insert_obt_purchase_comparative_event.sql",
        "pg_insert_obt_purchase_invoice_exchange_event.sql",
        "pg_insert_obt_purchase_document_line_event.sql",
        "pg_insert_obt_purchase_payment.sql",
        "pg_insert_obt_purchase_line_flow.sql",
    ],
    "m6": [
        "pg_insert_dim_manufacturing_note.sql",
        "pg_insert_dim_manufacturing_attachment.sql",
        "pg_insert_obt_bom_route_snapshot.sql",
        "pg_insert_obt_manufacturing_execution.sql",
    ],
    "m7": [
        "pg_insert_dim_asset_note.sql",
        "pg_insert_dim_asset_attachment.sql",
        "pg_insert_obt_asset_lifecycle.sql",
        "pg_insert_obt_asset_depreciation_event.sql",
        "pg_insert_obt_asset_mutation.sql",
    ],
    "m5": [
        "pg_insert_dim_sales_note.sql",
        "pg_insert_dim_sales_attachment.sql",
        "pg_insert_obt_sales_invoice_exchange_event.sql",
        "pg_insert_obt_sales_point_adjustment_event.sql",
        "pg_insert_obt_sales_closing_snapshot.sql",
        "pg_insert_obt_sales_forecast_event.sql",
        "pg_insert_obt_sales_order_line_flow.sql",
        "pg_insert_obt_sales_receivable.sql",
        "pg_insert_obt_sales_line_flow.sql",
    ],
    "m12": [
        "pg_insert_obt_pos_to_sales.sql",
    ],
}
DOMAIN_PATTERNS = {
    "m0": ["myerpplus.m0_%"],
    "m1": ["myerpplus.m1_%"],
    "m2": ["myerpplus.m2_%"],
    "m3": ["myerpplus.m3_%"],
    "m4": ["myerpplus.m4_%"],
    "m5": ["myerpplus.m5_%"],
    "m6": ["myerpplus.m6_%"],
    "m7": ["myerpplus.m7_%"],
    "m12": [r"myerpplus.m\_12\_%"],
}
DOMAIN_LANDING_TABLES = {
    "m0": ["m0_user", "m0_menu", "m0_nomor", "m0_role", "m0_role_menu", "m0_user_role", "m0_userlog"],
    "m1": ["m1_branch", "m1_class_product", "m1_coa", "m1_contact", "m1_contact_category", "m1_cost_center", "m1_currency", "m1_customer_category", "m1_division", "m1_expedition", "m1_bank", "m1_city", "m1_country", "m1_department", "m1_item", "m1_item_category", "m1_item_permission", "m1_item_stock_warehouse", "m1_item_transaction", "m1_item_type", "m1_location", "m1_material", "m1_merk", "m1_model", "m1_other_cost", "m1_project", "m1_province", "m1_salesman_category", "m1_section", "m1_size", "m1_subdepartment", "m1_subdivision", "m1_supplier_category", "m1_tax", "m1_terms", "m1_transaction_note", "m1_transaction_note_detail", "m1_type_sa", "m1_unit", "m1_warehouse"],
    "m2": ["m2_bd", "m2_bd_detail", "m2_bd_history", "m2_bd_detail_history", "m2_cd", "m2_cd_detail", "m2_cd_history", "m2_cd_detail_history", "m2_cr", "m2_cr_detail", "m2_cr_history", "m2_cr_detail_history", "m2_aj", "m2_aj_detail", "m2_aj_history", "m2_aj_detail_history", "m2_cb", "m2_cb_detail", "m2_cb_history", "m2_cb_detail_history", "m2_cb_pay", "m2_cb_pay_history", "m2_files", "m2_giro_list", "m2_gj", "m2_gj_detail", "m2_gj_history", "m2_gj_detail_history", "m2_jm", "m2_jm_detail", "m2_jm_history", "m2_jm_detail_history", "m2_notes", "m2_rg", "m2_rg_detail", "m2_rg_history", "m2_rg_detail_history", "m2_rgc", "m2_rgc_detail", "m2_rgc_history", "m2_rgc_detail_history", "m2_rm", "m2_rm_detail", "m2_rm_history", "m2_rm_detail_history", "m2_rm_pay", "m2_rm_pay_history", "m2_realization", "m2_sg", "m2_sg_detail", "m2_sg_history", "m2_sg_detail_history", "m2_sgc", "m2_sgc_detail", "m2_sgc_history", "m2_sgc_detail_history", "m2_sm", "m2_sm_detail", "m2_sm_history", "m2_sm_detail_history", "m2_sm_pay", "m2_sm_pay_history", "m2_transaction_journal"],
    "m3": [
        "m3_sa", "m3_sa_detail", "m3_sa_history", "m3_sa_detail_history",
        "m3_mr", "m3_mr_detail", "m3_mr_history", "m3_mr_detail_history",
        "m3_rs", "m3_rs_detail", "m3_rs_history", "m3_rs_detail_history",
        "m3_sp", "m3_sp_detail", "m3_sp_history", "m3_sp_detail_history",
        "m3_ts", "m3_ts_detail", "m3_ts_history", "m3_ts_detail_history",
        "m3_ib", "m3_ib_detail", "m3_ib_history", "m3_ib_detail_history",
        "m3_pa", "m3_pa_detail",
        "m3_rf", "m3_rf_detail",
        "m3_dc", "m3_dc_detail", "m3_dc_check", "m3_dc_history", "m3_dc_detail_history", "m3_dc_check_history",
        "m3_rw",
        "m3_notes", "m3_files"
    ],
    "m4": ["m4_po", "m4_po_detail", "m4_ap", "m4_ap_pay", "m4_cs", "m4_cs_detail", "m4_files", "m4_grn", "m4_grn_detail", "m4_notes", "m4_pie", "m4_pie_detail", "m4_ri", "m4_ri_detail", "m4_dnr", "m4_dnr_detail", "m4_prt", "m4_prt_detail", "m4_vp", "m4_vp_detail", "m4_vpp", "m4_vpp_detail"],
    "m6": ["m6_bom", "m6_bom_in", "m6_bom_out", "m6_mrs", "m6_mrs_out", "m6_mrn", "m6_mrn_out", "m6_pd", "m6_pd_in", "m6_pd_out", "m6_pdr", "m6_pdr_in", "m6_pdr_out", "m6_wo", "m6_wo_in", "m6_wo_out", "m6_wo_activity", "m6_wo_route_card", "m6_notes", "m6_files"],
    "m7": ["m7_asset", "m7_ar", "m7_ar_detail", "m7_aq", "m7_aq_detail", "m7_ao", "m7_ao_detail", "m7_ae", "m7_ae_detail", "m7_at", "m7_at_detail", "m7_at_pay", "m7_ag", "m7_ag_detail", "m7_da", "m7_da_detail", "m7_notes", "m7_files"],
    "m5": ["m5_sq", "m5_sq_detail", "m5_so", "m5_so_detail", "m5_as", "m5_cl", "m5_files", "m5_ip", "m5_pi", "m5_pi_detail", "m5_pl", "m5_pl_detail", "m5_do", "m5_do_detail", "m5_dr", "m5_dr_detail", "m5_ic", "m5_ic_detail", "m5_notes", "m5_pv", "m5_pv_detail", "m5_rp", "m5_sf", "m5_sf_detail", "m5_si", "m5_si_detail", "m5_sie", "m5_sie_detail", "m5_spa", "m5_spa_detail", "m5_rnr", "m5_rnr_detail", "m5_sr", "m5_sr_detail"],
    "m12": ["m_12_pos_category", "m_12_pos_voucher_in", "m_12_pos_voucher_out"],
}
ALL_SYNC_DOMAINS = ["m0", "m1", "m2", "m3", "m4", "m5", "m6", "m7", "m12"]

AUDIT_SQL = """
CREATE TABLE IF NOT EXISTS public.etl_cdc_sync_batch_runs (
    batch_id bigserial PRIMARY KEY,
    batch_name text NOT NULL,
    source_system text NOT NULL,
    source_database text NOT NULL,
    target_database text NOT NULL,
    domains text NOT NULL,
    cdc_source_row_count bigint,
    status text NOT NULL,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    notes text
);

CREATE TABLE IF NOT EXISTS public.etl_cdc_sync_table_runs (
    id bigserial PRIMARY KEY,
    batch_id bigint NOT NULL REFERENCES public.etl_cdc_sync_batch_runs(batch_id),
    table_name text NOT NULL,
    sql_file text,
    loaded_row_count bigint,
    status text NOT NULL,
    started_at timestamptz NOT NULL DEFAULT now(),
    finished_at timestamptz,
    error_message text
);
"""


def load_pg_runner():
    spec = importlib.util.spec_from_file_location("pg_runner", PG_RUNNER_PATH)
    if spec is None or spec.loader is None:
        raise RuntimeError(f"Unable to load PostgreSQL runner from {PG_RUNNER_PATH}")
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module


def split_sql_statements(text: str) -> list[str]:
    statements: list[str] = []
    current: list[str] = []
    in_single = False
    in_double = False
    prev = ""
    for ch in text:
        if ch == "'" and not in_double and prev != "\\":
            in_single = not in_single
        elif ch == '"' and not in_single and prev != "\\":
            in_double = not in_double
        if ch == ";" and not in_single and not in_double:
            statement = "".join(current).strip()
            if statement:
                statements.append(statement)
            current = []
        else:
            current.append(ch)
        prev = ch
    tail = "".join(current).strip()
    if tail:
        statements.append(tail)
    return statements


def pg_literal(value):
    if value is None:
        return "NULL"
    if isinstance(value, bool):
        return "TRUE" if value else "FALSE"
    if isinstance(value, (int, float)):
        return str(value)
    text = str(value)
    return "'" + text.replace("\\", "\\\\").replace("'", "''") + "'"


def ensure_audit_tables(client) -> None:
    for statement in split_sql_statements(AUDIT_SQL):
        client.execute(statement)


def refresh_counts(client, tables: list[str]) -> None:
    for table in tables:
        _, rows = client.query(f"SELECT COUNT(*) AS total FROM public.{table}")
        print(f"{table}\t{rows[0][0]}")


def all_refresh_tables() -> list[str]:
    return [
        "obt_admin_access",
        "dim_branch",
        "dim_location",
        "dim_warehouse",
        "dim_coa",
        "dim_terms",
        "dim_division",
        "dim_project",
        "dim_cost_center",
        "dim_contact",
        "dim_item",
        "dim_item_warehouse_stock",
        "dim_finance_note",
        "dim_finance_attachment",
        "dim_finance_giro_list",
        "obt_cash_disbursement_line_flow",
        "obt_cash_receipt_line_flow",
        "obt_finance_allocation",
        "obt_finance_payment_history_event",
        "obt_finance_document_history_event",
        "obt_finance_document_history_line_event",
        "obt_finance_document",
        "obt_finance_budget_realization",
        "obt_finance_document_line",
        "dim_inventory_note",
        "dim_inventory_attachment",
        "obt_inventory_document_event",
        "obt_inventory_document_history_event",
        "obt_inventory_document_history_line_event",
        "obt_inventory_movement_line",
        "obt_menu_authorization",
        "obt_receipt_money_line_flow",
        "obt_sales_order_line_flow",
        "obt_system_configuration",
        "obt_purchase_document_line_event",
        "obt_purchase_payment",
        "obt_purchase_line_flow",
        "obt_sales_receivable",
        "obt_sales_line_flow",
        "obt_pos_to_sales",
    ]


def selected_obt_files(domains: list[str]) -> list[str]:
    files: list[str] = []
    for domain in domains:
        files.extend(DOMAIN_OBT_FILES.get(domain, []))
    seen: set[str] = set()
    ordered: list[str] = []
    for name in files:
        if name not in seen:
            seen.add(name)
            ordered.append(name)
    return ordered


def selected_refresh_tables(domains: list[str]) -> list[str]:
    table_map = {
        "pg_insert_obt_admin_access.sql": "obt_admin_access",
        "pg_insert_dim_branch.sql": "dim_branch",
        "pg_insert_dim_location.sql": "dim_location",
        "pg_insert_dim_warehouse.sql": "dim_warehouse",
        "pg_insert_dim_coa.sql": "dim_coa",
        "pg_insert_dim_terms.sql": "dim_terms",
        "pg_insert_dim_division.sql": "dim_division",
        "pg_insert_dim_project.sql": "dim_project",
        "pg_insert_dim_cost_center.sql": "dim_cost_center",
        "pg_insert_dim_contact.sql": "dim_contact",
        "pg_insert_dim_item.sql": "dim_item",
        "pg_insert_dim_item_warehouse_stock.sql": "dim_item_warehouse_stock",
        "pg_insert_dim_finance_note.sql": "dim_finance_note",
        "pg_insert_dim_finance_attachment.sql": "dim_finance_attachment",
        "pg_insert_dim_finance_giro_list.sql": "dim_finance_giro_list",
        "pg_insert_obt_cash_disbursement_line_flow.sql": "obt_cash_disbursement_line_flow",
        "pg_insert_obt_cash_receipt_line_flow.sql": "obt_cash_receipt_line_flow",
        "pg_insert_obt_finance_allocation.sql": "obt_finance_allocation",
        "pg_insert_obt_finance_payment_history_event.sql": "obt_finance_payment_history_event",
        "pg_insert_obt_finance_budget_realization.sql": "obt_finance_budget_realization",
        "pg_insert_obt_finance_document_history_event.sql": "obt_finance_document_history_event",
        "pg_insert_obt_finance_document_history_line_event.sql": "obt_finance_document_history_line_event",
        "pg_insert_obt_finance_document.sql": "obt_finance_document",
        "pg_insert_obt_finance_document_line.sql": "obt_finance_document_line",
        "pg_insert_dim_inventory_note.sql": "dim_inventory_note",
        "pg_insert_dim_inventory_attachment.sql": "dim_inventory_attachment",
        "pg_insert_obt_inventory_document_event.sql": "obt_inventory_document_event",
        "pg_insert_obt_inventory_document_history_event.sql": "obt_inventory_document_history_event",
        "pg_insert_obt_inventory_document_history_line_event.sql": "obt_inventory_document_history_line_event",
        "pg_insert_obt_inventory_movement_line.sql": "obt_inventory_movement_line",
        "pg_insert_obt_menu_authorization.sql": "obt_menu_authorization",
        "pg_insert_obt_receipt_money_line_flow.sql": "obt_receipt_money_line_flow",
        "pg_insert_obt_sales_order_line_flow.sql": "obt_sales_order_line_flow",
        "pg_insert_obt_system_configuration.sql": "obt_system_configuration",
        "pg_insert_obt_purchase_document_line_event.sql": "obt_purchase_document_line_event",
        "pg_insert_obt_purchase_payment.sql": "obt_purchase_payment",
        "pg_insert_obt_purchase_line_flow.sql": "obt_purchase_line_flow",
        "pg_insert_obt_sales_receivable.sql": "obt_sales_receivable",
        "pg_insert_obt_sales_line_flow.sql": "obt_sales_line_flow",
        "pg_insert_obt_pos_to_sales.sql": "obt_pos_to_sales",
    }
    return [table_map[name] for name in selected_obt_files(domains)]


def selected_file_table_pairs(domains: list[str]) -> list[tuple[str, str]]:
    table_map = {
        "pg_insert_obt_admin_access.sql": "obt_admin_access",
        "pg_insert_dim_branch.sql": "dim_branch",
        "pg_insert_dim_location.sql": "dim_location",
        "pg_insert_dim_warehouse.sql": "dim_warehouse",
        "pg_insert_dim_coa.sql": "dim_coa",
        "pg_insert_dim_terms.sql": "dim_terms",
        "pg_insert_dim_division.sql": "dim_division",
        "pg_insert_dim_project.sql": "dim_project",
        "pg_insert_dim_cost_center.sql": "dim_cost_center",
        "pg_insert_dim_contact.sql": "dim_contact",
        "pg_insert_dim_item.sql": "dim_item",
        "pg_insert_dim_item_warehouse_stock.sql": "dim_item_warehouse_stock",
        "pg_insert_dim_finance_note.sql": "dim_finance_note",
        "pg_insert_dim_finance_attachment.sql": "dim_finance_attachment",
        "pg_insert_dim_finance_giro_list.sql": "dim_finance_giro_list",
        "pg_insert_obt_cash_disbursement_line_flow.sql": "obt_cash_disbursement_line_flow",
        "pg_insert_obt_cash_receipt_line_flow.sql": "obt_cash_receipt_line_flow",
        "pg_insert_obt_finance_allocation.sql": "obt_finance_allocation",
        "pg_insert_obt_finance_payment_history_event.sql": "obt_finance_payment_history_event",
        "pg_insert_obt_finance_budget_realization.sql": "obt_finance_budget_realization",
        "pg_insert_obt_finance_document_history_event.sql": "obt_finance_document_history_event",
        "pg_insert_obt_finance_document_history_line_event.sql": "obt_finance_document_history_line_event",
        "pg_insert_obt_finance_document.sql": "obt_finance_document",
        "pg_insert_obt_finance_document_line.sql": "obt_finance_document_line",
        "pg_insert_dim_inventory_note.sql": "dim_inventory_note",
        "pg_insert_dim_inventory_attachment.sql": "dim_inventory_attachment",
        "pg_insert_obt_inventory_document_event.sql": "obt_inventory_document_event",
        "pg_insert_obt_inventory_document_history_event.sql": "obt_inventory_document_history_event",
        "pg_insert_obt_inventory_document_history_line_event.sql": "obt_inventory_document_history_line_event",
        "pg_insert_obt_inventory_movement_line.sql": "obt_inventory_movement_line",
        "pg_insert_obt_menu_authorization.sql": "obt_menu_authorization",
        "pg_insert_obt_receipt_money_line_flow.sql": "obt_receipt_money_line_flow",
        "pg_insert_obt_sales_order_line_flow.sql": "obt_sales_order_line_flow",
        "pg_insert_obt_system_configuration.sql": "obt_system_configuration",
        "pg_insert_obt_purchase_document_line_event.sql": "obt_purchase_document_line_event",
        "pg_insert_obt_purchase_payment.sql": "obt_purchase_payment",
        "pg_insert_obt_purchase_line_flow.sql": "obt_purchase_line_flow",
        "pg_insert_obt_sales_receivable.sql": "obt_sales_receivable",
        "pg_insert_obt_sales_line_flow.sql": "obt_sales_line_flow",
        "pg_insert_obt_pos_to_sales.sql": "obt_pos_to_sales",
    }
    return [(name, table_map[name]) for name in selected_obt_files(domains)]


def cdc_supported_source_count(client, domains: list[str]) -> int:
    where_parts: list[str] = []
    for domain in domains:
        for pattern in DOMAIN_PATTERNS.get(domain, []):
            if r"\_" in pattern:
                where_parts.append(f"source_table LIKE '{pattern}' ESCAPE '\\'")
            else:
                where_parts.append(f"source_table LIKE '{pattern}'")
    if not where_parts:
        return 0
    _, rows = client.query(
        "SELECT COUNT(*) FROM cdc_current_state WHERE " + " OR ".join(where_parts)
    )
    return int(rows[0][0]) if rows else 0


def selected_landing_tables(domains: list[str]) -> list[str]:
    tables: list[str] = []
    for domain in domains:
        tables.extend(DOMAIN_LANDING_TABLES.get(domain, []))
    seen: set[str] = set()
    ordered: list[str] = []
    for table in tables:
        if table not in seen:
            seen.add(table)
            ordered.append(table)
    return ordered


def selected_landing_upsert_statements(domains: list[str]) -> list[str]:
    tables = selected_landing_tables(domains)
    statements = split_sql_statements(LANDING_UPSERT_SQL.read_text())
    selected: list[str] = []
    for statement in statements:
        lowered = statement.lower()
        for table in tables:
            if f"insert into {table.lower()}" in lowered:
                selected.append(statement)
                break
    return selected


def insert_batch_run(
    client,
    batch_name: str,
    source_db: str,
    target_db: str,
    domains: list[str],
    cdc_source_row_count: int | None,
) -> int:
    sql = f"""
    INSERT INTO public.etl_cdc_sync_batch_runs (
        batch_name,
        source_system,
        source_database,
        target_database,
        domains,
        cdc_source_row_count,
        status
    ) VALUES (
        {pg_literal(batch_name)},
        'myerpplus',
        {pg_literal(source_db)},
        {pg_literal(target_db)},
        {pg_literal(",".join(domains))},
        {pg_literal(cdc_source_row_count)},
        'running'
    )
    RETURNING batch_id
    """
    _, rows = client.query(sql)
    return int(rows[0][0])


def finish_batch_run(client, batch_id: int, status: str, notes: str | None = None) -> None:
    sql = f"""
    UPDATE public.etl_cdc_sync_batch_runs
    SET status = {pg_literal(status)},
        finished_at = now(),
        notes = {pg_literal(notes)}
    WHERE batch_id = {batch_id}
    """
    client.execute(sql)


def insert_table_run(client, batch_id: int, table_name: str, sql_file: str) -> int:
    sql = f"""
    INSERT INTO public.etl_cdc_sync_table_runs (
        batch_id,
        table_name,
        sql_file,
        status
    ) VALUES (
        {batch_id},
        {pg_literal(table_name)},
        {pg_literal(sql_file)},
        'running'
    )
    RETURNING id
    """
    _, rows = client.query(sql)
    return int(rows[0][0])


def finish_table_run(
    client,
    run_id: int,
    loaded_row_count: int | None,
    status: str,
    error_message: str | None = None,
) -> None:
    sql = f"""
    UPDATE public.etl_cdc_sync_table_runs
    SET loaded_row_count = {pg_literal(loaded_row_count)},
        status = {pg_literal(status)},
        finished_at = now(),
        error_message = {pg_literal(error_message)}
    WHERE id = {run_id}
    """
    client.execute(sql)


def fetch_public_table_count(client, table_name: str) -> int:
    _, rows = client.query(f"SELECT COUNT(*) AS total FROM public.{table_name}")
    return int(rows[0][0]) if rows else 0


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--landing-schema", default="myerpplus_landing")
    parser.add_argument("--domains", default="all")
    parser.add_argument("--skip-landing-upsert", action="store_true")
    parser.add_argument("--skip-obt-refresh", action="store_true")
    args = parser.parse_args()
    domains = ALL_SYNC_DOMAINS if args.domains == "all" else [
        item.strip() for item in args.domains.split(",") if item.strip()
    ]
    obt_files = selected_obt_files(domains)
    file_table_pairs = selected_file_table_pairs(domains)
    refresh_tables = selected_refresh_tables(domains)

    pg_runner = load_pg_runner()
    pg_runner.load_env_files()
    client = pg_runner.SimplePgClient(pg_runner.resolve_database_url())
    client.connect()
    source_database = "cdc_current_state"
    target_database = client.database
    source_rows: int | None = None
    batch_id: int | None = None
    try:
        client.execute(f"SET search_path TO {args.landing_schema}, public")
        ensure_audit_tables(client)
        source_rows = cdc_supported_source_count(client, domains)
        batch_id = insert_batch_run(
            client,
            "obt-cdc-sync",
            source_database,
            target_database,
            domains,
            source_rows,
        )

        if not args.skip_landing_upsert:
            if source_rows == 0:
                print(f"landing upsert skipped because cdc_current_state has no supported rows for domains {','.join(domains)}")
            else:
                for statement in selected_landing_upsert_statements(domains):
                    client.execute(statement)
                print(f"landing upsert complete for schema {args.landing_schema}")

        if not args.skip_obt_refresh:
            client.execute(
                "TRUNCATE TABLE " + ", ".join([f"public.{table}" for table in refresh_tables])
            )
            for filename, table_name in file_table_pairs:
                run_id = insert_table_run(client, batch_id, table_name, filename)
                try:
                    client.execute((OBT_SQL_DIR / filename).read_text())
                    loaded_row_count = fetch_public_table_count(client, table_name)
                    finish_table_run(client, run_id, loaded_row_count, "success")
                    print(f"refreshed {filename}")
                except Exception as exc:
                    finish_table_run(client, run_id, None, "failed", str(exc))
                    raise
            refresh_counts(client, refresh_tables)
        finish_batch_run(client, batch_id, "success")
    except Exception as exc:
        if batch_id is not None:
            finish_batch_run(client, batch_id, "failed", str(exc))
        raise
    finally:
        client.close()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
