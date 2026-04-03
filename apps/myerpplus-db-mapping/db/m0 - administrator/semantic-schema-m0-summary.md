# Semantic Schema M0 Summary

Schema source: `semantic-schema-m0.json`
Query source: `m0-queries.md`, `m0-queries-by-type.md`

Total M0 tables in schema: **79**
Total M0 tables detected in active queries: **79**
Total query SELECT: **626** | INSERT: **79** | UPDATE: **52** | DELETE: **75**

This document summarizes administrator tables active in query sources, with a focus on system configuration, user access, reports, numbering, translation, and background queues.

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

## Overview Area

- **APP**: Applications and integrations | tables: 1
- **BACKUP**: Backup and maintenance | tables: 6
- **FORM**: UI form configuration | tables: 4
- **LANGUAGE**: Language and translation resources | tables: 7
- **MENU**: Menus and modules | tables: 5
- **QUEUE**: Background queue / MSMQ | tables: 4
- **NUMBERING**: Document numbering | tables: 6
- **NOTES_FILES**: Attachments and notes | tables: 2
- **NOTIFICATION**: Notifications | tables: 1
- **REPORT**: Reports and report metadata | tables: 6
- **ROLE**: Roles and permissions | tables: 9
- **SEARCH_SETTING**: Lookups and business settings | tables: 12
- **USER**: Users, groups, access, sessions, and audit | tables: 16

## APP - Applications and Integrations

### Tables

- `m0_app` | alias: `administrator_app` | columns: 6
  Application master or client-integration key/secret store.

### Important Columns

- `appactive`: Business column appactive.
- `appcreated`: Business column appcreated.
- `appid`: Unique record identifier or relation to other tables.
- `appkey`: Business code, key, or configuration identifier.
- `appname`: Business name or label shown to the user.

## BACKUP - Backup and maintenance

### Tables

- `m0_backup` | alias: `administrator_backup` | columns: 5
  Backup-process log and status.
- `m0_hapusdata` | alias: `administrator_hapusdata` | columns: 0
  Log or target data marked for deletion or cleanup processes.
- `m0_hitungulang_log` | alias: `administrator_hitungulang_log` | columns: 0
  Log of data recalculation, balance recalculation, or system calculation processes.
- `m0_hppaverage` | alias: `administrator_hppaverage` | columns: 0
  Working/intermediate table for average-cost recalculation processes.
- `m0_hppsaldo` | alias: `administrator_hppsaldo` | columns: 0
  Working/intermediate table for inventory-cost balance or inventory recalculation processes.
- `m0_validitas_data` | alias: `administrator_validitas_data` | columns: 6
  Validity status or periodic data-check result.

### Important Columns

- `bulan`: Business column bulan.
- `keterangan`: Notes or additional description.
- `kode`: Business code, key, or configuration identifier.
- `status`: Process status, document status, or configuration status.
- `tahun`: Business column tahun.
- `id`: Unique record identifier or relation to other tables.
- `namafile`: Business name or label shown to the user.
- `tglmulai`: Date or time related to the business/system process.

## FORM - UI Form Configuration

### Tables

- `m0_form_custom_text` | alias: `administrator_form_custom_text` | columns: 6
  Custom text configuration per module and menu for labels and form UI.
- `m0_form_setting_global` | alias: `administrator_form_setting_global` | columns: 3
  Global form-display configuration per module and menu.
- `m0_form_setting_search` | alias: `administrator_form_setting_search` | columns: 5
  Search-field and search-form property configuration per module/menu.
- `m0_form_setting_user` | alias: `administrator_form_setting_user` | columns: 4
  Per-user form preference configuration for specific modules/menus.

### Important Columns

- `customdetailen`: Business column customdetailen.
- `customdetailin`: Business column customdetailin.
- `customutamaen`: Business column customutamaen.
- `customutamain`: Business column customutamain.
- `menu`: Menu reference or application navigation structure.
- `kode`: Business code, key, or configuration identifier.
- `module`: Application module reference.
- `nama`: Business name or label shown to the user.
- `searchsetting`: Business column searchsetting.
- `formsetting`: Business column formsetting.
- `user`: User reference or application user identity.

## LANGUAGE - Language and Translation Resources

### Tables

- `m0_language` | alias: `administrator_language` | columns: 4
  Application language master table.
- `m0_language_detail` | alias: `administrator_language_detail` | columns: 0
  Language-resource detail or key-translation pair per language.
- `m0_sentence` | alias: `administrator_sentence` | columns: 3
  Application sentence or text-resource master.
- `m0_sentence_s` | alias: `administrator_sentence_s` | columns: 3
  Sentence/text-resource variant for specific scopes.
- `m0_sentence_translate` | alias: `administrator_sentence_translate` | columns: 0
  Main sentence/text-resource translation per language.
- `m0_sentence_stranslate` | alias: `administrator_sentence_stranslate` | columns: 4
  Variant-sentence translation per language.
- `m0_translate` | alias: `administrator_translate` | columns: 3
  General application text-translation dictionary.

### Important Columns

- `laktif`: Active/inactive marker or system-state flag.
- `lgambar`: Business column lgambar.
- `lkode`: Business code, key, or configuration identifier.
- `lnama`: Business name or label shown to the user.
- `stid`: Unique record identifier or relation to other tables.
- `stlanguage`: Language code or language preference.
- `stsentence`: Business column stsentence.
- `sttranslate`: Business column sttranslate.
- `sid`: Unique record identifier or relation to other tables.
- `sjenis`: Business column sjenis.
- `ssentence`: Business column ssentence.

## MENU - Menu and Module

### Tables

- `m0_module` | alias: `administrator_module` | columns: 0
  MyERPPlus application-module master.
- `m0_menu` | alias: `administrator_menu` | columns: 14
  Application-menu master and navigation structure.
- `m0_menu_lang` | alias: `administrator_menu_lang` | columns: 4
  Menu-name translation per language.
- `m0_menu_s` | alias: `administrator_menu_s` | columns: 0
  Additional menu variant or menu structure for a specific system scope/mode.
- `m0_menu_s_lang` | alias: `administrator_menu_s_lang` | columns: 4
  Translation table for `m0_menu_s` menu variants.

### Important Columns

- `mnactive`: Business column mnactive.
- `mnid`: Unique record identifier or relation to other tables.
- `mnidtransaction`: Business column mnidtransaction.
- `mnlebar`: Business column mnlebar.
- `mnlevel`: Business column mnlevel.
- `mnllanguage`: Language code or language preference.
- `mnlmnid`: Unique record identifier or relation to other tables.
- `mnlmoduleid`: Unique record identifier or relation to other tables.
- `mnltranslate`: Business column mnltranslate.

## QUEUE - Background queue / MSMQ

### Tables

- `m0_msmq` | alias: `administrator_msmq` | columns: 24
  MSMQ-based background-process queue for reports, printing, exports, or system tasks.
- `m0_msmq_cogs` | alias: `administrator_msmq_cogs` | columns: 8
  Background-process queue dedicated to COGS or cost-of-goods recalculation.
- `m0_msmq_importdata` | alias: `administrator_msmq_importdata` | columns: 10
  Background-process queue for data imports.
- `m0_msmq_journal` | alias: `administrator_msmq_journal` | columns: 8
  Background-process queue for journal generation or journal posting.

### Important Columns

- `fileformat`: Business column fileformat.
- `filename`: Business name or label shown to the user.
- `filter`: Business column filter.
- `groupby`: Business column groupby.
- `id`: Unique record identifier or relation to other tables.
- `miid`: Unique record identifier or relation to other tables.
- `minamafile`: Business name or label shown to the user.
- `mipaket`: Business column mipaket.
- `mipesan`: Business column mipesan.
- `miprogress`: Business column miprogress.
- `mcid`: Unique record identifier or relation to other tables.
- `mcidtransaction`: Business column mcidtransaction.

## NUMBERING - Document Numbering

### Tables

- `m0_nomor` | alias: `administrator_nomor` | columns: 9
  Document or transaction numbering configuration.
- `m0_nomor_next` | alias: `administrator_nomor_next` | columns: 6
  Next document-number counter per table, branch, location, month, and year.
- `m0_nomor_mobile` | alias: `administrator_nomor_mobile` | columns: 2
  Mapping of users to device/mobile identities for numbering or mobile access.
- `m0_barcode_next` | alias: `administrator_barcode_next` | columns: 0
  Next barcode-number counter for internal barcode generation.
- `m0_group_aq` | alias: `administrator_group_aq` | columns: 5
  AQ group-number counter per branch, location, month, and year.
- `m0_group_rq` | alias: `administrator_group_rq` | columns: 5
  RQ group-number counter per branch, location, month, and year.

### Important Columns

- `awalan`: Business column awalan.
- `jmldigit`: Business column jmldigit.
- `kodetabel`: Business code, key, or configuration identifier.
- `menuid`: Unique record identifier or relation to other tables.
- `moduleid`: Unique record identifier or relation to other tables.
- `bulan`: Business column bulan.
- `cabang`: Business column cabang.
- `lokasi`: Business column lokasi.
- `noberikutnya`: Business column noberikutnya.
- `tahun`: Business column tahun.

## NOTES_FILES - Attachments and notes

### Tables

- `m0_files` | alias: `administrator_files` | columns: 7
  Attachment/file table for administrator modules.
- `m0_notes` | alias: `administrator_notes` | columns: 3
  Free-form notes on administrator transactions or administrator configuration.

### Important Columns

- `fnotes`: Notes or additional description.
- `fidtransaction`: Business column fidtransaction.
- `fnamafile`: Business name or label shown to the user.
- `fsumber`: Business column fsumber.
- `fdate`: Business column fdate.
- `nnotes`: Notes or additional description.
- `nidtransaction`: Business column nidtransaction.
- `nsumber`: Business column nsumber.

## NOTIFICATION - Notifications

### Tables

- `m0_notifikasi_email` | alias: `administrator_notifikasi_email` | columns: 10
  Email-notification settings per module/menu/user.

### Important Columns

- `email`: Email address or email identity used in notifications.
- `emailpengirim`: Sender email address or sender email identity.
- `menuid`: Unique record identifier or relation to other tables.
- `moduleid`: Unique record identifier or relation to other tables.
- `namamenu`: Menu reference or application navigation structure.

## REPORT - Reports and Report Metadata

### Tables

- `m0_report` | alias: `administrator_report` | columns: 27
  Report definition, template, and report metadata.
- `m0_report_filter` | alias: `administrator_report_filter` | columns: 17
  Input-filter definition for the report builder or runtime report.
- `m0_report_label` | alias: `administrator_report_label` | columns: 0
  Master table for labels/display text on reports.
- `m0_report_label_translate` | alias: `administrator_report_label_translate` | columns: 4
  Report-label translation per language.
- `m0_report_lang` | alias: `administrator_report_lang` | columns: 7
  Report-name and report-title translation per language.
- `m0_report_temp` | alias: `administrator_report_temp` | columns: 0
  Temporary/working table for report processes.

### Important Columns

- `raktif`: Active/inactive marker or system-state flag.
- `rcetak`: Business column rcetak.
- `rdata`: Business column rdata.
- `rdefault`: Business column rdefault.
- `rfilename`: Business name or label shown to the user.
- `fdatasource`: Business column fdatasource.
- `ffield`: Business column ffield.
- `fid`: Unique record identifier or relation to other tables.
- `fitem`: Business column fitem.
- `flabel`: Business column flabel.
- `rllanguage`: Language code or language preference.
- `rlrid`: Unique record identifier or relation to other tables.

## ROLE - Role and permission

### Tables

- `m0_role` | alias: `administrator_role` | columns: 2
  System role master or access-role master.
- `m0_role_s` | alias: `administrator_role_s` | columns: 2
  Role variant for specific access scopes or modes.
- `m0_role_custom` | alias: `administrator_role_custom` | columns: 4
  Custom access override per role for specific permissions.
- `m0_role_item_category` | alias: `administrator_role_item_category` | columns: 2
  Mapping of roles to accessible item categories.
- `m0_role_menu` | alias: `administrator_role_menu` | columns: 5
  Mapping of roles to menus and navigation access rights.
- `m0_role_menu_s` | alias: `administrator_role_menu_s` | columns: 5
  Mapping of roles to menu variants or special scopes.
- `m0_role_report` | alias: `administrator_role_report` | columns: 5
  Mapping of roles to reports and report-access rights.
- `m0_role_report_s` | alias: `administrator_role_report_s` | columns: 5
  Mapping of roles to report variants or special scopes.
- `m0_permissions_custom` | alias: `administrator_permissions_custom` | columns: 0
  Granular permission override outside standard role mappings.

### Important Columns

- `rmakses`: Business column rmakses.
- `rmfavourite`: Business column rmfavourite.
- `rmmenuid`: Unique record identifier or relation to other tables.
- `rmmoduleid`: Unique record identifier or relation to other tables.
- `rmrole`: Role reference or access-role assignment.
- `rmid`: Unique record identifier or relation to other tables.
- `rrakses`: Business column rrakses.
- `rritem`: Business column rritem.
- `rrmenuid`: Unique record identifier or relation to other tables.
- `rrmoduleid`: Unique record identifier or relation to other tables.
- `rrrole`: Role reference or access-role assignment.

## SEARCH_SETTING - Lookup and Business Settings

### Tables

- `m0_search_packet` | alias: `administrator_search_packet` | columns: 4
  Reusable search/filter definition package for system lookups.
- `m0_selling_rate` | alias: `administrator_selling_rate` | columns: 2
  Selling-rate or sales-price-level master table.
- `m0_setting` | alias: `administrator_setting` | columns: 10
  Global system parameters and configuration.
- `m0_setting_lang` | alias: `administrator_setting_lang` | columns: 5
  Setting translation or setting-label translation per language.
- `m0_setting_location` | alias: `administrator_setting_location` | columns: 0
  Setting override by operational location.
- `m0_payment_method` | alias: `administrator_payment_method` | columns: 0
  Payment-method master used across modules.
- `m0_jenismutasi` | alias: `administrator_jenismutasi` | columns: 0
  Transaction/mutation-type master used by the system as a process reference.
- `m0_status` | alias: `administrator_status` | columns: 0
  General-status master used across documents/modules.
- `m0_status_giro` | alias: `administrator_status_giro` | columns: 0
  Special-status master for giro or giro payment instruments.
- `m0_status_progress` | alias: `administrator_status_progress` | columns: 0
  Progress-status master for processes/background tasks.
- `m0_status_rq` | alias: `administrator_status_rq` | columns: 0
  Special-status master for request-quotation workflows or related requests.
- `m0_table_relation` | alias: `administrator_table_relation` | columns: 0
  Table-relation metadata for helper queries, imports, or validation.

### Important Columns

- `scombodata`: Business column scombodata.
- `sgrup`: Business column sgrup.
- `sjenisinputan`: Business column sjenisinputan.
- `skode`: Business code, key, or configuration identifier.
- `smodule`: Application module reference.
- `slgrup`: Business column slgrup.
- `slkode`: Business code, key, or configuration identifier.
- `sllanguage`: Language code or language preference.
- `slmodule`: Application module reference.
- `sltranslate`: Business column sltranslate.
- `spfilter`: Business column spfilter.
- `spfilterby`: Business column spfilterby.

## USER - User, Group, Access, Session, and Audit

### Tables

- `m0_user` | alias: `administrator_user` | columns: 16
  Application user master, including login identity, profile, and access settings.
- `m0_user_branch` | alias: `administrator_user_branch` | columns: 2
  Mapping of users to accessible branches.
- `m0_user_coa` | alias: `administrator_user_coa` | columns: 2
  Mapping of users to accessible accounts/COA.
- `m0_user_location` | alias: `administrator_user_location` | columns: 2
  Mapping of users to accessible locations.
- `m0_user_role` | alias: `administrator_user_role` | columns: 2
  Mapping of users to access roles.
- `m0_user_role_s` | alias: `administrator_user_role_s` | columns: 2
  Mapping of users to variant roles or special scopes.
- `m0_user_warehouse` | alias: `administrator_user_warehouse` | columns: 2
  Mapping of users to accessible warehouses.
- `m0_usercustom` | alias: `administrator_usercustom` | columns: 4
  Per-user custom access override outside standard roles.
- `m0_usergrup` | alias: `administrator_usergrup` | columns: 2
  User-group master table.
- `m0_usergrupmenu` | alias: `administrator_usergrupmenu` | columns: 4
  Mapping of user groups to menus and access rights.
- `m0_userlogin` | alias: `administrator_userlogin` | columns: 1
  User session or login trace.
- `m0_userlog` | alias: `administrator_userlog` | columns: 7
  User activity audit log.
- `m0_userlog_category` | alias: `administrator_userlog_category` | columns: 0
  Activity-category master for user audit logs.
- `m0_userlogerror` | alias: `administrator_userlogerror` | columns: 7
  Application error log linked to a user or process batch.
- `m0_usermenu` | alias: `administrator_usermenu` | columns: 5
  Direct menu-access override per user.
- `m0_userreport` | alias: `administrator_userreport` | columns: 5
  Direct report-access override per user.

### Important Columns

- `uaktif`: Active/inactive marker or system-state flag.
- `ubahasa`: Language code or language preference.
- `ucabang`: Business column ucabang.
- `udefaultview`: Business column udefaultview.
- `ugambar`: Business column ugambar.
- `ulaktivitas`: Business column ulaktivitas.
- `ulidmenu`: Menu reference or application navigation structure.
- `ulidmodule`: Application module reference.
- `uljenisaktivitas`: Business column uljenisaktivitas.
- `ulkodepa`: Business code, key, or configuration identifier.
- `ulerrtodev`: Business column ulerrtodev.
- `ulerrtouser`: User reference or application user identity.
