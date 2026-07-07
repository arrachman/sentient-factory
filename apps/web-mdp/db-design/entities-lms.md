# Web-MDP — LMS field catalog (`lms` domain)

> Status: **CATALOGUED + MIGRATED (2026-06-28).** Module: Training & Competency.
> Extends [README.md](README.md) + [module-roadmap.md](module-roadmap.md).

## Scope
Training courses, user enrollments, and a competency matrix (gates who may run
an operation). Cross-app refs (`adm_users`) = scalar BigInt. Intra-`lms` FKs
(course→enrollments, course→competencies via `requiredCourseId`) enforced.

## Enums
- `MdpLmsCourseCategory`: SAFETY · QUALITY · TECHNICAL · ONBOARDING · COMPLIANCE · OTHER
- `MdpLmsCourseStatus`: DRAFT · ACTIVE · ARCHIVED
- `MdpLmsEnrollmentStatus`: ENROLLED · IN_PROGRESS · COMPLETED · FAILED · EXPIRED

## Entities
- **`lms_courses`** (header) — `code`·`name`·`category?`·`status`·`description?`·
  `durationHours?`·`isMandatory`·`validityMonths?`·audit·soft-delete·metadata.
  Has `enrollments[]`, `competencies[]`.
- **`lms_enrollments`** (child) — `courseId`(@relation)·`userId`·`status`·
  `progressPct?`·`enrolledAt`·`completedAt?`·`score?`·`certificateCode?`·`expiresAt?`·
  notes·audit·soft-delete.
- **`lms_competencies`** (header) — `code`·`name`·`category?`·`description?`·
  `requiredCourseId?`(@relation→lms_courses)·`level?`·audit·soft-delete·metadata.

## Status
✅ Prisma `mdp-lms.prisma` (3 models + 3 enums) · migration `mdp_lms` (0 DROP) ·
backend `/api/mdp/lms/{courses,enrollments,competencies}` (401) · UI
`/app/training/*` (MasterCrudPage + LmsNav). FK fields = raw ID (functional slice).
