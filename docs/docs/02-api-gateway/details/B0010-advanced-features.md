# B0010: Advanced Features

## Description

Additional features for bulk operations and notifications.

## Acceptance Criteria

- [ ] **Bulk Import:** Upload CSV to create multiple users.
- [ ] **Search:** Implement fuzzy search for users.
- [ ] **Notifications:** Setup Email service (SMTP/SendGrid) for welcome emails and password resets.

## Technical Details

- `multer` for file upload handling.
- `@nestjs-modules/mailer` for email.
