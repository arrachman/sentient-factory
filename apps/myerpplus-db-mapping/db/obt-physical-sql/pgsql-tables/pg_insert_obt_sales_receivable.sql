TRUNCATE TABLE public.obt_sales_receivable RESTART IDENTITY;

INSERT INTO public.obt_sales_receivable (
    obt_name,
    source_module,
    source_doc_type,
    source_header_id,
    source_detail_id,
    source_allocation_id,
    doc_no,
    doc_date,
    doc_status_code,
    doc_status_name,
    branch_code,
    branch_name,
    location_code,
    location_name,
    contact_id,
    contact_code,
    contact_name,
    item_id,
    item_code,
    item_name,
    uom_code,
    upstream_doc_no,
    downstream_doc_no,
    lineage_path,
    qty,
    amount,
    due_date,
    invoice_amount,
    paid_amount,
    outstanding_amount,
    payment_status_code,
    payment_status_name,
    currency_code,
    exchange_rate,
    input_user_id,
    input_user_name,
    modified_user_id,
    modified_user_name,
    source_payload,
    etl_batch_id
)
WITH si_rows AS (
    SELECT
        'obt_sales_receivable'::text AS obt_name,
        'm5'::text AS source_module,
        'SI'::text AS source_doc_type,
        si.siid::text AS source_header_id,
        NULL::text AS source_detail_id,
        NULL::text AS source_allocation_id,
        si.sinotransaksi::text AS doc_no,
        si.sitgl::timestamptz AS doc_date,
        si.sistatus::text AS doc_status_code,
        CASE
            WHEN GREATEST(
                COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) -
                COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
                0::numeric(20,6)
            ) = 0 THEN 'LUNAS'
            WHEN COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)) > 0 THEN 'PARTIAL'
            ELSE 'OPEN'
        END::text AS doc_status_name,
        si.sicabang::text AS branch_code,
        b.bnama::text AS branch_name,
        si.silokasi::text AS location_code,
        l.lnama::text AS location_name,
        si.sicustomer::text AS contact_id,
        c.kkode::text AS contact_code,
        c.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        NULL::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        'SI'::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) AS amount,
        si.sitgljatuhtempo::timestamptz AS due_date,
        COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) AS invoice_amount,
        COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)) AS paid_amount,
        GREATEST(
            COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) -
            COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
            0::numeric(20,6)
        ) AS outstanding_amount,
        si.sistatuslunas::text AS payment_status_code,
        CASE
            WHEN GREATEST(
                COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) -
                COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
                0::numeric(20,6)
            ) = 0 THEN 'LUNAS'
            WHEN COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)) > 0 THEN 'PARTIAL'
            ELSE 'OPEN'
        END::text AS payment_status_name,
        si.simatauang::text AS currency_code,
        COALESCE(NULLIF(si.sikurs::text, '')::numeric(20,6), 1::numeric(20,6)) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        si.simodifikasiuser::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'si', to_jsonb(si)
        ) AS source_payload,
        'baseline-bootstrap'::text AS etl_batch_id
    FROM myerpplus_landing.m5_si si
    LEFT JOIN myerpplus_landing.m1_branch b
      ON b.bkode = si.sicabang
    LEFT JOIN myerpplus_landing.m1_location l
      ON l.lkode = si.silokasi
    LEFT JOIN myerpplus_landing.m1_contact c
      ON c.kid::text = si.sicustomer::text
),
ic_rows AS (
    SELECT
        'obt_sales_receivable'::text AS obt_name,
        'm5'::text AS source_module,
        'IC_DETAIL'::text AS source_doc_type,
        ic.icid::text AS source_header_id,
        icd.idicdetail::text AS source_detail_id,
        icd.idicdetail::text AS source_allocation_id,
        ic.icnotransaksi::text AS doc_no,
        ic.ictgl::timestamptz AS doc_date,
        ic.icstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        ic.iccabang::text AS branch_code,
        b.bnama::text AS branch_name,
        ic.iclokasi::text AS location_code,
        l.lnama::text AS location_name,
        ic.iccustomer::text AS contact_id,
        c.kkode::text AS contact_code,
        c.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        CASE
            WHEN icd.sumber = 'SI' THEN si.sinotransaksi
            WHEN icd.sumber = 'SR' THEN sr.srnotransaksi
            WHEN icd.sumber = 'AS' THEN tas.asnotransaksi
            WHEN icd.sumber = 'IP' THEN ip.ipnotransaksi
            WHEN icd.sumber = 'RP' THEN rp.rpnotransaksi
            ELSE NULL
        END::text AS upstream_doc_no,
        pv.pvnotransaksi::text AS downstream_doc_no,
        CONCAT_WS(' -> ', icd.sumber, 'IC', 'PV')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(icd.sisa::text, '')::numeric(20,6),
            NULLIF(icd.totaltransaksi::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        si.sitgljatuhtempo::timestamptz AS due_date,
        COALESCE(
            NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6),
            NULLIF(icd.totaltransaksi::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS invoice_amount,
        COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)) AS paid_amount,
        GREATEST(
            COALESCE(
                NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6),
                NULLIF(icd.totaltransaksi::text, '')::numeric(20,6),
                0::numeric(20,6)
            ) - COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
            0::numeric(20,6)
        ) AS outstanding_amount,
        COALESCE(si.sistatuslunas::text, icd.statuspv::text)::text AS payment_status_code,
        CASE
            WHEN si.siid IS NULL THEN NULL::text
            WHEN GREATEST(
                COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) -
                COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
                0::numeric(20,6)
            ) = 0 THEN 'LUNAS'
            WHEN COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)) > 0 THEN 'PARTIAL'
            ELSE 'OPEN'
        END::text AS payment_status_name,
        COALESCE(NULLIF(icd.matauang, ''), NULLIF(ic.icmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(icd.kurs::text, '')::numeric(20,6),
            NULLIF(ic.ickurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'ic', to_jsonb(ic),
            'ic_detail', to_jsonb(icd),
            'pv', to_jsonb(pv),
            'si', to_jsonb(si),
            'sr', to_jsonb(sr),
            'as', to_jsonb(tas),
            'ip', to_jsonb(ip),
            'rp', to_jsonb(rp)
        ) AS source_payload,
        'baseline-bootstrap'::text AS etl_batch_id
    FROM myerpplus_landing.m5_ic_detail icd
    JOIN myerpplus_landing.m5_ic ic
      ON ic.icid = icd.idic
    LEFT JOIN myerpplus_landing.m5_pv_detail pvd
      ON pvd.idicdetail::text = icd.idicdetail::text
    LEFT JOIN myerpplus_landing.m5_pv pv
      ON pv.pvid = pvd.idpv
    LEFT JOIN myerpplus_landing.m1_branch b
      ON b.bkode = ic.iccabang
    LEFT JOIN myerpplus_landing.m1_location l
      ON l.lkode = ic.iclokasi
    LEFT JOIN myerpplus_landing.m1_contact c
      ON c.kid::text = ic.iccustomer::text
    LEFT JOIN myerpplus_landing.m5_si si
      ON icd.sumber = 'SI'
     AND si.siid::text = icd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_sr sr
      ON icd.sumber = 'SR'
     AND sr.srid::text = icd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_as tas
      ON icd.sumber = 'AS'
     AND tas.asid::text = icd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_ip ip
      ON icd.sumber = 'IP'
     AND ip.ipid::text = icd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_rp rp
      ON icd.sumber = 'RP'
     AND rp.rpid::text = icd.idtransaksi::text
),
pv_rows AS (
    SELECT
        'obt_sales_receivable'::text AS obt_name,
        'm5'::text AS source_module,
        'PV_DETAIL'::text AS source_doc_type,
        pv.pvid::text AS source_header_id,
        pvd.idpvdetail::text AS source_detail_id,
        COALESCE(NULLIF(pvd.idicdetail::text, ''), pvd.idpvdetail::text)::text AS source_allocation_id,
        pv.pvnotransaksi::text AS doc_no,
        pv.pvtgl::timestamptz AS doc_date,
        pv.pvstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        pv.pvcabang::text AS branch_code,
        b.bnama::text AS branch_name,
        pv.pvlokasi::text AS location_code,
        l.lnama::text AS location_name,
        pv.pvcustomer::text AS contact_id,
        c.kkode::text AS contact_code,
        c.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        CASE
            WHEN pvd.sumber = 'SI' THEN si.sinotransaksi
            WHEN pvd.sumber = 'SR' THEN sr.srnotransaksi
            WHEN pvd.sumber = 'AS' THEN tas.asnotransaksi
            WHEN pvd.sumber = 'IP' THEN ip.ipnotransaksi
            WHEN pvd.sumber = 'RP' THEN rp.rpnotransaksi
            ELSE NULL
        END::text AS upstream_doc_no,
        ic.icnotransaksi::text AS downstream_doc_no,
        CONCAT_WS(' -> ', pvd.sumber, 'PV')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(pvd.jmlbayar::text, '')::numeric(20,6),
            NULLIF(pvd.jmlbayarvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        si.sitgljatuhtempo::timestamptz AS due_date,
        COALESCE(
            NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6),
            NULLIF(pvd.totaltransaksi::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS invoice_amount,
        COALESCE(
            NULLIF(si.sijmlbayar::text, '')::numeric(20,6),
            NULLIF(pvd.jmlbayar::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS paid_amount,
        GREATEST(
            COALESCE(
                NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6),
                NULLIF(pvd.totaltransaksi::text, '')::numeric(20,6),
                0::numeric(20,6)
            ) - COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
            0::numeric(20,6)
        ) AS outstanding_amount,
        COALESCE(si.sistatuslunas::text, icd.statuspv::text)::text AS payment_status_code,
        CASE
            WHEN si.siid IS NULL THEN NULL::text
            WHEN GREATEST(
                COALESCE(NULLIF(si.sitotaltransaksi::text, '')::numeric(20,6), 0::numeric(20,6)) -
                COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)),
                0::numeric(20,6)
            ) = 0 THEN 'LUNAS'
            WHEN COALESCE(NULLIF(si.sijmlbayar::text, '')::numeric(20,6), 0::numeric(20,6)) > 0 THEN 'PARTIAL'
            ELSE 'OPEN'
        END::text AS payment_status_name,
        COALESCE(NULLIF(pvd.matauang, ''), NULLIF(pv.pvmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(pvd.kurs::text, '')::numeric(20,6),
            NULLIF(pv.pvkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'pv', to_jsonb(pv),
            'pv_detail', to_jsonb(pvd),
            'ic', to_jsonb(ic),
            'si', to_jsonb(si),
            'sr', to_jsonb(sr),
            'as', to_jsonb(tas),
            'ip', to_jsonb(ip),
            'rp', to_jsonb(rp)
        ) AS source_payload,
        'baseline-bootstrap'::text AS etl_batch_id
    FROM myerpplus_landing.m5_pv_detail pvd
    JOIN myerpplus_landing.m5_pv pv
      ON pv.pvid = pvd.idpv
    LEFT JOIN myerpplus_landing.m5_ic_detail icd
      ON icd.idicdetail::text = pvd.idicdetail::text
    LEFT JOIN myerpplus_landing.m5_ic ic
      ON ic.icid = icd.idic
    LEFT JOIN myerpplus_landing.m1_branch b
      ON b.bkode = pv.pvcabang
    LEFT JOIN myerpplus_landing.m1_location l
      ON l.lkode = pv.pvlokasi
    LEFT JOIN myerpplus_landing.m1_contact c
      ON c.kid::text = pv.pvcustomer::text
    LEFT JOIN myerpplus_landing.m5_si si
      ON pvd.sumber = 'SI'
     AND si.siid::text = pvd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_sr sr
      ON pvd.sumber = 'SR'
     AND sr.srid::text = pvd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_as tas
      ON pvd.sumber = 'AS'
     AND tas.asid::text = pvd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_ip ip
      ON pvd.sumber = 'IP'
     AND ip.ipid::text = pvd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m5_rp rp
      ON pvd.sumber = 'RP'
     AND rp.rpid::text = pvd.idtransaksi::text
)
SELECT * FROM si_rows
UNION ALL
SELECT * FROM ic_rows
UNION ALL
SELECT * FROM pv_rows;
