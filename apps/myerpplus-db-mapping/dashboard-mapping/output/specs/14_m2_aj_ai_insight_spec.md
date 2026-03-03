# AI Insight Spec - M2 AJ Dashboard

## Scope
- Target page: `/app/dashboard/finance/m2_aj`
- Domain: `m2` (Finance & Accounting)
- Goal: generate narrative insights, anomaly alerts, and recommendations on top of existing widgets.

## Data Sources
- `summary.sql` (KPI aggregate)
- `trends.sql` (monthly debit/kredit/net)
- `breakdown_cashflow.sql` (cash in/out)
- `breakdown_status.sql` (status quality)
- `breakdown_branch.sql` (branch movement)

## API Endpoint
- Backend: `GET /api/dashboard/m2/insight`
- Web proxy: `GET /api/dashboard/m2/insight`
- Query params:
  - `fromDate` (YYYY-MM-DD, optional)
  - `toDate` (YYYY-MM-DD, optional)

## Response Contract (v1)
```json
{
  "success": true,
  "data": {
    "domain": "m2",
    "type": "insight",
    "query": {
      "fromDate": "2025-01-01",
      "toDate": "2025-12-31"
    },
    "model": {
      "provider": "rule-based",
      "version": "m2-insight-v1"
    },
    "summary": {
      "totalRows": 473,
      "totalDebit": 151894199634166.88,
      "totalKredit": 151894167334166.88,
      "netCashflow": 32300000
    },
    "insights": [
      "Periode analisis 2025-01-01 s/d 2025-12-31.",
      "Total debit ... dan total kredit ...",
      "Net cashflow periode terbaru ...",
      "Arus kas agregat: cash in ... vs cash out ...",
      "Cabang dengan movement terbesar: C1 ..."
    ],
    "anomalies": [
      "Outlier net cashflow terdeteksi pada periode: 2025-12"
    ],
    "recommendations": [
      "Prioritaskan review komponen cash out terbesar per sumber transaksi dan cabang.",
      "Lakukan validasi mapping status unknown_* agar analisis operasional lebih presisi.",
      "Gunakan drill-down detail transaksi untuk 10 transaksi nominal terbesar pada periode outlier."
    ]
  }
}
```

## UI Integration
- Panel `AI Insight` with 3 columns:
  - `Highlights`
  - `Anomaly Alerts`
  - `Recommendations`
- Model metadata shown below panel title (`provider • version`).
- Refresh tied to page date filter refresh action.

## Fallback Behavior
- If insight endpoint fails: panel renders empty states (`No insight generated`, etc.).
- Existing widgets remain functional (insight is non-blocking layer).

## Next Iteration
- Replace rule-based engine with LLM summarizer.
- Add confidence score per insight item.
- Add NLQ input (`Ask AI`) with guided prompt templates.

