# B0007: Department Management Module

## Description

Manage organizational structure through departments.

## Acceptance Criteria

- [ ] Implement `DepartmentsController`.
- [ ] Support hierarchical structure (parent-child departments).
- [ ] **Get Hierarchy:** Endpoint to return tree structure of departments.
- [ ] **Assign User:** Endpoint to add users to departments.

## Technical Details

- Prisma self-relation on `Department` model (`parentId`).
- Recursive query or processing might be needed for tree structure.
