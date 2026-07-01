---
title: M5 Schema and AI SQL Artifacts
sidebar_position: 3
description: Technical artifacts used for the M5 semantic schema, query collection, and regression tests.
---

# M5 Schema and AI SQL Artifacts

This page summarizes the technical artifacts used for tutorials and analysis in the `m5-sales` module.

## Schema and Summary

- `semantic-schema-m5.json`
  AI Agent function: the main schema dedicated to module `m5`, used as core context for sales tables, relations, and business terminology.
- `semantic-schema-sales.json`
  AI Agent function: narrower sales-domain schema, useful when the agent only needs to focus on sales use cases without other-module noise.
- `semantic-schema.json`
  AI Agent function: global cross-module schema, used when sales questions touch finance, inventory, or master data.
- `semantic-schema-m5-summary.md`
  AI Agent function: human-readable summary for prompt engineering, quick review, and sales schema coverage validation.
- `semantic-schema-m5-summary-flat.json`
  AI Agent function: flat version for indexing, retrieval, fast filtering, or ingestion into embedding and automated evaluation pipelines.

## Query and Report Sources

- `m5-queries.md`
- `m5-queries-by-type.md`
- `m0_report_rmoduleid_5.sql`

## NL2SQL Guides

- `semantic-schema-m5-nl2sql.md`
- `semantic-schema-m5-nl2sql.json`
  AI Agent function: machine-readable rules for translating user questions into readonly SQL in the `m5` domain, including guardrails and expected query patterns.

## Prompt and Regression Suite

- `sales_sql_readonly_generator.prompt.md`
- `sales_sql_readonly_generator.m5-regression-tests.md`
- `sales_sql_readonly_generator.m5-regression-tests.json`
  AI Agent function: structured test cases for checking whether the agent generates correct, relevant, and readonly-safe sales SQL.
- `validate_m5_regression.py`
- `run_m5_regression.py`

## AI Agent POV

From the AI agent perspective, the JSON files are typically grouped like this:

- **Core business schema**
  - `semantic-schema-m5.json`
  - `semantic-schema-sales.json`
  - `semantic-schema.json`
  Used to understand the data world, table names, document relations, and business terms.

- **Reasoning and generation rules**
  - `semantic-schema-m5-nl2sql.json`
  Used to direct table selection, join construction, and query safety boundaries.

- **Evaluation and regression**
  - `semantic-schema-m5-summary-flat.json`
  - `sales_sql_readonly_generator.m5-regression-tests.json`
  Used for fast retrieval, output evaluation, and regression testing when prompts or schemas change.

## API Test Example

```bash
curl -X POST http://127.0.0.1:8001/api/chat/dashboard-query \
  -H 'Content-Type: application/json' \
  -d '{"question":"Build a customer receivable dashboard: unpaid invoice list, total outstanding per customer, and aging bucket","include_schema":true,"include_samples":false,"execute_read_only_query":false,"model_profile":"pro"}'
```

## Example: Starting The AI Engine

```bash
docker compose -p sentient_factory -f /opt/sentient-factory/infra/docker-compose.yml up -d --force-recreate ai-engine
```

```bash
VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only docker compose -p sentient_factory -f /opt/sentient-factory/infra/docker-compose.yml up -d --force-recreate ai-engine
```

```bash
docker rm -f sentient-infra-ai-engine
env VAULT_DEV_ROOT_TOKEN_ID=change-me-local-only docker compose -p sentient_factory -f /opt/sentient-factory/infra/docker-compose.yml up -d ai-engine
```

## M5 Analysis Checklist

Common work areas when enriching the sales semantic schema:

- check which M5 tables still have generic descriptions
- check which important report columns are still missing from the schema
- generate an M5-specific semantic-query-schema from schema, query, and report artifacts
