#!/usr/bin/env python3
"""Execute generated PostgreSQL OBT table SQL files without external clients."""

from __future__ import annotations

import argparse
import base64
import hashlib
import hmac
import os
import secrets
import socket
import struct
import sys
from pathlib import Path
from urllib.parse import unquote, urlparse


ROOT = Path("/home/rania/apps/sentient-factory")
SQL_DIR = ROOT / "apps" / "myerpplus-db-mapping" / "db" / "obt-physical-sql" / "pgsql-tables"
ENV_FILES = [
    ROOT / ".env",
    ROOT / ".env.vault",
]

CORE_CREATE_FILES = [
    "pg_create_table_obt_purchase_line_flow.sql",
    "pg_create_table_obt_sales_line_flow.sql",
    "pg_create_table_obt_pos_to_sales.sql",
]

CORE_INSERT_FILES = [
    "pg_insert_obt_purchase_line_flow.sql",
    "pg_insert_obt_sales_line_flow.sql",
    "pg_insert_obt_pos_to_sales.sql",
]

MASTER_DATA_CREATE_FILES = [
    "pg_create_table_obt_portfolio.sql",
]

MASTER_DATA_INSERT_FILES = [
    "pg_insert_obt_admin_access.sql",
    "pg_insert_obt_menu_authorization.sql",
    "pg_insert_obt_system_configuration.sql",
]

M1_DIMENSION_CREATE_FILES = [
    "pg_create_table_dim_contact_terms.sql",
    "pg_create_table_dim_contact_price.sql",
    "pg_create_table_dim_department.sql",
    "pg_create_table_dim_subdepartment.sql",
    "pg_create_table_dim_section.sql",
    "pg_create_table_dim_country.sql",
    "pg_create_table_dim_province.sql",
    "pg_create_table_dim_city.sql",
    "pg_create_table_dim_material.sql",
    "pg_create_table_dim_merk.sql",
    "pg_create_table_dim_model.sql",
    "pg_create_table_dim_size.sql",
    "pg_create_table_dim_price_category.sql",
    "pg_create_table_dim_price_category_detail.sql",
    "pg_create_table_dim_type_sa.sql",
    "pg_create_table_dim_other_cost.sql",
    "pg_create_table_dim_item_permission.sql",
    "pg_create_table_dim_item_transaction.sql",
    "pg_create_table_dim_transaction_note.sql",
    "pg_create_table_dim_transaction_note_detail.sql",
    "pg_create_table_dim_contact_category.sql",
    "pg_create_table_dim_customer_category.sql",
    "pg_create_table_dim_supplier_category.sql",
    "pg_create_table_dim_salesman_category.sql",
    "pg_create_table_dim_item_category.sql",
    "pg_create_table_dim_item_location.sql",
    "pg_create_table_dim_item_location_warehouse.sql",
    "pg_create_table_dim_item_type.sql",
    "pg_create_table_dim_item_price.sql",
    "pg_create_table_dim_item_supplier.sql",
    "pg_create_table_dim_unit.sql",
    "pg_create_table_dim_tax.sql",
    "pg_create_table_dim_currency.sql",
    "pg_create_table_dim_bank.sql",
    "pg_create_table_dim_expedition.sql",
    "pg_create_table_dim_class_product.sql",
    "pg_create_table_dim_branch.sql",
    "pg_create_table_dim_location.sql",
    "pg_create_table_dim_warehouse.sql",
    "pg_create_table_dim_coa.sql",
    "pg_create_table_dim_terms.sql",
    "pg_create_table_dim_division.sql",
    "pg_create_table_dim_project.sql",
    "pg_create_table_dim_cost_center.sql",
    "pg_create_table_dim_contact.sql",
    "pg_create_table_dim_item.sql",
    "pg_create_table_dim_item_warehouse_stock.sql",
]

M1_DIMENSION_INSERT_FILES = [
    "pg_insert_dim_contact_terms.sql",
    "pg_insert_dim_contact_price.sql",
    "pg_insert_dim_department.sql",
    "pg_insert_dim_subdepartment.sql",
    "pg_insert_dim_section.sql",
    "pg_insert_dim_country.sql",
    "pg_insert_dim_province.sql",
    "pg_insert_dim_city.sql",
    "pg_insert_dim_material.sql",
    "pg_insert_dim_merk.sql",
    "pg_insert_dim_model.sql",
    "pg_insert_dim_size.sql",
    "pg_insert_dim_price_category.sql",
    "pg_insert_dim_price_category_detail.sql",
    "pg_insert_dim_type_sa.sql",
    "pg_insert_dim_other_cost.sql",
    "pg_insert_dim_item_permission.sql",
    "pg_insert_dim_item_transaction.sql",
    "pg_insert_dim_transaction_note.sql",
    "pg_insert_dim_transaction_note_detail.sql",
    "pg_insert_dim_contact_category.sql",
    "pg_insert_dim_customer_category.sql",
    "pg_insert_dim_supplier_category.sql",
    "pg_insert_dim_salesman_category.sql",
    "pg_insert_dim_item_category.sql",
    "pg_insert_dim_item_location.sql",
    "pg_insert_dim_item_location_warehouse.sql",
    "pg_insert_dim_item_type.sql",
    "pg_insert_dim_item_price.sql",
    "pg_insert_dim_item_supplier.sql",
    "pg_insert_dim_unit.sql",
    "pg_insert_dim_tax.sql",
    "pg_insert_dim_currency.sql",
    "pg_insert_dim_bank.sql",
    "pg_insert_dim_expedition.sql",
    "pg_insert_dim_class_product.sql",
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
]

M3_INVENTORY_CREATE_FILES = [
    "pg_create_table_obt_portfolio.sql",
    "pg_create_table_obt_inventory_request_event.sql",
    "pg_create_table_obt_inventory_document_event.sql",
    "pg_create_table_obt_inventory_document_history_event.sql",
    "pg_create_table_obt_inventory_document_history_line_event.sql",
    "pg_create_table_dim_inventory_price_setup.sql",
    "pg_create_table_dim_inventory_refuel_event.sql",
    "pg_create_table_dim_inventory_daily_check.sql",
    "pg_create_table_dim_inventory_rw.sql",
    "pg_create_table_dim_inventory_note.sql",
    "pg_create_table_dim_inventory_attachment.sql",
]

M3_INVENTORY_INSERT_FILES = [
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
]

M4_PURCHASING_CREATE_FILES = [
    "pg_create_table_obt_portfolio.sql",
    "pg_create_table_dim_purchase_note.sql",
    "pg_create_table_dim_purchase_attachment.sql",
    "pg_create_table_obt_purchase_comparative_event.sql",
    "pg_create_table_obt_purchase_invoice_exchange_event.sql",
]

M4_PURCHASING_INSERT_FILES = [
    "pg_insert_dim_purchase_note.sql",
    "pg_insert_dim_purchase_attachment.sql",
    "pg_insert_obt_purchase_comparative_event.sql",
    "pg_insert_obt_purchase_invoice_exchange_event.sql",
    "pg_insert_obt_purchase_document_line_event.sql",
    "pg_insert_obt_purchase_line_flow.sql",
    "pg_insert_obt_purchase_payment.sql",
]

M5_SALES_CREATE_FILES = [
    "pg_create_table_obt_portfolio.sql",
    "pg_create_table_dim_sales_note.sql",
    "pg_create_table_dim_sales_attachment.sql",
    "pg_create_table_obt_sales_invoice_exchange_event.sql",
    "pg_create_table_obt_sales_point_adjustment_event.sql",
    "pg_create_table_obt_sales_closing_snapshot.sql",
    "pg_create_table_obt_sales_forecast_event.sql",
]

M5_SALES_INSERT_FILES = [
    "pg_insert_dim_sales_note.sql",
    "pg_insert_dim_sales_attachment.sql",
    "pg_insert_obt_sales_invoice_exchange_event.sql",
    "pg_insert_obt_sales_point_adjustment_event.sql",
    "pg_insert_obt_sales_closing_snapshot.sql",
    "pg_insert_obt_sales_forecast_event.sql",
    "pg_insert_obt_sales_order_line_flow.sql",
    "pg_insert_obt_sales_receivable.sql",
    "pg_insert_obt_sales_line_flow.sql",
]

M6_MANUFACTURING_CREATE_FILES = [
    "pg_create_table_obt_portfolio.sql",
    "pg_create_table_dim_manufacturing_note.sql",
    "pg_create_table_dim_manufacturing_attachment.sql",
]

M6_MANUFACTURING_INSERT_FILES = [
    "pg_insert_dim_manufacturing_note.sql",
    "pg_insert_dim_manufacturing_attachment.sql",
    "pg_insert_obt_bom_route_snapshot.sql",
    "pg_insert_obt_manufacturing_execution.sql",
]

M7_ASSET_CREATE_FILES = [
    "pg_create_table_obt_portfolio.sql",
    "pg_create_table_dim_asset_note.sql",
    "pg_create_table_dim_asset_attachment.sql",
]

M7_ASSET_INSERT_FILES = [
    "pg_insert_dim_asset_note.sql",
    "pg_insert_dim_asset_attachment.sql",
    "pg_insert_obt_asset_lifecycle.sql",
    "pg_insert_obt_asset_depreciation_event.sql",
    "pg_insert_obt_asset_mutation.sql",
]

CORE_CHECK_FILES = [
    "pg_check_obt_source_readiness.sql",
]

DEFAULT_CHECK_CDC_FILES = [
    "pg_check_obt_cdc_coverage.sql",
]

OPS_AUDIT_CHECK_FILES = [
    "pg_check_cdc_last_batches.sql",
    "pg_check_cdc_last_failures.sql",
]

CORE_SOURCE_PROBE_TABLES = [
    "m4_po",
    "m4_po_detail",
    "m5_si",
    "m5_si_detail",
    "m_12_pos_voucher_out",
]

MASTER_DATA_SOURCE_PROBE_TABLES = [
    "m0_menu",
    "m0_nomor",
    "m0_role",
    "m0_role_menu",
    "m0_user",
    "m0_user_role",
    "m0_userlog",
    "m1_branch",
    "m1_location",
]

M1_DIMENSION_SOURCE_PROBE_TABLES = [
    "m1_class_product",
    "m1_city",
    "m1_contact_category",
    "m1_contact_price",
    "m1_contact_terms",
    "m1_currency",
    "m1_country",
    "m1_customer_category",
    "m1_department",
    "m1_expedition",
    "m1_bank",
    "m1_contact",
    "m1_item_category",
    "m1_item_location",
    "m1_item_location_warehouse",
    "m1_item",
    "m1_item_permission",
    "m1_item_price",
    "m1_item_stock_warehouse",
    "m1_item_supplier",
    "m1_item_transaction",
    "m1_item_type",
    "m1_material",
    "m1_merk",
    "m1_model",
    "m1_other_cost",
    "m1_price_category",
    "m1_price_category_detail",
    "m1_province",
    "m1_salesman_category",
    "m1_section",
    "m1_size",
    "m1_subdepartment",
    "m1_supplier_category",
    "m1_tax",
    "m1_unit",
    "m1_warehouse",
    "m1_type_sa",
    "m1_transaction_note",
    "m1_transaction_note_detail",
    "m1_location",
    "m1_branch",
]

M3_INVENTORY_SOURCE_PROBE_TABLES = [
    "m3_mr",
    "m3_mr_detail",
    "m3_mr_history",
    "m3_mr_detail_history",
    "m3_ts_history",
    "m3_ts_detail_history",
    "m3_rs",
    "m3_rs_detail",
    "m3_rs_history",
    "m3_rs_detail_history",
    "m3_sa",
    "m3_sa_detail",
    "m3_sa_history",
    "m3_sa_detail_history",
    "m3_sp",
    "m3_sp_detail",
    "m3_sp_history",
    "m3_sp_detail_history",
    "m3_ts",
    "m3_ts_detail",
    "m3_ib",
    "m3_ib_detail",
    "m3_ib_history",
    "m3_ib_detail_history",
    "m3_pa",
    "m3_pa_detail",
    "m3_rf",
    "m3_rf_detail",
    "m3_dc",
    "m3_dc_detail",
    "m3_dc_check",
    "m3_dc_history",
    "m3_dc_detail_history",
    "m3_dc_check_history",
    "m3_rw",
    "m3_notes",
    "m3_files",
    "m1_item",
    "m1_branch",
    "m1_location",
    "m1_warehouse",
]

M2_FINANCE_SOURCE_PROBE_TABLES = [
    "m2_cr",
    "m2_cr_detail",
    "m2_cr_history",
    "m2_cr_detail_history",
    "m2_cd",
    "m2_cd_detail",
    "m2_cd_history",
    "m2_cd_detail_history",
    "m2_bd",
    "m2_bd_detail",
    "m2_bd_history",
    "m2_bd_detail_history",
    "m2_aj",
    "m2_aj_detail",
    "m2_aj_history",
    "m2_aj_detail_history",
    "m2_jm",
    "m2_jm_detail",
    "m2_jm_history",
    "m2_jm_detail_history",
    "m2_rg",
    "m2_rg_detail",
    "m2_rg_history",
    "m2_rg_detail_history",
    "m2_rgc",
    "m2_rgc_detail",
    "m2_rgc_history",
    "m2_rgc_detail_history",
    "m2_sg",
    "m2_sg_detail",
    "m2_sg_history",
    "m2_sg_detail_history",
    "m2_sgc",
    "m2_sgc_detail",
    "m2_sgc_history",
    "m2_sgc_detail_history",
    "m2_rm",
    "m2_rm_detail",
    "m2_rm_history",
    "m2_rm_detail_history",
    "m2_sm",
    "m2_sm_detail",
    "m2_sm_history",
    "m2_sm_detail_history",
    "m2_cb",
    "m2_cb_detail",
    "m2_cb_history",
    "m2_cb_detail_history",
    "m2_gj",
    "m2_gj_detail",
    "m2_gj_history",
    "m2_gj_detail_history",
    "m2_rm_pay",
    "m2_rm_pay_history",
    "m2_sm_pay",
    "m2_sm_pay_history",
    "m2_cb_pay",
    "m2_cb_pay_history",
    "m2_notes",
    "m2_files",
    "m2_giro_list",
    "m2_realization",
    "m2_transaction_journal",
]

M4_PURCHASING_SOURCE_PROBE_TABLES = [
    "m4_po",
    "m4_po_detail",
    "m4_ap",
    "m4_ap_pay",
    "m4_cs",
    "m4_cs_detail",
    "m4_files",
    "m4_grn",
    "m4_grn_detail",
    "m4_notes",
    "m4_pie",
    "m4_pie_detail",
    "m4_ri",
    "m4_ri_detail",
    "m4_dnr",
    "m4_dnr_detail",
    "m4_prt",
    "m4_prt_detail",
    "m4_vp",
    "m4_vp_detail",
    "m4_vpp",
    "m4_vpp_detail",
    "m1_branch",
    "m1_location",
    "m1_contact",
    "m1_item",
    "m1_terms",
]

M5_SALES_SOURCE_PROBE_TABLES = [
    "m5_sq",
    "m5_sq_detail",
    "m5_so",
    "m5_so_detail",
    "m5_as",
    "m5_cl",
    "m5_files",
    "m5_ip",
    "m5_pi",
    "m5_pi_detail",
    "m5_pl",
    "m5_pl_detail",
    "m5_do",
    "m5_do_detail",
    "m5_dr",
    "m5_dr_detail",
    "m5_ic",
    "m5_ic_detail",
    "m5_notes",
    "m5_pv",
    "m5_pv_detail",
    "m5_rp",
    "m5_sf",
    "m5_sf_detail",
    "m5_si",
    "m5_si_detail",
    "m5_sie",
    "m5_sie_detail",
    "m5_spa",
    "m5_spa_detail",
    "m5_rnr",
    "m5_rnr_detail",
    "m5_sr",
    "m5_sr_detail",
]

M6_MANUFACTURING_SOURCE_PROBE_TABLES = [
    "m6_bom", "m6_bom_in", "m6_bom_out",
    "m6_mrs", "m6_mrs_out",
    "m6_mrn", "m6_mrn_out",
    "m6_pd", "m6_pd_in", "m6_pd_out",
    "m6_pdr", "m6_pdr_in", "m6_pdr_out",
    "m6_wo", "m6_wo_in", "m6_wo_out", "m6_wo_activity", "m6_wo_route_card",
    "m6_notes", "m6_files",
]

M7_ASSET_SOURCE_PROBE_TABLES = [
    "m7_asset",
    "m7_ar", "m7_ar_detail",
    "m7_aq", "m7_aq_detail",
    "m7_ao", "m7_ao_detail",
    "m7_ae", "m7_ae_detail",
    "m7_at", "m7_at_detail", "m7_at_pay",
    "m7_ag", "m7_ag_detail",
    "m7_da", "m7_da_detail",
    "m7_notes", "m7_files",
]

CORE_TARGET_TABLES = [
    "obt_purchase_line_flow",
    "obt_sales_line_flow",
    "obt_pos_to_sales",
]

MASTER_DATA_TARGET_TABLES = [
    "obt_admin_access",
    "obt_menu_authorization",
    "obt_system_configuration",
]

M1_DIMENSION_TARGET_TABLES = [
    "dim_contact_terms",
    "dim_contact_price",
    "dim_department",
    "dim_subdepartment",
    "dim_section",
    "dim_country",
    "dim_province",
    "dim_city",
    "dim_material",
    "dim_merk",
    "dim_model",
    "dim_size",
    "dim_type_sa",
    "dim_other_cost",
    "dim_item_permission",
    "dim_item_transaction",
    "dim_transaction_note",
    "dim_transaction_note_detail",
    "dim_contact_category",
    "dim_customer_category",
    "dim_supplier_category",
    "dim_salesman_category",
    "dim_item_category",
    "dim_item_location",
    "dim_item_location_warehouse",
    "dim_item_type",
    "dim_item_price",
    "dim_item_supplier",
    "dim_unit",
    "dim_tax",
    "dim_currency",
    "dim_bank",
    "dim_expedition",
    "dim_class_product",
    "dim_price_category",
    "dim_price_category_detail",
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
]

M3_INVENTORY_TARGET_TABLES = [
    "obt_inventory_request_event",
    "dim_inventory_price_setup",
    "dim_inventory_refuel_event",
    "dim_inventory_daily_check",
    "dim_inventory_rw",
    "dim_inventory_note",
    "dim_inventory_attachment",
    "obt_inventory_document_event",
    "obt_inventory_document_history_event",
    "obt_inventory_document_history_line_event",
    "obt_inventory_movement_line",
]

M2_FINANCE_TARGET_TABLES = [
    "dim_finance_note",
    "dim_finance_attachment",
    "dim_finance_giro_list",
    "obt_cash_bank_movement",
    "obt_profit_loss_line",
    "obt_finance_payment_history_event",
    "obt_finance_document_history_event",
    "obt_finance_document_history_line_event",
    "obt_finance_document",
    "obt_finance_budget_realization",
    "obt_finance_document_line",
    "obt_finance_allocation",
]

M4_PURCHASING_TARGET_TABLES = [
    "dim_purchase_note",
    "dim_purchase_attachment",
    "obt_purchase_comparative_event",
    "obt_purchase_invoice_exchange_event",
    "obt_purchase_document_line_event",
    "obt_purchase_line_flow",
    "obt_purchase_payment",
]

M5_SALES_TARGET_TABLES = [
    "dim_sales_note",
    "dim_sales_attachment",
    "obt_sales_invoice_exchange_event",
    "obt_sales_point_adjustment_event",
    "obt_sales_closing_snapshot",
    "obt_sales_forecast_event",
    "obt_sales_order_line_flow",
    "obt_sales_receivable",
    "obt_sales_line_flow",
]

M6_MANUFACTURING_TARGET_TABLES = [
    "dim_manufacturing_note",
    "dim_manufacturing_attachment",
    "obt_bom_route_snapshot",
    "obt_manufacturing_execution",
]

M7_ASSET_TARGET_TABLES = [
    "dim_asset_note",
    "dim_asset_attachment",
    "obt_asset_lifecycle",
    "obt_asset_depreciation_event",
    "obt_asset_mutation",
]

OPS_AUDIT_TARGET_TABLES = [
    "etl_cdc_sync_batch_runs",
    "etl_cdc_sync_table_runs",
]

PROFILE_CONFIG = {
    "core": {
        "create_files": CORE_CREATE_FILES,
        "insert_files": CORE_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": CORE_SOURCE_PROBE_TABLES,
        "target_tables": CORE_TARGET_TABLES,
    },
    "master-data": {
        "create_files": MASTER_DATA_CREATE_FILES,
        "insert_files": MASTER_DATA_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": MASTER_DATA_SOURCE_PROBE_TABLES,
        "target_tables": MASTER_DATA_TARGET_TABLES,
    },
    "m1-dimension": {
        "create_files": M1_DIMENSION_CREATE_FILES,
        "insert_files": M1_DIMENSION_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M1_DIMENSION_SOURCE_PROBE_TABLES,
        "target_tables": M1_DIMENSION_TARGET_TABLES,
    },
    "m3-inventory": {
        "create_files": M3_INVENTORY_CREATE_FILES,
        "insert_files": M3_INVENTORY_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M3_INVENTORY_SOURCE_PROBE_TABLES,
        "target_tables": M3_INVENTORY_TARGET_TABLES,
    },
    "m2-finance": {
        "create_files": MASTER_DATA_CREATE_FILES + [
            "pg_create_table_dim_finance_note.sql",
            "pg_create_table_dim_finance_attachment.sql",
            "pg_create_table_dim_finance_giro_list.sql",
            "pg_create_table_obt_profit_loss_line.sql",
            "pg_create_table_obt_finance_budget_realization.sql",
            "pg_create_table_obt_finance_payment_history_event.sql",
            "pg_create_table_obt_finance_document_history_event.sql",
            "pg_create_table_obt_finance_document_history_line_event.sql",
        ],
        "insert_files": [
            "pg_insert_dim_finance_note.sql",
            "pg_insert_dim_finance_attachment.sql",
            "pg_insert_dim_finance_giro_list.sql",
            "pg_insert_obt_cash_bank_movement.sql",
            "pg_insert_obt_profit_loss_line.sql",
            "pg_insert_obt_finance_allocation.sql",
            "pg_insert_obt_finance_budget_realization.sql",
            "pg_insert_obt_finance_payment_history_event.sql",
            "pg_insert_obt_finance_document.sql",
            "pg_insert_obt_finance_document_history_event.sql",
            "pg_insert_obt_finance_document_history_line_event.sql",
            "pg_insert_obt_finance_document_line.sql",
        ],
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M2_FINANCE_SOURCE_PROBE_TABLES,
        "target_tables": M2_FINANCE_TARGET_TABLES,
    },
    "m4-purchasing": {
        "create_files": M4_PURCHASING_CREATE_FILES,
        "insert_files": M4_PURCHASING_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M4_PURCHASING_SOURCE_PROBE_TABLES,
        "target_tables": M4_PURCHASING_TARGET_TABLES,
    },
    "m5-sales": {
        "create_files": M5_SALES_CREATE_FILES,
        "insert_files": M5_SALES_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M5_SALES_SOURCE_PROBE_TABLES,
        "target_tables": M5_SALES_TARGET_TABLES,
    },
    "m6-manufacturing": {
        "create_files": M6_MANUFACTURING_CREATE_FILES,
        "insert_files": M6_MANUFACTURING_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M6_MANUFACTURING_SOURCE_PROBE_TABLES,
        "target_tables": M6_MANUFACTURING_TARGET_TABLES,
    },
    "m7-asset": {
        "create_files": M7_ASSET_CREATE_FILES,
        "insert_files": M7_ASSET_INSERT_FILES,
        "check_files": CORE_CHECK_FILES,
        "check_cdc_files": DEFAULT_CHECK_CDC_FILES,
        "source_probe_tables": M7_ASSET_SOURCE_PROBE_TABLES,
        "target_tables": M7_ASSET_TARGET_TABLES,
    },
    "ops-audit": {
        "create_files": [],
        "insert_files": [],
        "check_files": OPS_AUDIT_CHECK_FILES,
        "check_cdc_files": OPS_AUDIT_CHECK_FILES,
        "source_probe_tables": [],
        "target_tables": OPS_AUDIT_TARGET_TABLES,
    },
    "full-active": {
        "create_files": MASTER_DATA_CREATE_FILES + M1_DIMENSION_CREATE_FILES,
        "insert_files": (
            MASTER_DATA_INSERT_FILES
            + M1_DIMENSION_INSERT_FILES
            + M3_INVENTORY_INSERT_FILES
            + M4_PURCHASING_INSERT_FILES
            + M5_SALES_INSERT_FILES
            + CORE_INSERT_FILES
        ),
        "check_files": [
            "pg_check_obt_portfolio_tables.sql",
            "pg_check_obt_source_readiness.sql",
        ],
        "check_cdc_files": [
            "pg_check_obt_portfolio_tables.sql",
            "pg_check_obt_cdc_coverage.sql",
        ],
        "source_probe_tables": (
            MASTER_DATA_SOURCE_PROBE_TABLES
            + M1_DIMENSION_SOURCE_PROBE_TABLES
            + M3_INVENTORY_SOURCE_PROBE_TABLES
            + M4_PURCHASING_SOURCE_PROBE_TABLES
            + M5_SALES_SOURCE_PROBE_TABLES
            + CORE_SOURCE_PROBE_TABLES
        ),
        "target_tables": (
            MASTER_DATA_TARGET_TABLES
            + M1_DIMENSION_TARGET_TABLES
            + M3_INVENTORY_TARGET_TABLES
            + M4_PURCHASING_TARGET_TABLES
            + M5_SALES_TARGET_TABLES
            + CORE_TARGET_TABLES
        ),
    },
}


def load_env_files() -> None:
    for path in ENV_FILES:
        if not path.exists():
            continue
        for line in path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip("'").strip('"')
            os.environ[key] = value


def resolve_database_url() -> str:
    user = os.environ.get("POSTGRES_USER")
    password = os.environ.get("POSTGRES_PASSWORD")
    database = os.environ.get("POSTGRES_DB")
    if user and password and database:
        host = os.environ.get("POSTGRES_HOST", "127.0.0.1")
        port = os.environ.get("POSTGRES_PORT", "3208")
        return f"postgresql://{user}:{password}@{host}:{port}/{database}"

    database_url = os.environ.get("DATABASE_URL")
    if database_url:
        return database_url

    raise KeyError("PostgreSQL connection settings are not available")


def iter_sql_files(mode: str, explicit_files: list[str], profile: str) -> list[Path]:
    if explicit_files:
        names = explicit_files
    else:
        config = PROFILE_CONFIG[profile]
        if mode == "create":
            names = config["create_files"]
        elif mode == "insert":
            names = config["insert_files"]
        elif mode == "check-cdc":
            names = config["check_cdc_files"]
        else:
            names = config["check_files"]
    return [SQL_DIR / name for name in names]


def _md5_password(user: str, password: str, salt: bytes) -> str:
    inner = hashlib.md5((password + user).encode()).hexdigest().encode()
    outer = hashlib.md5(inner + salt).hexdigest()
    return "md5" + outer


def _scram_hi(password: bytes, salt: bytes, iterations: int) -> bytes:
    return hashlib.pbkdf2_hmac("sha256", password, salt, iterations)


def _xor_bytes(left: bytes, right: bytes) -> bytes:
    return bytes(a ^ b for a, b in zip(left, right))


def _scram_escape(value: str) -> str:
    return value.replace("=", "=3D").replace(",", "=2C")


def _parse_error(payload: bytes) -> str:
    parts = payload.split(b"\x00")
    fields: dict[str, str] = {}
    for part in parts:
        if not part:
            continue
        key = chr(part[0])
        value = part[1:].decode(errors="replace")
        fields[key] = value
    primary = fields.get("M", "Unknown PostgreSQL error")
    detail = fields.get("D")
    hint = fields.get("H")
    out = primary
    if detail:
        out += f" | detail={detail}"
    if hint:
        out += f" | hint={hint}"
    return out


class SimplePgClient:
    def __init__(self, database_url: str) -> None:
        parsed = urlparse(database_url)
        if parsed.scheme not in {"postgresql", "postgres"}:
            raise ValueError("DATABASE_URL must use postgresql:// or postgres://")

        self.host = parsed.hostname or "127.0.0.1"
        self.port = parsed.port or 5432
        self.user = unquote(parsed.username or "")
        self.password = unquote(parsed.password or "")
        self.database = unquote(parsed.path.lstrip("/"))
        if not self.user or not self.database:
            raise ValueError("DATABASE_URL must include user and database")

        self.sock: socket.socket | None = None

    def connect(self) -> None:
        self.sock = socket.create_connection((self.host, self.port), timeout=10)
        self.sock.settimeout(30)
        params = [
            b"user",
            self.user.encode(),
            b"database",
            self.database.encode(),
            b"client_encoding",
            b"UTF8",
        ]
        payload = struct.pack("!I", 196608) + b"".join(p + b"\x00" for p in params) + b"\x00"
        self._send_startup(payload)
        self._handle_authentication()

    def close(self) -> None:
        if not self.sock:
            return
        try:
            self._send_message(b"X", b"")
        except Exception:
            pass
        try:
            self.sock.close()
        finally:
            self.sock = None

    def query(self, sql: str) -> tuple[list[str], list[list[str | None]]]:
        self._send_message(b"Q", sql.encode() + b"\x00")
        columns: list[str] = []
        rows: list[list[str | None]] = []

        while True:
            msg_type, payload = self._read_message()
            if msg_type == b"T":
                field_count = struct.unpack("!H", payload[:2])[0]
                pos = 2
                cols = []
                for _ in range(field_count):
                    end = payload.index(b"\x00", pos)
                    cols.append(payload[pos:end].decode())
                    pos = end + 19
                columns = cols
            elif msg_type == b"D":
                field_count = struct.unpack("!H", payload[:2])[0]
                pos = 2
                row: list[str | None] = []
                for _ in range(field_count):
                    length = struct.unpack("!i", payload[pos : pos + 4])[0]
                    pos += 4
                    if length == -1:
                        row.append(None)
                    else:
                        row.append(payload[pos : pos + length].decode())
                        pos += length
                rows.append(row)
            elif msg_type == b"C":
                continue
            elif msg_type == b"I":
                continue
            elif msg_type == b"N":
                print(f"NOTICE: {_parse_error(payload)}")
            elif msg_type == b"S":
                continue
            elif msg_type == b"E":
                raise RuntimeError(_parse_error(payload))
            elif msg_type == b"Z":
                return columns, rows
            else:
                continue

    def execute(self, sql: str) -> None:
        self.query(sql)

    def _handle_authentication(self) -> None:
        server_signature: bytes | None = None
        expected_server_signature: bytes | None = None

        while True:
            msg_type, payload = self._read_message()
            if msg_type == b"R":
                auth_code = struct.unpack("!I", payload[:4])[0]
                if auth_code == 0:
                    continue
                if auth_code == 3:
                    self._send_message(b"p", self.password.encode() + b"\x00")
                    continue
                if auth_code == 5:
                    salt = payload[4:8]
                    encoded = _md5_password(self.user, self.password, salt).encode() + b"\x00"
                    self._send_message(b"p", encoded)
                    continue
                if auth_code == 10:
                    mechanisms = payload[4:].split(b"\x00")
                    if b"SCRAM-SHA-256" not in mechanisms:
                        raise RuntimeError("PostgreSQL requested unsupported SASL mechanism")
                    nonce = secrets.token_hex(18)
                    client_first_bare = f"n={_scram_escape(self.user)},r={nonce}".encode()
                    client_first = b"n,," + client_first_bare
                    body = (
                        b"SCRAM-SHA-256\x00"
                        + struct.pack("!I", len(client_first))
                        + client_first
                    )
                    self._send_message(b"p", body)

                    cont_type, cont_payload = self._read_message()
                    if cont_type != b"R" or struct.unpack("!I", cont_payload[:4])[0] != 11:
                        raise RuntimeError("Expected SASL continue from PostgreSQL")

                    server_first = cont_payload[4:].decode()
                    attrs = dict(item.split("=", 1) for item in server_first.split(","))
                    server_nonce = attrs["r"]
                    salt = base64.b64decode(attrs["s"])
                    iterations = int(attrs["i"])

                    client_final_without_proof = f"c=biws,r={server_nonce}".encode()
                    auth_message = b",".join(
                        [client_first_bare, server_first.encode(), client_final_without_proof]
                    )
                    salted_password = _scram_hi(self.password.encode(), salt, iterations)
                    client_key = hmac.new(
                        salted_password, b"Client Key", hashlib.sha256
                    ).digest()
                    stored_key = hashlib.sha256(client_key).digest()
                    client_signature = hmac.new(
                        stored_key, auth_message, hashlib.sha256
                    ).digest()
                    client_proof = base64.b64encode(_xor_bytes(client_key, client_signature))
                    server_key = hmac.new(
                        salted_password, b"Server Key", hashlib.sha256
                    ).digest()
                    expected_server_signature = hmac.new(
                        server_key, auth_message, hashlib.sha256
                    ).digest()
                    client_final = (
                        client_final_without_proof + b",p=" + client_proof
                    )
                    self._send_message(b"p", client_final)
                    continue
                if auth_code == 12:
                    attrs = dict(
                        item.split("=", 1)
                        for item in payload[4:].decode().split(",")
                        if "=" in item
                    )
                    if "v" in attrs:
                        server_signature = base64.b64decode(attrs["v"])
                    continue
                raise RuntimeError(f"Unsupported PostgreSQL auth code: {auth_code}")
            elif msg_type == b"S":
                continue
            elif msg_type == b"K":
                continue
            elif msg_type == b"E":
                raise RuntimeError(_parse_error(payload))
            elif msg_type == b"Z":
                if expected_server_signature and server_signature != expected_server_signature:
                    raise RuntimeError("SCRAM server signature verification failed")
                return
            else:
                continue

    def _send_startup(self, payload: bytes) -> None:
        if not self.sock:
            raise RuntimeError("socket is not connected")
        self.sock.sendall(struct.pack("!I", len(payload) + 4) + payload)

    def _send_message(self, msg_type: bytes, payload: bytes) -> None:
        if not self.sock:
            raise RuntimeError("socket is not connected")
        self.sock.sendall(msg_type + struct.pack("!I", len(payload) + 4) + payload)

    def _read_exact(self, size: int) -> bytes:
        if not self.sock:
            raise RuntimeError("socket is not connected")
        chunks = []
        remaining = size
        while remaining > 0:
            chunk = self.sock.recv(remaining)
            if not chunk:
                raise RuntimeError("PostgreSQL connection closed unexpectedly")
            chunks.append(chunk)
            remaining -= len(chunk)
        return b"".join(chunks)

    def _read_message(self) -> tuple[bytes, bytes]:
        msg_type = self._read_exact(1)
        length = struct.unpack("!I", self._read_exact(4))[0]
        payload = self._read_exact(length - 4)
        return msg_type, payload


def print_probe(client: SimplePgClient, source_probe_tables: list[str]) -> None:
    cols, rows = client.query("SELECT current_database(), current_user, current_schema()")
    if rows:
        values = dict(zip(cols, rows[0]))
        print(
            "connected "
            f"database={values.get('current_database')} "
            f"user={values.get('current_user')} "
            f"schema={values.get('current_schema')}"
        )

    if not source_probe_tables:
        print("source table probe:")
        print("  no source probe configured for this profile")
        return

    probe_sql = f"""
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name IN ({", ".join(repr(name) for name in source_probe_tables)})
    ORDER BY table_schema, table_name
    """
    _, rows = client.query(probe_sql)
    print("source table probe:")
    if not rows:
        print("  no expected source tables found")
    else:
        for schema_name, table_name in rows:
            print(f"  {schema_name}.{table_name}")


def print_targets(client: SimplePgClient, target_tables: list[str]) -> None:
    if not target_tables:
        print("target table status:")
        print("  no target tables configured for this profile")
        return

    target_sql = f"""
    SELECT table_schema, table_name
    FROM information_schema.tables
    WHERE table_name IN ({", ".join(repr(name) for name in target_tables)})
    ORDER BY table_schema, table_name
    """
    _, rows = client.query(target_sql)
    print("target table status:")
    if not rows:
        print("  no OBT target tables found")
    else:
        for schema_name, table_name in rows:
            print(f"  {schema_name}.{table_name}")


def truncate_targets(client: SimplePgClient, target_tables: list[str]) -> None:
    if not target_tables:
        return
    qualified_tables = ", ".join(f"public.{table_name}" for table_name in target_tables)
    client.execute(f"TRUNCATE TABLE {qualified_tables}")
    print(f"truncated {qualified_tables}")


def set_search_path(client: SimplePgClient, landing_schema: str) -> None:
    client.execute(f"SET search_path TO {landing_schema}, public")
    print(f"search_path {landing_schema}, public")


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--mode",
        choices=["create", "insert", "check", "check-cdc"],
        default="create",
        help="choose which generated SQL set to execute",
    )
    parser.add_argument(
        "--profile",
        choices=sorted(PROFILE_CONFIG),
        default="core",
        help="select the OBT bootstrap wave preset when files are not passed explicitly",
    )
    parser.add_argument(
        "--truncate-targets",
        action="store_true",
        help="truncate profile target tables before insert to make bootstrap reruns idempotent",
    )
    parser.add_argument(
        "--landing-schema",
        default="myerpplus_landing",
        help="landing schema placed first in search_path for unqualified source tables",
    )
    parser.add_argument(
        "files",
        nargs="*",
        help="optional explicit SQL filenames under db/obt-physical-sql/pgsql-tables",
    )
    args = parser.parse_args()

    load_env_files()
    database_url = resolve_database_url()
    sql_files = iter_sql_files(args.mode, args.files, args.profile)
    profile = PROFILE_CONFIG[args.profile]
    if args.truncate_targets and args.mode != "insert":
        raise ValueError("--truncate-targets can only be used with --mode insert")
    for path in sql_files:
        if not path.exists():
            raise FileNotFoundError(path)

    client = SimplePgClient(database_url)
    try:
        client.connect()
        set_search_path(client, args.landing_schema)
        print(f"profile {args.profile}")
        print_probe(client, profile["source_probe_tables"])
        if args.truncate_targets:
            truncate_targets(client, profile["target_tables"])
        for path in sql_files:
            print(f"executing {path.name}")
            if args.mode in {"check", "check-cdc"}:
                cols, rows = client.query(path.read_text())
                print("\t".join(cols))
                for row in rows:
                    print("\t".join("" if value is None else value for value in row))
            else:
                client.execute(path.read_text())
                client.execute("COMMIT")
        print_targets(client, profile["target_tables"])
    finally:
        client.close()

    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"ERROR: {exc}", file=sys.stderr)
        raise
