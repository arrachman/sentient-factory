-- Check whether the PostgreSQL instance already has the minimum source tables
-- required by the table-first OBT insert scripts.

WITH required_tables AS (
    SELECT *
    FROM (
        VALUES
            ('obt_purchase_line_flow', 'm1_branch'),
            ('obt_purchase_line_flow', 'm1_contact'),
            ('obt_purchase_line_flow', 'm1_item'),
            ('obt_purchase_line_flow', 'm1_location'),
            ('obt_purchase_line_flow', 'm1_terms'),
            ('obt_purchase_line_flow', 'm4_dnr'),
            ('obt_purchase_line_flow', 'm4_dnr_detail'),
            ('obt_purchase_line_flow', 'm4_grn'),
            ('obt_purchase_line_flow', 'm4_grn_detail'),
            ('obt_purchase_line_flow', 'm4_po'),
            ('obt_purchase_line_flow', 'm4_po_detail'),
            ('obt_purchase_line_flow', 'm4_prt'),
            ('obt_purchase_line_flow', 'm4_prt_detail'),
            ('obt_purchase_line_flow', 'm4_ri'),
            ('obt_purchase_line_flow', 'm4_ri_detail'),
            ('obt_sales_line_flow', 'm0_user'),
            ('obt_sales_line_flow', 'm1_branch'),
            ('obt_sales_line_flow', 'm1_contact'),
            ('obt_sales_line_flow', 'm1_item'),
            ('obt_sales_line_flow', 'm1_location'),
            ('obt_sales_line_flow', 'm5_do'),
            ('obt_sales_line_flow', 'm5_do_detail'),
            ('obt_sales_line_flow', 'm5_dr'),
            ('obt_sales_line_flow', 'm5_dr_detail'),
            ('obt_sales_line_flow', 'm5_pi'),
            ('obt_sales_line_flow', 'm5_pi_detail'),
            ('obt_sales_line_flow', 'm5_pl'),
            ('obt_sales_line_flow', 'm5_pl_detail'),
            ('obt_sales_line_flow', 'm5_rnr'),
            ('obt_sales_line_flow', 'm5_rnr_detail'),
            ('obt_sales_line_flow', 'm5_si'),
            ('obt_sales_line_flow', 'm5_si_detail'),
            ('obt_sales_line_flow', 'm5_so'),
            ('obt_sales_line_flow', 'm5_so_detail'),
            ('obt_sales_line_flow', 'm5_sq'),
            ('obt_sales_line_flow', 'm5_sq_detail'),
            ('obt_sales_line_flow', 'm5_sr'),
            ('obt_sales_line_flow', 'm5_sr_detail'),
            ('obt_pos_to_sales', 'm0_user'),
            ('obt_pos_to_sales', 'm1_branch'),
            ('obt_pos_to_sales', 'm1_contact'),
            ('obt_pos_to_sales', 'm1_location'),
            ('obt_pos_to_sales', 'm1_terms'),
            ('obt_pos_to_sales', 'm5_si'),
            ('obt_pos_to_sales', 'm5_si_detail'),
            ('obt_pos_to_sales', 'm_12_pos_category'),
            ('obt_pos_to_sales', 'm_12_pos_voucher_in'),
            ('obt_pos_to_sales', 'm_12_pos_voucher_out')
    ) AS x(obt_name, required_table)
)
SELECT
    r.obt_name,
    r.required_table,
    COALESCE(t.table_schema, '-') AS table_schema,
    CASE
        WHEN t.table_name IS NULL THEN 'missing'
        ELSE 'present'
    END AS readiness_status
FROM required_tables r
LEFT JOIN information_schema.tables t
    ON t.table_name = r.required_table
   AND t.table_schema = 'public'
ORDER BY r.obt_name, r.required_table;
