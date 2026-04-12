TRUNCATE TABLE public.obt_purchase_payment RESTART IDENTITY;

INSERT INTO public.obt_purchase_payment (
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
    currency_code,
    exchange_rate,
    input_user_id,
    input_user_name,
    modified_user_id,
    modified_user_name,
    source_payload,
    etl_batch_id
)
WITH ap_pay_rows AS (
    SELECT
        'obt_purchase_payment'::text AS obt_name,
        'm4'::text AS source_module,
        'AP_PAY'::text AS source_doc_type,
        ap.apid::text AS source_header_id,
        pay.idapcarabayar::text AS source_detail_id,
        pay.idapcarabayar::text AS source_allocation_id,
        ap.apnotransaksi::text AS doc_no,
        ap.aptgl::timestamptz AS doc_date,
        ap.apstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        ap.apcabang::text AS branch_code,
        b.bnama::text AS branch_name,
        ap.aplokasi::text AS location_code,
        l.lnama::text AS location_name,
        ap.apkontak::text AS contact_id,
        c.kkode::text AS contact_code,
        c.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        CASE
            WHEN ap.apsumber = 'RI' THEN ri.rinotransaksi
            WHEN ap.apsumber = 'PRT' THEN prt.prtnotransaksi
            ELSE NULL
        END::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        CONCAT_WS(' -> ', ap.apsumber, 'AP', 'AP_PAY')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(pay.jumlah::text, '')::numeric(20,6),
            NULLIF(pay.jumlahvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        COALESCE(NULLIF(pay.matauang, ''), NULLIF(ap.apmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(pay.kurs::text, '')::numeric(20,6),
            NULLIF(ap.apkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'ap', to_jsonb(ap),
            'ap_pay', to_jsonb(pay),
            'ri', to_jsonb(ri),
            'prt', to_jsonb(prt)
        ) AS source_payload,
        'baseline-bootstrap'::text AS etl_batch_id
    FROM myerpplus_landing.m4_ap_pay pay
    JOIN myerpplus_landing.m4_ap ap
      ON ap.apid = pay.idap
    LEFT JOIN myerpplus_landing.m1_branch b
      ON b.bkode = ap.apcabang
    LEFT JOIN myerpplus_landing.m1_location l
      ON l.lkode = ap.aplokasi
    LEFT JOIN myerpplus_landing.m1_contact c
      ON c.kid::text = ap.apkontak::text
    LEFT JOIN myerpplus_landing.m4_ri ri
      ON ap.apsumber = 'RI'
     AND ri.riid::text = ap.apid::text
    LEFT JOIN myerpplus_landing.m4_prt prt
      ON ap.apsumber = 'PRT'
     AND prt.prtid::text = ap.apid::text
),
vp_rows AS (
    SELECT
        'obt_purchase_payment'::text AS obt_name,
        'm4'::text AS source_module,
        'VP_DETAIL'::text AS source_doc_type,
        vp.vpid::text AS source_header_id,
        vpd.idvpdetail::text AS source_detail_id,
        COALESCE(NULLIF(vpd.idvppdetail::text, ''), vpd.idvpdetail::text)::text AS source_allocation_id,
        vp.vpnotransaksi::text AS doc_no,
        vp.vptgl::timestamptz AS doc_date,
        vp.vpstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        vp.vpcabang::text AS branch_code,
        b.bnama::text AS branch_name,
        vp.vplokasi::text AS location_code,
        l.lnama::text AS location_name,
        vp.vpsupplier::text AS contact_id,
        c.kkode::text AS contact_code,
        c.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        CASE
            WHEN vpd.sumber = 'RI' THEN ri.rinotransaksi
            WHEN vpd.sumber = 'AP' THEN ap.apnotransaksi
            WHEN vpd.sumber = 'PRT' THEN prt.prtnotransaksi
            ELSE NULL
        END::text AS upstream_doc_no,
        NULL::text AS downstream_doc_no,
        CONCAT_WS(' -> ', vpd.sumber, 'VP')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(vpd.jmlbayar::text, '')::numeric(20,6),
            NULLIF(vpd.jmlbayarvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        COALESCE(NULLIF(vpd.matauang, ''), NULLIF(vp.vpmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(vpd.kurs::text, '')::numeric(20,6),
            NULLIF(vp.vpkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'vp', to_jsonb(vp),
            'vp_detail', to_jsonb(vpd),
            'ap', to_jsonb(ap),
            'ri', to_jsonb(ri),
            'prt', to_jsonb(prt)
        ) AS source_payload,
        'baseline-bootstrap'::text AS etl_batch_id
    FROM myerpplus_landing.m4_vp_detail vpd
    JOIN myerpplus_landing.m4_vp vp
      ON vp.vpid = vpd.idvp
    LEFT JOIN myerpplus_landing.m1_branch b
      ON b.bkode = vp.vpcabang
    LEFT JOIN myerpplus_landing.m1_location l
      ON l.lkode = vp.vplokasi
    LEFT JOIN myerpplus_landing.m1_contact c
      ON c.kid::text = vp.vpsupplier::text
    LEFT JOIN myerpplus_landing.m4_ap ap
      ON vpd.sumber = 'AP'
     AND ap.apid::text = vpd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m4_ri ri
      ON vpd.sumber = 'RI'
     AND ri.riid::text = vpd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m4_prt prt
      ON vpd.sumber = 'PRT'
     AND prt.prtid::text = vpd.idtransaksi::text
),
vpp_rows AS (
    SELECT
        'obt_purchase_payment'::text AS obt_name,
        'm4'::text AS source_module,
        'VPP_DETAIL'::text AS source_doc_type,
        vpp.vppid::text AS source_header_id,
        vppd.idvppdetail::text AS source_detail_id,
        vppd.idvppdetail::text AS source_allocation_id,
        vpp.vppnotransaksi::text AS doc_no,
        vpp.vpptgl::timestamptz AS doc_date,
        vpp.vppstatus::text AS doc_status_code,
        NULL::text AS doc_status_name,
        vpp.vppcabang::text AS branch_code,
        b.bnama::text AS branch_name,
        vpp.vpplokasi::text AS location_code,
        l.lnama::text AS location_name,
        vpp.vppsupplier::text AS contact_id,
        c.kkode::text AS contact_code,
        c.knama::text AS contact_name,
        NULL::text AS item_id,
        NULL::text AS item_code,
        NULL::text AS item_name,
        NULL::text AS uom_code,
        CASE
            WHEN vppd.sumber = 'RI' THEN ri.rinotransaksi
            WHEN vppd.sumber = 'AP' THEN ap.apnotransaksi
            WHEN vppd.sumber = 'PRT' THEN prt.prtnotransaksi
            ELSE NULL
        END::text AS upstream_doc_no,
        COALESCE(vp.vpnotransaksi, NULL)::text AS downstream_doc_no,
        CONCAT_WS(' -> ', vppd.sumber, 'VPP', 'VP')::text AS lineage_path,
        NULL::numeric(20,6) AS qty,
        COALESCE(
            NULLIF(vppd.jmlbayar::text, '')::numeric(20,6),
            NULLIF(vppd.jmlbayarvalas::text, '')::numeric(20,6),
            0::numeric(20,6)
        ) AS amount,
        COALESCE(NULLIF(vppd.matauang, ''), NULLIF(vpp.vppmatauang, ''))::text AS currency_code,
        COALESCE(
            NULLIF(vppd.kurs::text, '')::numeric(20,6),
            NULLIF(vpp.vppkurs::text, '')::numeric(20,6)
        ) AS exchange_rate,
        NULL::text AS input_user_id,
        NULL::text AS input_user_name,
        NULL::text AS modified_user_id,
        NULL::text AS modified_user_name,
        jsonb_build_object(
            'vpp', to_jsonb(vpp),
            'vpp_detail', to_jsonb(vppd),
            'vp', to_jsonb(vp),
            'ap', to_jsonb(ap),
            'ri', to_jsonb(ri),
            'prt', to_jsonb(prt)
        ) AS source_payload,
        'baseline-bootstrap'::text AS etl_batch_id
    FROM myerpplus_landing.m4_vpp_detail vppd
    JOIN myerpplus_landing.m4_vpp vpp
      ON vpp.vppid = vppd.idvpp
    LEFT JOIN myerpplus_landing.m4_vp_detail vpd
      ON vpd.idvppdetail::text = vppd.idvppdetail::text
    LEFT JOIN myerpplus_landing.m4_vp vp
      ON vp.vpid = vpd.idvp
    LEFT JOIN myerpplus_landing.m1_branch b
      ON b.bkode = vpp.vppcabang
    LEFT JOIN myerpplus_landing.m1_location l
      ON l.lkode = vpp.vpplokasi
    LEFT JOIN myerpplus_landing.m1_contact c
      ON c.kid::text = vpp.vppsupplier::text
    LEFT JOIN myerpplus_landing.m4_ap ap
      ON vppd.sumber = 'AP'
     AND ap.apid::text = vppd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m4_ri ri
      ON vppd.sumber = 'RI'
     AND ri.riid::text = vppd.idtransaksi::text
    LEFT JOIN myerpplus_landing.m4_prt prt
      ON vppd.sumber = 'PRT'
     AND prt.prtid::text = vppd.idtransaksi::text
)
SELECT * FROM ap_pay_rows
UNION ALL
SELECT * FROM vp_rows
UNION ALL
SELECT * FROM vpp_rows;
