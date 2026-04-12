-- Check the full concept-derived OBT portfolio tables plus active M1 dimensions in PostgreSQL.

WITH required_outputs AS (
    SELECT *
    FROM (
        VALUES
            ('obt', 'obt_admin_access'),
            ('obt', 'obt_asset_depreciation_event'),
            ('obt', 'obt_asset_lifecycle'),
            ('obt', 'obt_asset_mutation'),
            ('obt', 'obt_bom_route_snapshot'),
            ('obt', 'obt_cash_bank_movement'),
            ('obt', 'obt_clinical_service_line'),
            ('obt', 'obt_content_indicator_map'),
            ('obt', 'obt_customer_sales_profile'),
            ('obt', 'obt_finance_allocation'),
            ('obt', 'obt_finance_document'),
            ('obt', 'obt_finance_document_line'),
            ('obt', 'obt_inventory_movement_line'),
            ('obt', 'obt_inventory_receipt_issue_line'),
            ('obt', 'obt_inventory_transfer_trace'),
            ('obt', 'obt_manufacturing_execution'),
            ('obt', 'obt_material_issue_receipt_line'),
            ('obt', 'obt_menu_authorization'),
            ('obt', 'obt_metric_snapshot'),
            ('obt', 'obt_patient_billing_line'),
            ('obt', 'obt_patient_visit'),
            ('obt', 'obt_patient_visit_billing'),
            ('obt', 'obt_pos_point_activity'),
            ('obt', 'obt_pos_promo_application'),
            ('obt', 'obt_pos_to_sales'),
            ('obt', 'obt_pos_transaction_line'),
            ('obt', 'obt_pos_voucher_payment'),
            ('obt', 'obt_purchase_line_flow'),
            ('obt', 'obt_purchase_payment'),
            ('obt', 'obt_purchase_receipt_line'),
            ('obt', 'obt_purchase_to_asset_to_finance'),
            ('obt', 'obt_purchase_to_finance'),
            ('obt', 'obt_purchase_to_inventory'),
            ('obt', 'obt_queue_activity'),
            ('obt', 'obt_sales_collection_allocation'),
            ('obt', 'obt_sales_line_flow'),
            ('obt', 'obt_sales_receivable'),
            ('obt', 'obt_sales_to_finance'),
            ('obt', 'obt_sales_to_inventory'),
            ('obt', 'obt_sales_to_manufacturing'),
            ('obt', 'obt_system_configuration'),
            ('dim', 'dim_contact'),
            ('dim', 'dim_item')
    ) AS x(output_type, table_name)
)
SELECT
    r.output_type,
    r.table_name,
    COALESCE(t.table_schema, '-') AS table_schema,
    CASE
        WHEN t.table_name IS NULL THEN 'missing'
        ELSE 'present'
    END AS readiness_status
FROM required_outputs r
LEFT JOIN information_schema.tables t
    ON t.table_schema = 'public'
   AND t.table_name = r.table_name
ORDER BY r.output_type, r.table_name;
