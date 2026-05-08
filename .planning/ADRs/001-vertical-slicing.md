# ADR 001: Vertical Slicing per Feature (DB → API → UI → Test)

**Status**: Accepted
**Date**: 2026-05-08
**Deciders**: User + Claude Code

## Context

Project Althea Psychology mencakup banyak sisi: schema design, NestJS modules, Next.js UI, WA integration, testing. Risk untuk Claude Code:
- Context window terbatas → drift dari keputusan awal
- Susah resume kalau session restart
- Scope creep ke fitur tetangga
- Quality degradation late-stage

## Decision

Build per **vertical slice** = 1 fitur lengkap end-to-end (schema → endpoints → UI → tests), bukan per layer (semua DB → semua API → semua UI).

Tiap slice:
- Closeable & demoable
- 1-3 Claude Code sessions
- Failure scope contained
- Persistent artifacts di `.planning/phases/<slice>/`

## Consequences

### Positive
- Tiap slice deliver value langsung (demoable per slice)
- Failure di 1 slice tidak block slice lain (independent)
- Mudah resume cross-session (artifact-based)
- Quality gates per slice bukan akhir project
- Parallelizable (multi worktree per slice)

### Negative
- Schema migration 1 per slice = lebih banyak file migration (vs. 1 big-bang)
- Rework risk kalau slice awal salah pattern (mitigasi: Slice 0 establish pattern)
- Setup overhead per slice (mitigasi: GSD framework + reference templates)

## Alternatives Considered

- **Horizontal layer**: semua DB dulu → semua API → semua UI. **Rejected** — risk drift tinggi, testing terlalu jauh, integration painful.
- **Monolithic**: 1 big PR untuk semua. **Rejected** — context terlalu besar, review tidak feasible, rollback granular impossible.

## Reference

`~/.claude/plans/mau-tanya-untuk-pembuatan-toasty-riddle.md` (full strategy plan)
