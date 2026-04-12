TRUNCATE TABLE public.obt_profit_loss_line RESTART IDENTITY;

INSERT INTO public.obt_profit_loss_line (
    source_module,
    source_doc_type,
    source_header_id,
    source_detail_id,
    doc_no,
    doc_date,
    fiscal_year,
    fiscal_month,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    account_code,
    account_name,
    account_type,
    normal_balance,
    pnl_category,
    pnl_group,
    debit_amount,
    credit_amount,
    net_amount,
    currency_code,
    exchange_rate,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    'm2' AS source_module,
    tj.tsumber AS source_doc_type,
    tj.tidtransaksi::text AS source_header_id,
    tj.tid::text AS source_detail_id,
    tj.tnotransaksi AS doc_no,
    tj.ttgl::timestamp without time zone AS doc_date,
    EXTRACT(YEAR FROM tj.ttgl)::integer AS fiscal_year,
    EXTRACT(MONTH FROM tj.ttgl)::integer AS fiscal_month,
    tj.tcabang AS branch_code,
    br.bnama AS branch_name,
    tj.tlokasi AS location_code,
    lc.lnama AS location_name,
    NULLIF(BTRIM(tj.tkontak::text), '') AS contact_id,
    ct.kkode AS contact_code,
    ct.knama AS contact_name,
    tj.tnorek AS account_code,
    coa.account_name,
    coa.account_type,
    coa.debit_credit_flag AS normal_balance,
    CASE coa.account_type
        WHEN '11' THEN 'REVENUE'
        WHEN '12' THEN 'COGS'
        WHEN '13' THEN 'OPERATING_EXPENSE'
        WHEN '14' THEN 'OTHER_INCOME'
        WHEN '15' THEN 'OTHER_EXPENSE'
        ELSE NULL
    END AS pnl_category,
    CASE coa.account_type
        WHEN '11' THEN 'GROSS_PROFIT'
        WHEN '12' THEN 'GROSS_PROFIT'
        WHEN '13' THEN 'OPERATING_PROFIT'
        WHEN '14' THEN 'OTHER_RESULT'
        WHEN '15' THEN 'OTHER_RESULT'
        ELSE NULL
    END AS pnl_group,
    COALESCE(NULLIF(tj.tdebit::text, '')::numeric(20,6), 0::numeric(20,6)) AS debit_amount,
    COALESCE(NULLIF(tj.tkredit::text, '')::numeric(20,6), 0::numeric(20,6)) AS credit_amount,
    CASE
        WHEN coa.account_type IN ('11', '14')
            THEN COALESCE(NULLIF(tj.tkredit::text, '')::numeric(20,6), 0::numeric(20,6))
               - COALESCE(NULLIF(tj.tdebit::text, '')::numeric(20,6), 0::numeric(20,6))
        WHEN coa.account_type IN ('12', '13', '15')
            THEN COALESCE(NULLIF(tj.tdebit::text, '')::numeric(20,6), 0::numeric(20,6))
               - COALESCE(NULLIF(tj.tkredit::text, '')::numeric(20,6), 0::numeric(20,6))
        ELSE 0::numeric(20,6)
    END AS net_amount,
    tj.tmatauang AS currency_code,
    NULLIF(tj.tkurs::text, '')::numeric(20,6) AS exchange_rate,
    COALESCE(NULLIF(tj.tcatatan, ''), NULLIF(tj.turaian, '')) AS notes,
    tj._cdc_payload AS source_payload,
    'baseline-profit-loss-line-v1' AS etl_batch_id,
    clock_timestamp() AS etl_loaded_at,
    clock_timestamp() AS etl_updated_at
FROM myerpplus_landing.m2_transaction_journal tj
JOIN public.dim_coa coa
  ON coa.account_code = tj.tnorek
LEFT JOIN myerpplus_landing.m1_branch br
  ON br.bkode = tj.tcabang
LEFT JOIN myerpplus_landing.m1_location lc
  ON lc.lkode = tj.tlokasi
LEFT JOIN myerpplus_landing.m1_contact ct
  ON ct.kid = NULLIF(BTRIM(tj.tkontak::text), '')::bigint
WHERE COALESCE(tj._cdc_deleted, false) = false
  AND coa.account_type IN ('11', '12', '13', '14', '15');
