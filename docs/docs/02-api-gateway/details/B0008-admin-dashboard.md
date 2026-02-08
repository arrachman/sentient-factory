# B0008: Admin Dashboard Statistics

## Description

Provide aggregated data for the admin dashboard.

## Acceptance Criteria

- [ ] **Stats Endpoint:** `GET /api/admin/stats` returning:
  - Total users count.
  - Active users today.
  - Total factories/machines.
- [ ] **User Growth:** `GET /api/admin/user-growth` returning time-series data for registrations.
- [ ] Optimize queries for performance (count queries).

## Technical Details

- Use Prisma `count` and `groupBy`.
- Consider caching this endpoint if expensive.
