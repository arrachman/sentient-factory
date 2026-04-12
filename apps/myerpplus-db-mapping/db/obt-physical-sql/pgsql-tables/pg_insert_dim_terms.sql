INSERT INTO public.dim_terms (
    terms_code,
    terms_name,
    due_days,
    discount_days_1,
    discount_percent_1,
    discount_days_2,
    discount_percent_2,
    penalty_percent,
    is_active,
    notes,
    source_payload,
    etl_batch_id,
    etl_loaded_at,
    etl_updated_at
)
SELECT
    trkode,
    trnama,
    NULLIF(BTRIM(CAST(trharijatuhtempo AS text)), '')::numeric(30,6)::bigint,
    NULLIF(BTRIM(CAST(trharidiskon1 AS text)), '')::numeric(30,6)::bigint,
    NULLIF(BTRIM(CAST(trdiskon1 AS text)), '')::numeric(30,6),
    NULLIF(BTRIM(CAST(trharidiskon2 AS text)), '')::numeric(30,6)::bigint,
    NULLIF(BTRIM(CAST(trdiskon2 AS text)), '')::numeric(30,6),
    NULLIF(BTRIM(CAST(trdenda AS text)), '')::numeric(30,6),
    traktif,
    trcatatan,
    _cdc_payload,
    'baseline-dim-terms-v1',
    clock_timestamp(),
    clock_timestamp()
FROM myerpplus_landing.m1_terms
WHERE COALESCE(_cdc_deleted, false) = false;
