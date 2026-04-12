-- Audit whether the CDC layer already carries the transactional source set
-- required before relational landing materialization and OBT insert can start.

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
),
unique_required AS (
    SELECT
        required_table,
        string_agg(DISTINCT obt_name, ', ' ORDER BY obt_name) AS obt_dependencies
    FROM required_tables
    GROUP BY required_table
),
cdc_state AS (
    SELECT
        source_table,
        COUNT(*)::bigint AS current_state_rows,
        MAX(updated_at) AS last_current_state_at
    FROM cdc_current_state
    GROUP BY source_table
),
cdc_events AS (
    SELECT
        topic,
        COUNT(*)::bigint AS event_rows,
        MAX(created_at) AS last_event_at
    FROM cdc_events
    GROUP BY topic
)
SELECT
    r.required_table,
    r.obt_dependencies,
    'myerpplus.' || r.required_table AS expected_source_table,
    'myerpplus.myerpplus.' || r.required_table AS expected_topic,
    COALESCE(s.current_state_rows, 0) AS current_state_rows,
    s.last_current_state_at,
    COALESCE(e.event_rows, 0) AS event_rows,
    e.last_event_at,
    CASE
        WHEN COALESCE(s.current_state_rows, 0) > 0 THEN 'covered_in_current_state'
        WHEN COALESCE(e.event_rows, 0) > 0 THEN 'events_only'
        ELSE 'missing_in_cdc'
    END AS cdc_status
FROM unique_required r
LEFT JOIN cdc_state s
    ON s.source_table = 'myerpplus.' || r.required_table
LEFT JOIN cdc_events e
    ON e.topic = 'myerpplus.myerpplus.' || r.required_table
ORDER BY r.required_table;
