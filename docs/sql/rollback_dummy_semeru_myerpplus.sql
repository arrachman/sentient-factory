-- rollback_dummy_semeru_myerpplus.sql
-- Remove Semeru Teknik dummy data created with STDMY-* prefixes

START TRANSACTION;

DELETE cp
FROM m1_contact_price cp
JOIN m1_item i ON i.bid = cp.khidbarang
WHERE i.bkode LIKE 'STDMY-%';

DELETE ip
FROM m1_item_price ip
JOIN m1_item i ON i.bid = ip.khidbarang
WHERE i.bkode LIKE 'STDMY-%';

DELETE isup
FROM m1_item_supplier isup
JOIN m1_item i ON i.bid = isup.isidbarang
WHERE i.bkode LIKE 'STDMY-%';

DELETE sw
FROM m1_item_stock_warehouse sw
JOIN m1_item i ON i.bid = sw.idbarang
WHERE i.bkode LIKE 'STDMY-%';

DELETE FROM m1_item
WHERE bkode LIKE 'STDMY-%';

DELETE FROM m1_contact
WHERE kkode LIKE 'STDMY-%';

DELETE FROM m1_item_category
WHERE ickode IN ('STDMY-ENG', 'STDMY-SPR', 'STDMY-MRN');

DELETE FROM m1_merk
WHERE mkode IN ('STDMY-MRK-YMR', 'STDMY-MRK-HND', 'STDMY-MRK-KBT');

COMMIT;
