# M0 NL2SQL Guide

Primary sources:
- `semantic-schema-m0.json`
- `semantic-schema-m0-summary.md`
- `m0-queries.md`
- `m0-queries-by-type.md`

Purpose:
- help select the correct administrator tables
- distinguish read-only lookup areas from write-path administration tables
- provide natural business synonyms for retrieval
- mark safe joins for user, role, menu, report, setting, numbering, queue, and audit use cases

## Main Table Coverage

- application and integration: `m0_app`
- backup and maintenance: `m0_backup`, `m0_hapusdata`, `m0_hitungulang_log`, `m0_hppaverage`, `m0_hppsaldo`, `m0_validitas_data`
- UI form configuration: `m0_form_custom_text`, `m0_form_setting_global`, `m0_form_setting_search`, `m0_form_setting_user`
- language and translation resources: `m0_language`, `m0_language_detail`, `m0_sentence`, `m0_sentence_s`, `m0_sentence_translate`, `m0_sentence_stranslate`, `m0_translate`
- menu and module metadata: `m0_module`, `m0_menu`, `m0_menu_lang`, `m0_menu_s`, `m0_menu_s_lang`
- background queue and MSMQ: `m0_msmq`, `m0_msmq_cogs`, `m0_msmq_importdata`, `m0_msmq_journal`
- document numbering: `m0_nomor`, `m0_nomor_next`, `m0_nomor_mobile`, `m0_barcode_next`, `m0_group_aq`, `m0_group_rq`
- attachments and notes: `m0_files`, `m0_notes`
- notifications: `m0_notifikasi_email`
- reports and report metadata: `m0_report`, `m0_report_filter`, `m0_report_label`, `m0_report_label_translate`, `m0_report_lang`, `m0_report_temp`
- roles and permissions: `m0_role`, `m0_role_s`, `m0_role_custom`, `m0_role_item_category`, `m0_role_menu`, `m0_role_menu_s`, `m0_role_report`, `m0_role_report_s`, ...
- lookup and business settings: `m0_search_packet`, `m0_selling_rate`, `m0_setting`, `m0_setting_lang`, `m0_setting_location`, `m0_payment_method`, `m0_jenismutasi`, `m0_status`, ...
- users, groups, access, sessions, and audit: `m0_user`, `m0_user_branch`, `m0_user_coa`, `m0_user_location`, `m0_user_role`, `m0_user_role_s`, `m0_user_warehouse`, `m0_usercustom`, ...

## Business Synonyms

- `USER`: user, account, login account
- `ROLE`: role, access right, permission
- `MENU`: menu, navigation, sidebar
- `REPORT`: report, report template
- `SETTING`: setting, configuration, system parameter
- `NUMBERING`: document number, auto numbering, running number
- `QUEUE`: background queue, process queue, MSMQ
- `LANGUAGE`: language, translation, UI translation
- `NOTIFICATION`: email notification
- `USERLOG`: audit log, user activity, user trace

## Primary Join Hints

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

## Table Selection Rules

- Use `m0_user`, `m0_role`, `m0_user_role`, `m0_role_menu`, and `m0_usermenu` when the question is about who can access what.
- Use `m0_menu` and `m0_menu_lang` when the question is about navigation structure or translated menu labels.
- Use `m0_report`, `m0_report_filter`, `m0_report_lang`, `m0_role_report`, and `m0_userreport` when the question is about reports and report access.
- Use `m0_setting`, `m0_setting_lang`, and `m0_setting_location` when the question is about system parameters.
- Use `m0_nomor` and `m0_nomor_next` when the question is about document-number format or the next counter.
- Use `m0_userlogin`, `m0_userlog`, and `m0_userlogerror` when the question is about login, audit trail, or error logs.
- Use `m0_msmq*` when the question is about background queues, progress, imports, COGS, or journal tasks.
- Use tables containing `custom`, `override`, or `_s` only when the request is explicitly about variants or override access.

## Important Rules

- M0 contains many administration write paths. For NL2SQL, avoid generating `INSERT`, `UPDATE`, or `DELETE`.
- If the user asks about access rights, determine whether the answer is role-based or user-specific override first.
- If the user asks which menus appear, prioritize joins across user, role, and menu instead of reading `m0_menu` alone.
- If the user asks about settings, check whether the context is global, location-specific, or translated labels.
- If the user asks about audit, distinguish normal activity (`m0_userlog`) from errors (`m0_userlogerror`).
- Sensitive fields such as passwords, secrets, and sender credentials may be inspected structurally but should not be exposed directly.
- Temporary or queue tables such as `m0_report_temp` or `m0_msmq*` are better suited for operational monitoring than for business truth.

## Safe Query Patterns

### role_access_summary

Use `m0_role`, `m0_role_menu`, and `m0_menu` to see which menus are available to a role.

### user_access_override

Use `m0_user`, `m0_user_role`, `m0_usermenu`, and `m0_userreport` for user-specific access overrides.

### report_catalog

Use `m0_report` and `m0_report_filter` for report catalogs and filter parameters.

### setting_lookup

Use `m0_setting` and `m0_setting_lang` for settings and translated labels.

### audit_login_trace

Use `m0_userlogin`, `m0_userlog`, and `m0_userlogerror` for login and activity audit.

## Queries That Need Extra Caution

- Questions that could expose passwords, secrets, or sender email credentials.
- Questions that imply changing settings or permissions. M0 is write-heavy and must remain read-only here.
- Questions that mix role access with user overrides without separating the two models.
- Report questions that actually touch raw SQL stored in report metadata.
- Background-queue questions that treat temporary operational tables as the business source of truth.

## NL2SQL Checklist for M0

- ensure the query stays read-only
- choose the area first: user, role, menu, report, setting, numbering, queue, or audit
- check whether access needs are role-based or user-specific overrides
- use translation and language tables only when the user needs multilingual labels
- do not expose sensitive columns directly
- for process monitoring, use queue and log tables instead of relying on master data alone
