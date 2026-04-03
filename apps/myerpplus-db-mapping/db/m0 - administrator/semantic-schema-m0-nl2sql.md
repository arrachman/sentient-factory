# M0 NL2SQL Guide

Sumber utama:
- `semantic-schema-m0.json`
- `semantic-schema-m0-summary.md`
- `m0-queries.md`
- `m0-queries-by-type.md`

Tujuan:
- membantu pemilihan tabel administrator yang tepat
- membantu membedakan area readonly dan write-path
- memberi sinonim bisnis natural untuk retrieval
- menandai join aman untuk user, role, menu, report, setting, dan audit log

## Cakupan Tabel Utama

- Aplikasi dan integrasi: `m0_app`
- Backup dan maintenance: `m0_backup`, `m0_hapusdata`, `m0_hitungulang_log`, `m0_hppaverage`, `m0_hppsaldo`, `m0_validitas_data`
- Konfigurasi form UI: `m0_form_custom_text`, `m0_form_setting_global`, `m0_form_setting_search`, `m0_form_setting_user`
- Bahasa dan translation resource: `m0_language`, `m0_language_detail`, `m0_sentence`, `m0_sentence_s`, `m0_sentence_translate`, `m0_sentence_stranslate`, `m0_translate`
- Menu dan modul: `m0_module`, `m0_menu`, `m0_menu_lang`, `m0_menu_s`, `m0_menu_s_lang`
- Background queue / MSMQ: `m0_msmq`, `m0_msmq_cogs`, `m0_msmq_importdata`, `m0_msmq_journal`
- Penomoran dokumen: `m0_nomor`, `m0_nomor_next`, `m0_nomor_mobile`, `m0_barcode_next`, `m0_group_aq`, `m0_group_rq`
- Lampiran dan notes: `m0_files`, `m0_notes`
- Notifikasi: `m0_notifikasi_email`
- Report dan metadata report: `m0_report`, `m0_report_filter`, `m0_report_label`, `m0_report_label_translate`, `m0_report_lang`, `m0_report_temp`
- Role dan permission: `m0_role`, `m0_role_s`, `m0_role_custom`, `m0_role_item_category`, `m0_role_menu`, `m0_role_menu_s`, `m0_role_report`, `m0_role_report_s`, ...
- Lookup dan setting bisnis: `m0_search_packet`, `m0_selling_rate`, `m0_setting`, `m0_setting_lang`, `m0_setting_location`, `m0_payment_method`, `m0_jenismutasi`, `m0_status`, ...
- User, group, akses, session, dan audit: `m0_user`, `m0_user_branch`, `m0_user_coa`, `m0_user_location`, `m0_user_role`, `m0_user_role_s`, `m0_user_warehouse`, `m0_usercustom`, ...

## Sinonim Bisnis

- `USER`: user, pengguna, account, akun login
- `ROLE`: role, hak akses, permission
- `MENU`: menu, navigasi, sidebar
- `REPORT`: report, laporan, template report
- `SETTING`: setting, konfigurasi, parameter sistem
- `NUMBERING`: nomor dokumen, auto numbering, running number
- `QUEUE`: background queue, antrian proses, MSMQ
- `LANGUAGE`: bahasa, translation, terjemahan UI
- `NOTIFICATION`: email notification, notifikasi email
- `USERLOG`: audit log, aktivitas user, jejak user

## Join Hints Utama

### user_role_access_flow

```sql
m0_user.userid = m0_user_role.userid
m0_user_role.role = m0_role.rkode
```

### role_menu_access_flow

```sql
m0_role.rkode = m0_role_menu.rmrole
m0_role_menu.rmmoduleid = m0_menu.mnmoduleid
m0_role_menu.rmmenuid = m0_menu.mnid
```

### user_menu_override_flow

```sql
m0_user.userid = m0_usermenu.umuserid
m0_usermenu.ummoduleid = m0_menu.mnmoduleid
m0_usermenu.ummenuid = m0_menu.mnid
```

### role_report_access_flow

```sql
m0_role.rkode = m0_role_report.rrrole
m0_role_report.rrmoduleid = m0_report.rmoduleid
m0_role_report.rrmenuid = m0_report.rmenuid
```

### user_report_override_flow

```sql
m0_user.userid = m0_userreport.uruserid
m0_userreport.urmoduleid = m0_report.rmoduleid
m0_userreport.urmenuid = m0_report.rmenuid
```

### menu_translation_flow

```sql
m0_menu.mnmoduleid = m0_menu_lang.mnlmoduleid
m0_menu.mnid = m0_menu_lang.mnlmnid
```

### setting_translation_flow

```sql
m0_setting.smodule = m0_setting_lang.slmodule
m0_setting.sgrup = m0_setting_lang.slgrup
m0_setting.skode = m0_setting_lang.slkode
```

### notification_user_flow

```sql
m0_notifikasi_email.userid = m0_user.userid
m0_notifikasi_email.useridmail = m0_user.userid
m0_notifikasi_email.moduleid = m0_menu.mnmoduleid
m0_notifikasi_email.menuid = m0_menu.mnid
```

### userlog_activity_flow

```sql
m0_userlog.uluserid = m0_user.userid
m0_userlog.ulidmodule = m0_menu.mnmoduleid
m0_userlog.ulidmenu = m0_menu.mnid
```

## Aturan Pemilihan Tabel

- Gunakan `m0_user`, `m0_role`, `m0_user_role`, `m0_role_menu`, `m0_usermenu` bila pertanyaan fokus pada siapa boleh mengakses apa.
- Gunakan `m0_menu` dan `m0_menu_lang` bila pertanyaan fokus pada struktur navigasi atau label menu per bahasa.
- Gunakan `m0_report`, `m0_report_filter`, `m0_report_lang`, `m0_role_report`, `m0_userreport` bila pertanyaan fokus pada report dan hak akses report.
- Gunakan `m0_setting`, `m0_setting_lang`, `m0_setting_location` bila pertanyaan fokus pada parameter sistem.
- Gunakan `m0_nomor` dan `m0_nomor_next` bila pertanyaan fokus pada format nomor dokumen atau counter berikutnya.
- Gunakan `m0_userlogin`, `m0_userlog`, `m0_userlogerror` bila pertanyaan fokus pada login, audit trail, atau error log.
- Gunakan `m0_msmq*` bila pertanyaan fokus pada queue background, progress, import, COGS, atau journal task.
- Gunakan tabel yang mengandung `custom`, `override`, atau `_s` hanya jika pertanyaan memang spesifik ke varian atau override akses.

## Aturan Penting

- M0 mengandung banyak write-path administrasi. Untuk NL2SQL readonly, hindari menghasilkan `INSERT`, `UPDATE`, atau `DELETE`.
- Jika user meminta “hak akses”, tentukan dulu apakah levelnya role-based atau user override.
- Jika user meminta “menu yang muncul”, prioritaskan join antara user/role/menu dan jangan hanya membaca `m0_menu` sendiri.
- Jika user meminta “setting”, cek apakah konteksnya global, lokasi, atau terjemahan setting.
- Jika user meminta “audit”, bedakan aktivitas normal (`m0_userlog`) dan error (`m0_userlogerror`).
- Field seperti password, secret, dan kredensial sensitif hanya boleh dipakai untuk audit struktur, bukan ditampilkan apa adanya.
- Tabel temporary/queue seperti `m0_report_temp` atau `m0_msmq*` lebih cocok untuk monitoring operasional daripada source of truth bisnis.

## Pola Query Aman

### role_access_summary

Gunakan `m0_role`, `m0_role_menu`, `m0_menu` untuk melihat menu yang dibuka oleh suatu role.

### user_access_override

Gunakan `m0_user`, `m0_user_role`, `m0_usermenu`, `m0_userreport` untuk override akses user tertentu.

### report_catalog

Gunakan `m0_report` dan `m0_report_filter` untuk katalog report dan parameter filternya.

### setting_lookup

Gunakan `m0_setting` dan `m0_setting_lang` untuk lookup setting dan label-nya.

### audit_login_trace

Gunakan `m0_userlogin`, `m0_userlog`, dan `m0_userlogerror` untuk audit login dan aktivitas.

## Query yang Perlu Extra Caution

- Pertanyaan yang berpotensi menampilkan password, secret, atau kredensial email pengirim.
- Pertanyaan yang meminta perubahan setting atau permission; M0 penuh write-path dan harus tetap readonly.
- Pertanyaan yang mencampur role access dan user override tanpa membedakan keduanya.
- Pertanyaan report yang sebenarnya menyentuh SQL mentah di metadata report.
- Pertanyaan background queue yang memakai tabel operasional sementara sebagai source of truth.

## Checklist NL2SQL M0

- pastikan query readonly
- pilih area dulu: user, role, menu, report, setting, numbering, queue, atau audit
- cek apakah kebutuhan akses bersifat role-based atau user-specific override
- pakai table translation/lang hanya bila user butuh label multibahasa
- jangan expose kolom sensitif secara langsung
- untuk monitoring proses gunakan tabel queue/log, bukan asumsi dari master saja
