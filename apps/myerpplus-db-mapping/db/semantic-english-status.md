# Semantic English Status

This checklist tracks which semantic artifacts are already English-first and which still remain partially bilingual.

Status labels:

- `complete`: English-first and clean enough for AI-agent-facing use.
- `partial`: Mostly English-first, but still contains bilingual long-tail descriptions or legacy wording.
- `pending`: Not yet reviewed in the final English-cleanup pass.

## Cross-Module

| Artifact | Status | Notes |
| --- | --- | --- |
| `semantic-cross-module-lineage.md` | `complete` | Main cross-module guidance is English-first. |
| `semantic-cross-module-lineage.json` | `complete` | Main machine-readable guidance is English-first. |

## M0 - Administrator

| Artifact | Status | Notes |
| --- | --- | --- |
| `m0 - administrator/semantic-schema-m0-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m0 - administrator/semantic-schema-m0-nl2sql.json` | `complete` | Agent-facing rules, patterns, and caution areas are now English-first. |
| `m0 - administrator/semantic-schema-m0-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m0 - administrator/semantic-schema-m0-summary.json` | `complete` | Summary JSON is English-first for titles, relations, and per-record descriptions. |

## M1 - Master Data

| Artifact | Status | Notes |
| --- | --- | --- |
| `m1-master data/semantic-schema-m1-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m1-master data/semantic-schema-m1-nl2sql.json` | `complete` | Agent-facing guidance, rules, and patterns are now English-first. |
| `m1-master data/semantic-schema-m1-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m1-master data/semantic-schema-m1-summary.json` | `complete` | Summary JSON is now English-first outside intentional local business terms. |

## M2 - Finance

| Artifact | Status | Notes |
| --- | --- | --- |
| `m2-finance/semantic-schema-m2-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m2-finance/semantic-schema-m2-nl2sql.json` | `complete` | Agent-facing rules and patterns cleaned. |
| `m2-finance/semantic-schema-m2-summary.md` | `complete` | Summary guidance and major body sections cleaned. |
| `m2-finance/semantic-schema-m2-summary.json` | `complete` | Summary JSON is English-first for finance flows, lineage usage, and history/payment descriptions. |

## M3 - Inventory

| Artifact | Status | Notes |
| --- | --- | --- |
| `m3-inventory/semantic-schema-m3-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m3-inventory/semantic-schema-m3-nl2sql.json` | `complete` | Agent-facing guidance is English-first; remaining Indonesian terms are intentional business synonyms. |
| `m3-inventory/semantic-schema-m3-summary.md` | `complete` | Main summary and many body sections cleaned. |
| `m3-inventory/semantic-schema-m3-summary.json` | `complete` | Summary JSON is English-first for flow guidance, lineage usage, and record descriptions. |

## M4 - Purchasing

| Artifact | Status | Notes |
| --- | --- | --- |
| `m4-purchasing/semantic-schema-m4-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m4-purchasing/semantic-schema-m4-nl2sql.json` | `complete` | Agent-facing guidance, lineage, and rules cleaned. |
| `m4-purchasing/semantic-schema-m4-summary.md` | `complete` | Main summary and priority body sections cleaned. |
| `m4-purchasing/semantic-schema-m4-summary.json` | `complete` | Summary JSON is English-first for flow guidance, lineage usage, and record descriptions. |

## M5 - Sales

| Artifact | Status | Notes |
| --- | --- | --- |
| `m5-sales/semantic-schema-m5-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m5-sales/semantic-schema-m5-nl2sql.json` | `complete` | Agent-facing guidance, lineage, and rules cleaned. |
| `m5-sales/semantic-schema-m5-summary.md` | `complete` | Summary guidance and priority body sections cleaned. |

## M6 - Manufacturing

| Artifact | Status | Notes |
| --- | --- | --- |
| `m6-manufacturing/semantic-schema-m6-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m6-manufacturing/semantic-schema-m6-nl2sql.json` | `complete` | Core machine-readable guidance cleaned. |
| `m6-manufacturing/semantic-schema-m6-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m6-manufacturing/semantic-schema-m6-summary.json` | `complete` | Summary JSON is English-first for guidance, detail lineage, and history/supporting tables. |

## M7 - Procurement Advanced

| Artifact | Status | Notes |
| --- | --- | --- |
| `m7-procurement advanced/semantic-schema-m7-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m7-procurement advanced/semantic-schema-m7-nl2sql.json` | `complete` | Agent-facing guidance is English-first; remaining Indonesian terms are intentional business synonyms. |
| `m7-procurement advanced/semantic-schema-m7-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m7-procurement advanced/semantic-schema-m7-summary.json` | `complete` | Summary JSON is English-first for lineage usage, lifecycle flow, and record descriptions. |

## M8 - Analytics Content

| Artifact | Status | Notes |
| --- | --- | --- |
| `m8-analytics content/semantic-schema-m8-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m8-analytics content/semantic-schema-m8-nl2sql.json` | `complete` | Core machine-readable guidance cleaned. |
| `m8-analytics content/semantic-schema-m8-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m8-analytics content/semantic-schema-m8-summary.json` | `complete` | Summary JSON is English-first for metric/table descriptions and guidance. |

## M11 - Healthcare

| Artifact | Status | Notes |
| --- | --- | --- |
| `m11-healthcare/semantic-schema-m11-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m11-healthcare/semantic-schema-m11-nl2sql.json` | `complete` | Agent-facing guidance is English-first; remaining Indonesian terms are intentional clinical/business synonyms. |
| `m11-healthcare/semantic-schema-m11-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m11-healthcare/semantic-schema-m11-summary.json` | `complete` | Summary JSON is English-first for visit lineage, healthcare flow, and record descriptions. |

## M12 - POS

| Artifact | Status | Notes |
| --- | --- | --- |
| `m12-pos/semantic-schema-m12-nl2sql.md` | `complete` | Rewritten for AI-agent use. |
| `m12-pos/semantic-schema-m12-nl2sql.json` | `complete` | Agent-facing guidance is English-first; remaining Indonesian terms are intentional POS/business synonyms. |
| `m12-pos/semantic-schema-m12-summary.md` | `complete` | Summary markdown is now English-first outside literal source field names. |
| `m12-pos/semantic-schema-m12-summary.json` | `complete` | Summary JSON is English-first for lineage usage, POS promotion/voucher records, and record descriptions. |

## Recommended Next Pass

1. Optionally normalize `business_terms` arrays to English-first plus local synonyms in a consistent order.
2. Optionally do a cosmetic pass on overview labels such as `total schema tables` for style consistency across all modules.
