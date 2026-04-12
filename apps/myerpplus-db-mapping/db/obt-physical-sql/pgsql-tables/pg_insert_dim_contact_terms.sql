INSERT INTO public.dim_contact_terms (contact_id, invoice_type, terms_code, etl_batch_id, etl_loaded_at, etl_updated_at, source_payload)
SELECT ktidkontak, kttipeinvoice, kttermin, 'baseline-dim-contact-terms-v1', clock_timestamp(), clock_timestamp(), _cdc_payload
FROM myerpplus_landing.m1_contact_terms
WHERE COALESCE(_cdc_deleted, false) = false;

