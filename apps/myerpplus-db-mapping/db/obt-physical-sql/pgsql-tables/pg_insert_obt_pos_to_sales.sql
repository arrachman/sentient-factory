-- Auto-generated from vw_obt_pos_to_sales.sql
-- Purpose:
--   bootstrap or append rows into the PostgreSQL OBT table
-- Note:
--   this is a plain INSERT for the first load
--   convert it to UPSERT or delta-based ETL for live sync

INSERT INTO obt_pos_to_sales
SELECT
    q.*,
    clock_timestamp() AS etl_loaded_at
FROM (
WITH voucher_usage AS (
    SELECT
        'm12' AS source_module,
        'POS_VOUCHER_USAGE' AS source_doc_type,
        vo.voidvi AS source_header_id,
        vo.void AS source_detail_id,
        vi.vikode AS doc_no,
        vi.vitglbuat AS doc_date,
        vi.viisclose AS doc_status_code,
        CASE vi.viisclose
            WHEN 1 THEN 'Closed'
            ELSE 'Available'
        END AS doc_status_name,
        vi.vicabang AS branch_code,
        br.bnama AS branch_name,
        vi.vilokasi AS location_code,
        lc.lnama AS location_name,
        vi.vikategori AS pos_category_code,
        pc.pcnama AS pos_category_name,
        vo.vosumber AS voucher_source,
        NULLIF(vo.voidtransaksi, 0) AS sales_invoice_id,
        vi.vimatauang AS voucher_currency_code,
        vi.vijml AS voucher_nominal_amount,
        vi.vijmlvalas AS voucher_nominal_amount_foreign,
        vi.vijmlbayar AS voucher_paid_amount,
        vi.vijmlbayarvalas AS voucher_paid_amount_foreign,
        (vi.vijml - vi.vijmlbayar) AS voucher_remaining_amount,
        (vi.vijmlvalas - vi.vijmlbayarvalas) AS voucher_remaining_amount_foreign,
        vo.vomatauang AS voucher_usage_currency_code,
        vo.vojmlbayar AS voucher_usage_amount,
        vo.vojmlbayarvalas AS voucher_usage_amount_foreign,
        vo.voisclose AS voucher_usage_closed,
        vi.vitglbuat AS voucher_issue_date,
        vi.vitglexpired AS voucher_expiry_date,
        vi.vitgllunas AS voucher_paid_off_date,
        vi.viisclose AS voucher_master_closed
    FROM m_12_pos_voucher_out vo
    LEFT JOIN m_12_pos_voucher_in vi
        ON vi.viid = vo.voidvi
    LEFT JOIN m_12_pos_category pc
        ON pc.pckode = vi.vikategori
    LEFT JOIN m1_branch br
        ON br.bkode = vi.vicabang
    LEFT JOIN m1_location lc
        ON lc.lkode = vi.vilokasi
),
sales_invoice AS (
    SELECT
        si.siid,
        si.sinotransaksi AS invoice_no,
        si.sitgl AS invoice_date,
        si.sistatus AS invoice_status_code,
        NULL AS invoice_status_name,
        si.sicabang AS invoice_branch_code,
        br.bnama AS invoice_branch_name,
        si.silokasi AS invoice_location_code,
        lc.lnama AS invoice_location_name,
        si.sicustomer AS contact_id,
        cust.kkode AS contact_code,
        cust.knama AS contact_name,
        si.sibagianpenjualan AS sales_contact_id,
        sales.kkode AS sales_contact_code,
        sales.knama AS sales_contact_name,
        si.sitermin AS terms_code,
        tr.trnama AS terms_name,
        si.sitotaltransaksi AS invoice_total,
        si.simatauang AS invoice_currency_code,
        si.sikurs AS invoice_exchange_rate,
        NULL AS input_user_id,
        NULL AS input_user_name,
        si.simodifikasiuser AS modified_user_id,
        user_mod.unama AS modified_user_name
    FROM m5_si si
    LEFT JOIN m1_branch br
        ON br.bkode = si.sicabang
    LEFT JOIN m1_location lc
        ON lc.lkode = si.silokasi
    LEFT JOIN m1_contact cust
        ON cust.kid = si.sicustomer
    LEFT JOIN m1_contact sales
        ON sales.kid = si.sibagianpenjualan
    LEFT JOIN m1_terms tr
        ON tr.trkode = si.sitermin
    LEFT JOIN m0_user user_mod
        ON user_mod.userid = si.simodifikasiuser
),
invoice_detail_totals AS (
    SELECT
        sid.idsi,
        COUNT(*) AS invoice_line_count,
        SUM((sid.jml * sid.harga) - sid.jmldiskon) AS invoice_detail_subtotal,
        SUM(sid.jml) AS invoice_qty,
        SUM(sid.jmlbarang) AS invoice_qty_base
    FROM m5_si_detail sid
    GROUP BY sid.idsi
)
SELECT
    v.source_module,
    'obt_pos_to_sales' AS obt_name,
    v.source_doc_type,
    v.source_header_id,
    v.source_detail_id,
    v.doc_no,
    v.doc_date,
    v.doc_status_code,
    v.doc_status_name,
    v.branch_code,
    v.branch_name,
    v.location_code,
    v.location_name,
    NULL AS contact_id,
    NULL AS contact_code,
    NULL AS contact_name,
    NULL AS item_id,
    NULL AS item_code,
    NULL AS item_name,
    NULL AS uom_code,
    NULL AS qty,
    v.voucher_usage_amount AS amount,
    v.voucher_usage_currency_code AS currency_code,
    NULL AS exchange_rate,
    v.voucher_source,
    v.pos_category_code,
    v.pos_category_name,
    v.voucher_issue_date,
    v.voucher_expiry_date,
    v.voucher_paid_off_date,
    v.voucher_master_closed,
    v.voucher_usage_closed,
    v.voucher_nominal_amount,
    v.voucher_nominal_amount_foreign,
    v.voucher_paid_amount,
    v.voucher_paid_amount_foreign,
    v.voucher_remaining_amount,
    v.voucher_remaining_amount_foreign,
    v.voucher_usage_amount,
    v.voucher_usage_amount_foreign,
    si.siid AS sales_invoice_id,
    si.invoice_no,
    si.invoice_date,
    si.invoice_status_code,
    si.invoice_status_name,
    si.invoice_branch_code,
    si.invoice_branch_name,
    si.invoice_location_code,
    si.invoice_location_name,
    si.contact_id AS sales_contact_customer_id,
    si.contact_code AS sales_contact_customer_code,
    si.contact_name AS sales_contact_customer_name,
    si.sales_contact_id,
    si.sales_contact_code,
    si.sales_contact_name,
    si.terms_code,
    si.terms_name,
    si.invoice_total,
    si.invoice_currency_code,
    si.invoice_exchange_rate,
    si.input_user_id,
    si.input_user_name,
    si.modified_user_id,
    si.modified_user_name,
    dt.invoice_line_count,
    dt.invoice_detail_subtotal,
    dt.invoice_qty,
    dt.invoice_qty_base,
    si.invoice_no AS downstream_doc_no,
    'POS_VOUCHER_OUT>SALES_INVOICE' AS lineage_path
FROM voucher_usage v
JOIN sales_invoice si
    ON si.siid = v.sales_invoice_id
LEFT JOIN invoice_detail_totals dt
    ON dt.idsi = si.siid
) AS q;
