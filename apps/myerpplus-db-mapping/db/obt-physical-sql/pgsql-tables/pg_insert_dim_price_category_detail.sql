INSERT INTO public.dim_price_category_detail (
    price_category_code, item_id, min_stock, max_stock, reorder_stock, min_order_stock,
    sell_price_1, sell_price_2, sell_price_3, sell_price_4, sell_price_5,
    etl_batch_id, etl_loaded_at, etl_updated_at, source_payload
)
SELECT pcdkategori, pcdidbarang,
       NULLIF(BTRIM(CAST(pcdstokminimal AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdstokmaksimal AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdstokreorder AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdstokminorder AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdhargajual1 AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdhargajual2 AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdhargajual3 AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdhargajual4 AS text)), '')::numeric(30,6),
       NULLIF(BTRIM(CAST(pcdhargajual5 AS text)), '')::numeric(30,6),
       'baseline-dim-price-category-detail-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_price_category_detail
WHERE COALESCE(_cdc_deleted, false) = false;
