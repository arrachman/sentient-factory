-- Draft physical OBT skeleton for MyERPPlus POS voucher to formal sales invoice tracing.
-- Stable cross-module path from semantic artifacts:
--   m_12_pos_voucher_out.voidtransaction -> m5_si.siid
-- Target engine: MySQL 8+ style SQL

WITH voucher_usage AS (
    SELECT
        'm12' AS source_module,
        'POS_VOUCHER_USAGE' AS source_doc_type,
        vo.voidvi AS source_header_id,
        vo.void AS source_detail_id,
        vo.vosumber AS voucher_source,
        vo.voidtransaksi AS sales_invoice_id,
        vo.vomatauang AS voucher_currency_code,
        vo.vojmlbayar AS voucher_amount,
        vo.vojmlbayarvalas AS voucher_amount_foreign,
        vo.voisclose AS voucher_usage_closed,
        vi.vikode AS voucher_code,
        vi.vikategori AS pos_category_code,
        pc.pcnama AS pos_category_name,
        vi.vitglbuat AS voucher_issue_date,
        vi.vitglexpired AS voucher_expiry_date,
        vi.viisclose AS voucher_master_closed
    FROM m_12_pos_voucher_out vo
    LEFT JOIN m_12_pos_voucher_in vi
        ON vi.viid = vo.voidvi
    LEFT JOIN m_12_pos_category pc
        ON pc.pckode = vi.vikategori
),
sales_invoice AS (
    SELECT
        si.siid,
        si.sinotransaksi AS invoice_no,
        si.sitgl AS invoice_date,
        si.sistatus AS invoice_status_code,
        st.nama AS invoice_status_name,
        si.sicabang AS branch_code,
        br.bnama AS branch_name,
        si.silokasi AS location_code,
        lc.lnama AS location_name,
        si.sicustomer AS contact_id,
        cust.kkode AS contact_code,
        cust.knama AS contact_name,
        si.sitotaltransaksi AS invoice_total
    FROM m5_si si
    LEFT JOIN m0_status st
        ON st.kode = si.sistatus
    LEFT JOIN m1_branch br
        ON br.bkode = si.sicabang
    LEFT JOIN m1_location lc
        ON lc.lkode = si.silokasi
    LEFT JOIN m1_contact cust
        ON cust.kid = si.sicustomer
),
invoice_detail_totals AS (
    SELECT
        sid.idsi,
        COUNT(*) AS line_count,
        SUM((sid.jml * sid.harga) - sid.jmldiskon) AS detail_subtotal
    FROM m5_si_detail sid
    GROUP BY sid.idsi
)
SELECT
    v.source_module,
    'obt_pos_to_sales' AS obt_name,
    v.source_doc_type,
    v.source_header_id,
    v.source_detail_id,
    v.voucher_source,
    v.voucher_code,
    v.pos_category_code,
    v.pos_category_name,
    v.voucher_issue_date,
    v.voucher_expiry_date,
    v.voucher_master_closed,
    v.voucher_usage_closed,
    v.voucher_currency_code,
    v.voucher_amount,
    v.voucher_amount_foreign,
    si.siid AS sales_invoice_id,
    si.invoice_no,
    si.invoice_date,
    si.invoice_status_code,
    si.invoice_status_name,
    si.branch_code,
    si.branch_name,
    si.location_code,
    si.location_name,
    si.contact_id,
    si.contact_code,
    si.contact_name,
    si.invoice_total,
    dt.line_count AS invoice_line_count,
    dt.detail_subtotal AS invoice_detail_subtotal,
    'POS_VOUCHER_OUT>SALES_INVOICE' AS lineage_path
FROM voucher_usage v
JOIN sales_invoice si
    ON si.siid = v.sales_invoice_id
LEFT JOIN invoice_detail_totals dt
    ON dt.idsi = si.siid;
