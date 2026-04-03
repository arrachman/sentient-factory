# Semantic Schema M0 Summary

Sumber schema: `semantic-schema-m0.json`
Sumber query: `m0-queries.md`, `m0-queries-by-type.md`

Total tabel M0 di schema: **79**
Total tabel M0 terdeteksi di query aktif: **79**
Total query SELECT: **626** | INSERT: **79** | UPDATE: **52** | DELETE: **75**

Dokumen ini merangkum tabel administrator yang aktif dari query source, fokus pada konfigurasi sistem, user-access, report, numbering, translation, dan background queue.

## Join Hints

- `user_role_access_flow`
  `m0_user.userid = m0_user_role.userid`
  `m0_user_role.role = m0_role.rkode`
- `role_menu_access_flow`
  `m0_role.rkode = m0_role_menu.rmrole`
  `m0_role_menu.rmmoduleid = m0_menu.mnmoduleid`
  `m0_role_menu.rmmenuid = m0_menu.mnid`
- `user_menu_override_flow`
  `m0_user.userid = m0_usermenu.umuserid`
  `m0_usermenu.ummoduleid = m0_menu.mnmoduleid`
  `m0_usermenu.ummenuid = m0_menu.mnid`
- `role_report_access_flow`
  `m0_role.rkode = m0_role_report.rrrole`
  `m0_role_report.rrmoduleid = m0_report.rmoduleid`
  `m0_role_report.rrmenuid = m0_report.rmenuid`
- `user_report_override_flow`
  `m0_user.userid = m0_userreport.uruserid`
  `m0_userreport.urmoduleid = m0_report.rmoduleid`
  `m0_userreport.urmenuid = m0_report.rmenuid`
- `menu_translation_flow`
  `m0_menu.mnmoduleid = m0_menu_lang.mnlmoduleid`
  `m0_menu.mnid = m0_menu_lang.mnlmnid`
- `setting_translation_flow`
  `m0_setting.smodule = m0_setting_lang.slmodule`
  `m0_setting.sgrup = m0_setting_lang.slgrup`
  `m0_setting.skode = m0_setting_lang.slkode`
- `notification_user_flow`
  `m0_notifikasi_email.userid = m0_user.userid`
  `m0_notifikasi_email.useridmail = m0_user.userid`
  `m0_notifikasi_email.moduleid = m0_menu.mnmoduleid`
  `m0_notifikasi_email.menuid = m0_menu.mnid`
- `userlog_activity_flow`
  `m0_userlog.uluserid = m0_user.userid`
  `m0_userlog.ulidmodule = m0_menu.mnmoduleid`
  `m0_userlog.ulidmenu = m0_menu.mnid`

## Ringkasan Area

- **APP**: Aplikasi dan integrasi | tabel: 1
- **BACKUP**: Backup dan maintenance | tabel: 6
- **FORM**: Konfigurasi form UI | tabel: 4
- **LANGUAGE**: Bahasa dan translation resource | tabel: 7
- **MENU**: Menu dan modul | tabel: 5
- **QUEUE**: Background queue / MSMQ | tabel: 4
- **NUMBERING**: Penomoran dokumen | tabel: 6
- **NOTES_FILES**: Lampiran dan notes | tabel: 2
- **NOTIFICATION**: Notifikasi | tabel: 1
- **REPORT**: Report dan metadata report | tabel: 6
- **ROLE**: Role dan permission | tabel: 9
- **SEARCH_SETTING**: Lookup dan setting bisnis | tabel: 12
- **USER**: User, group, akses, session, dan audit | tabel: 16

## APP - Aplikasi dan integrasi

### Tabel

- `m0_app` | alias: `administrator_app` | kolom: 6
  Master aplikasi atau client integration key/secret.

### Kolom Penting

- `appactive`: Kolom bisnis appactive.
- `appcreated`: Kolom bisnis appcreated.
- `appid`: Identitas unik data atau relasi ke tabel lain.
- `appkey`: Kode bisnis, key, atau identifier konfigurasi.
- `appname`: Nama atau label bisnis yang ditampilkan ke user.

## BACKUP - Backup dan maintenance

### Tabel

- `m0_backup` | alias: `administrator_backup` | kolom: 5
  Log dan status proses backup.
- `m0_hapusdata` | alias: `administrator_hapusdata` | kolom: 0
  Log atau target data yang ditandai untuk proses penghapusan/cleanup.
- `m0_hitungulang_log` | alias: `administrator_hitungulang_log` | kolom: 0
  Log proses hitung ulang data, saldo, atau kalkulasi sistem.
- `m0_hppaverage` | alias: `administrator_hppaverage` | kolom: 0
  Tabel kerja/perantara untuk proses hitung HPP average.
- `m0_hppsaldo` | alias: `administrator_hppsaldo` | kolom: 0
  Tabel kerja/perantara untuk saldo HPP atau rekalkulasi persediaan.
- `m0_validitas_data` | alias: `administrator_validitas_data` | kolom: 6
  Status validitas atau hasil pengecekan data periodik.

### Kolom Penting

- `bulan`: Kolom bisnis bulan.
- `keterangan`: Catatan atau keterangan tambahan.
- `kode`: Kode bisnis, key, atau identifier konfigurasi.
- `status`: Status proses, status dokumen, atau status konfigurasi.
- `tahun`: Kolom bisnis tahun.
- `id`: Identitas unik data atau relasi ke tabel lain.
- `namafile`: Nama atau label bisnis yang ditampilkan ke user.
- `tglmulai`: Tanggal atau waktu terkait proses bisnis/sistem.

## FORM - Konfigurasi form UI

### Tabel

- `m0_form_custom_text` | alias: `administrator_form_custom_text` | kolom: 6
  Konfigurasi custom text per modul dan menu untuk label/form UI.
- `m0_form_setting_global` | alias: `administrator_form_setting_global` | kolom: 3
  Konfigurasi tampilan form global per modul dan menu.
- `m0_form_setting_search` | alias: `administrator_form_setting_search` | kolom: 5
  Konfigurasi field pencarian dan properti search form per modul/menu.
- `m0_form_setting_user` | alias: `administrator_form_setting_user` | kolom: 4
  Konfigurasi preferensi form per user pada modul/menu tertentu.

### Kolom Penting

- `customdetailen`: Kolom bisnis customdetailen.
- `customdetailin`: Kolom bisnis customdetailin.
- `customutamaen`: Kolom bisnis customutamaen.
- `customutamain`: Kolom bisnis customutamain.
- `menu`: Referensi menu atau struktur navigasi aplikasi.
- `kode`: Kode bisnis, key, atau identifier konfigurasi.
- `module`: Referensi modul aplikasi.
- `nama`: Nama atau label bisnis yang ditampilkan ke user.
- `searchsetting`: Kolom bisnis searchsetting.
- `formsetting`: Kolom bisnis formsetting.
- `user`: Referensi user atau identitas pengguna aplikasi.

## LANGUAGE - Bahasa dan translation resource

### Tabel

- `m0_language` | alias: `administrator_language` | kolom: 4
  Master bahasa aplikasi.
- `m0_language_detail` | alias: `administrator_language_detail` | kolom: 0
  Detail resource bahasa atau pasangan key-translation per bahasa.
- `m0_sentence` | alias: `administrator_sentence` | kolom: 3
  Master kalimat atau text resource aplikasi.
- `m0_sentence_s` | alias: `administrator_sentence_s` | kolom: 3
  Varian sentence/text resource untuk scope tertentu.
- `m0_sentence_translate` | alias: `administrator_sentence_translate` | kolom: 0
  Terjemahan sentence/text resource utama per bahasa.
- `m0_sentence_stranslate` | alias: `administrator_sentence_stranslate` | kolom: 4
  Terjemahan sentence varian per bahasa.
- `m0_translate` | alias: `administrator_translate` | kolom: 3
  Dictionary terjemahan teks umum aplikasi.

### Kolom Penting

- `laktif`: Penanda aktif/nonaktif atau flag kondisi sistem.
- `lgambar`: Kolom bisnis lgambar.
- `lkode`: Kode bisnis, key, atau identifier konfigurasi.
- `lnama`: Nama atau label bisnis yang ditampilkan ke user.
- `stid`: Identitas unik data atau relasi ke tabel lain.
- `stlanguage`: Kode bahasa atau preferensi bahasa.
- `stsentence`: Kolom bisnis stsentence.
- `sttranslate`: Kolom bisnis sttranslate.
- `sid`: Identitas unik data atau relasi ke tabel lain.
- `sjenis`: Kolom bisnis sjenis.
- `ssentence`: Kolom bisnis ssentence.

## MENU - Menu dan modul

### Tabel

- `m0_module` | alias: `administrator_module` | kolom: 0
  Master modul aplikasi MyERPPlus.
- `m0_menu` | alias: `administrator_menu` | kolom: 14
  Master menu aplikasi dan struktur navigasi.
- `m0_menu_lang` | alias: `administrator_menu_lang` | kolom: 4
  Terjemahan nama menu per bahasa.
- `m0_menu_s` | alias: `administrator_menu_s` | kolom: 0
  Varian atau struktur menu tambahan untuk mode/scope khusus sistem.
- `m0_menu_s_lang` | alias: `administrator_menu_s_lang` | kolom: 4
  Terjemahan menu varian `m0_menu_s` per bahasa.

### Kolom Penting

- `mnactive`: Kolom bisnis mnactive.
- `mnid`: Identitas unik data atau relasi ke tabel lain.
- `mnidtransaksi`: Kolom bisnis mnidtransaksi.
- `mnlebar`: Kolom bisnis mnlebar.
- `mnlevel`: Kolom bisnis mnlevel.
- `mnllanguage`: Kode bahasa atau preferensi bahasa.
- `mnlmnid`: Identitas unik data atau relasi ke tabel lain.
- `mnlmoduleid`: Identitas unik data atau relasi ke tabel lain.
- `mnltranslate`: Kolom bisnis mnltranslate.

## QUEUE - Background queue / MSMQ

### Tabel

- `m0_msmq` | alias: `administrator_msmq` | kolom: 24
  Antrian proses background berbasis MSMQ untuk report, print, export, atau task sistem.
- `m0_msmq_cogs` | alias: `administrator_msmq_cogs` | kolom: 8
  Antrian proses background khusus kalkulasi COGS/HPP.
- `m0_msmq_importdata` | alias: `administrator_msmq_importdata` | kolom: 10
  Antrian proses background untuk import data.
- `m0_msmq_journal` | alias: `administrator_msmq_journal` | kolom: 8
  Antrian proses background untuk pembentukan atau posting journal.

### Kolom Penting

- `fileformat`: Kolom bisnis fileformat.
- `filename`: Nama atau label bisnis yang ditampilkan ke user.
- `filter`: Kolom bisnis filter.
- `groupby`: Kolom bisnis groupby.
- `id`: Identitas unik data atau relasi ke tabel lain.
- `miid`: Identitas unik data atau relasi ke tabel lain.
- `minamafile`: Nama atau label bisnis yang ditampilkan ke user.
- `mipaket`: Kolom bisnis mipaket.
- `mipesan`: Kolom bisnis mipesan.
- `miprogress`: Kolom bisnis miprogress.
- `mcid`: Identitas unik data atau relasi ke tabel lain.
- `mcidtransaksi`: Kolom bisnis mcidtransaksi.

## NUMBERING - Penomoran dokumen

### Tabel

- `m0_nomor` | alias: `administrator_nomor` | kolom: 9
  Pengaturan penomoran dokumen/transaksi.
- `m0_nomor_next` | alias: `administrator_nomor_next` | kolom: 6
  Counter nomor dokumen berikutnya per tabel, cabang, lokasi, bulan, dan tahun.
- `m0_nomor_mobile` | alias: `administrator_nomor_mobile` | kolom: 2
  Pemetaan user ke identitas device/mobile untuk penomoran atau akses mobile.
- `m0_barcode_next` | alias: `administrator_barcode_next` | kolom: 0
  Counter nomor barcode berikutnya untuk proses generate barcode internal.
- `m0_group_aq` | alias: `administrator_group_aq` | kolom: 5
  Counter nomor grup AQ per cabang, lokasi, bulan, dan tahun.
- `m0_group_rq` | alias: `administrator_group_rq` | kolom: 5
  Counter nomor grup RQ per cabang, lokasi, bulan, dan tahun.

### Kolom Penting

- `awalan`: Kolom bisnis awalan.
- `jmldigit`: Kolom bisnis jmldigit.
- `kodetabel`: Kode bisnis, key, atau identifier konfigurasi.
- `menuid`: Identitas unik data atau relasi ke tabel lain.
- `moduleid`: Identitas unik data atau relasi ke tabel lain.
- `bulan`: Kolom bisnis bulan.
- `cabang`: Kolom bisnis cabang.
- `lokasi`: Kolom bisnis lokasi.
- `noberikutnya`: Kolom bisnis noberikutnya.
- `tahun`: Kolom bisnis tahun.

## NOTES_FILES - Lampiran dan notes

### Tabel

- `m0_files` | alias: `administrator_files` | kolom: 7
  Lampiran/file attachment modul administrator.
- `m0_notes` | alias: `administrator_notes` | kolom: 3
  Catatan bebas atau note tambahan pada transaksi/konfigurasi administrator.

### Kolom Penting

- `fcatatan`: Catatan atau keterangan tambahan.
- `fidtransaksi`: Kolom bisnis fidtransaksi.
- `fnamafile`: Nama atau label bisnis yang ditampilkan ke user.
- `fsumber`: Kolom bisnis fsumber.
- `ftanggal`: Kolom bisnis ftanggal.
- `ncatatan`: Catatan atau keterangan tambahan.
- `nidtransaksi`: Kolom bisnis nidtransaksi.
- `nsumber`: Kolom bisnis nsumber.

## NOTIFICATION - Notifikasi

### Tabel

- `m0_notifikasi_email` | alias: `administrator_notifikasi_email` | kolom: 10
  Pengaturan notifikasi email per modul/menu/user.

### Kolom Penting

- `email`: Alamat email atau identitas email terkait notifikasi.
- `emailpengirim`: Alamat email atau identitas email terkait notifikasi.
- `menuid`: Identitas unik data atau relasi ke tabel lain.
- `moduleid`: Identitas unik data atau relasi ke tabel lain.
- `namamenu`: Referensi menu atau struktur navigasi aplikasi.

## REPORT - Report dan metadata report

### Tabel

- `m0_report` | alias: `administrator_report` | kolom: 27
  Definisi report, template, dan metadata laporan.
- `m0_report_filter` | alias: `administrator_report_filter` | kolom: 17
  Definisi filter input untuk report builder atau runtime report.
- `m0_report_label` | alias: `administrator_report_label` | kolom: 0
  Master label/teks tampilan pada report.
- `m0_report_label_translate` | alias: `administrator_report_label_translate` | kolom: 4
  Terjemahan label report per bahasa.
- `m0_report_lang` | alias: `administrator_report_lang` | kolom: 7
  Terjemahan nama report dan judul report per bahasa.
- `m0_report_temp` | alias: `administrator_report_temp` | kolom: 0
  Tabel sementara/kerja untuk proses report.

### Kolom Penting

- `raktif`: Penanda aktif/nonaktif atau flag kondisi sistem.
- `rcetak`: Kolom bisnis rcetak.
- `rdata`: Kolom bisnis rdata.
- `rdefault`: Kolom bisnis rdefault.
- `rfilename`: Nama atau label bisnis yang ditampilkan ke user.
- `fdatasource`: Kolom bisnis fdatasource.
- `ffield`: Kolom bisnis ffield.
- `fid`: Identitas unik data atau relasi ke tabel lain.
- `fitem`: Kolom bisnis fitem.
- `flabel`: Kolom bisnis flabel.
- `rllanguage`: Kode bahasa atau preferensi bahasa.
- `rlrid`: Identitas unik data atau relasi ke tabel lain.

## ROLE - Role dan permission

### Tabel

- `m0_role` | alias: `administrator_role` | kolom: 2
  Master role atau peran akses sistem.
- `m0_role_s` | alias: `administrator_role_s` | kolom: 2
  Varian role untuk scope atau mode akses tertentu.
- `m0_role_custom` | alias: `administrator_role_custom` | kolom: 4
  Override akses custom per role untuk permission spesifik.
- `m0_role_item_category` | alias: `administrator_role_item_category` | kolom: 2
  Mapping role ke kategori barang yang boleh diakses.
- `m0_role_menu` | alias: `administrator_role_menu` | kolom: 5
  Mapping role ke menu dan hak akses navigasi.
- `m0_role_menu_s` | alias: `administrator_role_menu_s` | kolom: 5
  Mapping role ke menu varian/scope khusus.
- `m0_role_report` | alias: `administrator_role_report` | kolom: 5
  Mapping role ke report dan hak akses report.
- `m0_role_report_s` | alias: `administrator_role_report_s` | kolom: 5
  Mapping role ke report varian/scope khusus.
- `m0_permissions_custom` | alias: `administrator_permissions_custom` | kolom: 0
  Override permission granular di luar mapping role standar.

### Kolom Penting

- `rmakses`: Kolom bisnis rmakses.
- `rmfavourite`: Kolom bisnis rmfavourite.
- `rmmenuid`: Identitas unik data atau relasi ke tabel lain.
- `rmmoduleid`: Identitas unik data atau relasi ke tabel lain.
- `rmrole`: Referensi role atau peran akses.
- `rmid`: Identitas unik data atau relasi ke tabel lain.
- `rrakses`: Kolom bisnis rrakses.
- `rritem`: Kolom bisnis rritem.
- `rrmenuid`: Identitas unik data atau relasi ke tabel lain.
- `rrmoduleid`: Identitas unik data atau relasi ke tabel lain.
- `rrrole`: Referensi role atau peran akses.

## SEARCH_SETTING - Lookup dan setting bisnis

### Tabel

- `m0_search_packet` | alias: `administrator_search_packet` | kolom: 4
  Paket definisi search/filter reusable untuk lookup sistem.
- `m0_selling_rate` | alias: `administrator_selling_rate` | kolom: 2
  Master tingkat harga jual atau selling rate.
- `m0_setting` | alias: `administrator_setting` | kolom: 10
  Parameter dan konfigurasi global sistem.
- `m0_setting_lang` | alias: `administrator_setting_lang` | kolom: 5
  Terjemahan setting atau label setting per bahasa.
- `m0_setting_location` | alias: `administrator_setting_location` | kolom: 0
  Override setting berdasarkan lokasi operasional.
- `m0_payment_method` | alias: `administrator_payment_method` | kolom: 0
  Master metode pembayaran yang dipakai lintas modul.
- `m0_jenismutasi` | alias: `administrator_jenismutasi` | kolom: 0
  Master jenis mutasi/transaksi yang dipakai sistem sebagai referensi proses.
- `m0_status` | alias: `administrator_status` | kolom: 0
  Master status umum yang dipakai lintas dokumen/modul.
- `m0_status_giro` | alias: `administrator_status_giro` | kolom: 0
  Master status khusus giro atau alat bayar giro.
- `m0_status_progress` | alias: `administrator_status_progress` | kolom: 0
  Master status progress untuk proses/background task.
- `m0_status_rq` | alias: `administrator_status_rq` | kolom: 0
  Master status khusus workflow request quotation atau request terkait.
- `m0_table_relation` | alias: `administrator_table_relation` | kolom: 0
  Metadata relasi tabel untuk helper query, import, atau validasi.

### Kolom Penting

- `scombodata`: Kolom bisnis scombodata.
- `sgrup`: Kolom bisnis sgrup.
- `sjenisinputan`: Kolom bisnis sjenisinputan.
- `skode`: Kode bisnis, key, atau identifier konfigurasi.
- `smodule`: Referensi modul aplikasi.
- `slgrup`: Kolom bisnis slgrup.
- `slkode`: Kode bisnis, key, atau identifier konfigurasi.
- `sllanguage`: Kode bahasa atau preferensi bahasa.
- `slmodule`: Referensi modul aplikasi.
- `sltranslate`: Kolom bisnis sltranslate.
- `spfilter`: Kolom bisnis spfilter.
- `spfilterby`: Kolom bisnis spfilterby.

## USER - User, group, akses, session, dan audit

### Tabel

- `m0_user` | alias: `administrator_user` | kolom: 16
  Master user aplikasi, identitas login, profil, dan pengaturan akses pengguna.
- `m0_user_branch` | alias: `administrator_user_branch` | kolom: 2
  Mapping user ke cabang yang boleh diakses.
- `m0_user_coa` | alias: `administrator_user_coa` | kolom: 2
  Mapping user ke rekening/COA yang boleh diakses.
- `m0_user_location` | alias: `administrator_user_location` | kolom: 2
  Mapping user ke lokasi yang boleh diakses.
- `m0_user_role` | alias: `administrator_user_role` | kolom: 2
  Mapping user ke role akses.
- `m0_user_role_s` | alias: `administrator_user_role_s` | kolom: 2
  Mapping user ke role varian/scope khusus.
- `m0_user_warehouse` | alias: `administrator_user_warehouse` | kolom: 2
  Mapping user ke gudang yang boleh diakses.
- `m0_usercustom` | alias: `administrator_usercustom` | kolom: 4
  Override akses custom per user di luar role standar.
- `m0_usergrup` | alias: `administrator_usergrup` | kolom: 2
  Master grup user.
- `m0_usergrupmenu` | alias: `administrator_usergrupmenu` | kolom: 4
  Mapping grup user ke menu dan hak akses.
- `m0_userlogin` | alias: `administrator_userlogin` | kolom: 1
  Session atau jejak login user.
- `m0_userlog` | alias: `administrator_userlog` | kolom: 7
  Audit log aktivitas user.
- `m0_userlog_category` | alias: `administrator_userlog_category` | kolom: 0
  Master kategori aktivitas untuk audit log user.
- `m0_userlogerror` | alias: `administrator_userlogerror` | kolom: 7
  Log error aplikasi yang dikaitkan ke user atau paket proses.
- `m0_usermenu` | alias: `administrator_usermenu` | kolom: 5
  Override akses menu langsung per user.
- `m0_userreport` | alias: `administrator_userreport` | kolom: 5
  Override akses report langsung per user.

### Kolom Penting

- `uaktif`: Penanda aktif/nonaktif atau flag kondisi sistem.
- `ubahasa`: Kode bahasa atau preferensi bahasa.
- `ucabang`: Kolom bisnis ucabang.
- `udefaultview`: Kolom bisnis udefaultview.
- `ugambar`: Kolom bisnis ugambar.
- `ulaktivitas`: Kolom bisnis ulaktivitas.
- `ulidmenu`: Referensi menu atau struktur navigasi aplikasi.
- `ulidmodule`: Referensi modul aplikasi.
- `uljenisaktivitas`: Kolom bisnis uljenisaktivitas.
- `ulkodepa`: Kode bisnis, key, atau identifier konfigurasi.
- `ulerrtodev`: Kolom bisnis ulerrtodev.
- `ulerrtouser`: Referensi user atau identitas pengguna aplikasi.

