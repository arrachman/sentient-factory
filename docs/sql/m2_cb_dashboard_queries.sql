-- m2_cb dashboard query pack (Saldo Awal COA)
-- Params:
-- :from_date  (DATE, optional)
-- :to_date    (DATE, optional)
-- :cabang     (VARCHAR, optional)
-- :sumber     (VARCHAR, optional)
--
-- Filtering convention used below:
--   (:from_date IS NULL OR cb.cbtgl >= :from_date)
--   (:to_date   IS NULL OR cb.cbtgl <= :to_date)
--   (:cabang    IS NULL OR cb.cbcabang = :cabang)
--   (:sumber    IS NULL OR cb.cbsumber = :sumber)

-- =====================================
-- WIDGETS
-- =====================================

-- W1. Total dokumen
SELECT COUNT(*) AS total_dokumen
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber);

-- W2. Total debit, total kredit, net opening balance
SELECT
  COALESCE(SUM(cb.cbdebit), 0) AS total_debit,
  COALESCE(SUM(cb.cbkredit), 0) AS total_kredit,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS net_opening_balance
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber);

-- W3. Posted vs unposted
SELECT
  cb.cbposting,
  COUNT(*) AS jumlah_dokumen,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS nominal
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbposting
ORDER BY cb.cbposting;

-- W4. Breakdown status dokumen
SELECT
  cb.cbstatus,
  COUNT(*) AS jumlah_dokumen,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS nominal
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbstatus
ORDER BY jumlah_dokumen DESC;

-- W5. Rata-rata nominal per dokumen
SELECT
  COALESCE(AVG(cb.cbdebit + cb.cbkredit), 0) AS avg_nominal_per_dokumen
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber);

-- =====================================
-- CHARTS
-- =====================================

-- C1. Top cabang by net opening balance
SELECT
  cb.cbcabang,
  COALESCE(SUM(cb.cbdebit), 0) AS total_debit,
  COALESCE(SUM(cb.cbkredit), 0) AS total_kredit,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS net_opening_balance
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbcabang
ORDER BY net_opening_balance DESC;

-- C2. Komposisi status (for pie/donut)
SELECT
  cb.cbstatus,
  COUNT(*) AS jumlah_dokumen,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS nominal
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbstatus
ORDER BY jumlah_dokumen DESC;

-- C3. Posted vs unposted per cabang (stacked bar)
SELECT
  cb.cbcabang,
  cb.cbposting,
  COUNT(*) AS jumlah_dokumen,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS nominal
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbcabang, cb.cbposting
ORDER BY cb.cbcabang, cb.cbposting;

-- C4. Tren harian nominal opening balance
SELECT
  cb.cbtgl,
  COUNT(*) AS jumlah_dokumen,
  COALESCE(SUM(cb.cbdebit), 0) AS total_debit,
  COALESCE(SUM(cb.cbkredit), 0) AS total_kredit,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS net_opening_balance
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbtgl
ORDER BY cb.cbtgl;

-- C5. Top akun detail (norek) by net saldo
SELECT
  d.norek,
  COALESCE(SUM(d.debit), 0) AS total_debit,
  COALESCE(SUM(d.kredit), 0) AS total_kredit,
  COALESCE(SUM(d.debit - d.kredit), 0) AS net_saldo
FROM m2_cb_detail d
JOIN m2_cb cb ON cb.cbid = d.idcb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY d.norek
ORDER BY net_saldo DESC
LIMIT 20;

-- C6. Matrix cabang x sumber (for heatmap)
SELECT
  cb.cbcabang,
  cb.cbsumber,
  COUNT(*) AS jumlah_dokumen,
  COALESCE(SUM(cb.cbdebit - cb.cbkredit), 0) AS net_opening_balance
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY cb.cbcabang, cb.cbsumber
ORDER BY cb.cbcabang, cb.cbsumber;

-- =====================================
-- AI INSIGHT SUPPORT QUERIES
-- =====================================

-- A1. Dokumen dengan nominal terbesar (top candidates for anomaly)
SELECT
  cb.cbid,
  cb.cbnotransaksi,
  cb.cbtgl,
  cb.cbcabang,
  cb.cbsumber,
  cb.cbstatus,
  cb.cbposting,
  (cb.cbdebit - cb.cbkredit) AS net_nominal
FROM m2_cb cb
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
ORDER BY ABS(cb.cbdebit - cb.cbkredit) DESC
LIMIT 20;

-- A2. Material unposted
SELECT
  cb.cbid,
  cb.cbnotransaksi,
  cb.cbtgl,
  cb.cbcabang,
  cb.cbstatus,
  cb.cbposting,
  (cb.cbdebit - cb.cbkredit) AS net_nominal
FROM m2_cb cb
WHERE cb.cbposting = 0
  AND (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
ORDER BY ABS(cb.cbdebit - cb.cbkredit) DESC
LIMIT 20;

-- A3. Header-detail mismatch check
SELECT
  cb.cbid,
  cb.cbnotransaksi,
  cb.cbcabang,
  cb.cbtgl,
  cb.cbdebit AS header_debit,
  COALESCE(SUM(d.debit), 0) AS detail_debit,
  cb.cbkredit AS header_kredit,
  COALESCE(SUM(d.kredit), 0) AS detail_kredit,
  (cb.cbdebit - COALESCE(SUM(d.debit), 0)) AS diff_debit,
  (cb.cbkredit - COALESCE(SUM(d.kredit), 0)) AS diff_kredit
FROM m2_cb cb
LEFT JOIN m2_cb_detail d ON d.idcb = cb.cbid
WHERE (:from_date IS NULL OR cb.cbtgl >= :from_date)
  AND (:to_date   IS NULL OR cb.cbtgl <= :to_date)
  AND (:cabang    IS NULL OR cb.cbcabang = :cabang)
  AND (:sumber    IS NULL OR cb.cbsumber = :sumber)
GROUP BY
  cb.cbid, cb.cbnotransaksi, cb.cbcabang, cb.cbtgl, cb.cbdebit, cb.cbkredit
HAVING ABS(diff_debit) > 0.01 OR ABS(diff_kredit) > 0.01
ORDER BY ABS(diff_debit) + ABS(diff_kredit) DESC;
