# Multi-Query Dashboard Plan

Dokumen ini adalah blueprint implementasi agar `apps/ai-engine` dapat menangani:

- lebih dari satu query read-only dalam satu request
- lebih dari satu result set
- lebih dari satu chart/table dalam satu response
- tetap kompatibel dengan mode single-query yang sudah berjalan

## Tujuan

Mode baru ditujukan untuk pertanyaan dashboard atau analitik majemuk, misalnya:

- daftar invoice belum lunas + total outstanding per customer + aging bucket
- funnel SQ -> SO -> DO per bulan
- customer 360: invoice, collection, payment
- fulfillment bottleneck per tahap dokumen

Target fase pertama:

- maksimal `3` query per request
- maksimal `3` chart/table utama
- eksekusi serial
- partial success didukung
- backward-compatible dengan `POST /api/chat/query`

## Non-Goals Fase Pertama

- parallel execution query
- chart inference bebas tanpa metadata eksplisit
- nested dashboard composition
- arbitrary number of queries
- write query

## Kondisi Saat Ini

Implementasi sekarang masih single-query:

- parser hanya membaca satu object JSON dengan field `query`
- executor hanya mengeksekusi satu SQL
- response hanya punya satu `query_result`
- insight builder hanya membaca satu hasil query
- audit log belum punya struktur per-query

File kunci saat ini:

- `apps/ai-engine/sentient_factory_ai/main.py`
- `apps/ai-engine/sentient_factory_ai/models.py`
- `apps/ai-engine/sentient_factory_ai/mysql_client.py`
- `apps/ai-engine/sentient_factory_ai/audit_store.py`
- `apps/ai-engine/prompts/sales_sql_readonly_generator.prompt.md`

## Desain Kontrak Baru

### Mode Single Query Lama

Tetap didukung:

```json
{
  "status": "SUCCESS",
  "query": "SELECT ...",
  "error_message": null
}
```

### Mode Multi Query Baru

Format yang disarankan:

```json
{
  "status": "SUCCESS",
  "mode": "multi_query_dashboard",
  "debug_info": {
    "intent_user": "Dashboard piutang customer",
    "reasoning": "Butuh list invoice, agregasi customer, dan aging bucket."
  },
  "queries": [
    {
      "id": "q_invoice_list",
      "name": "invoice_list",
      "purpose": "Daftar invoice belum lunas",
      "query": "SELECT ...",
      "result_kind": "table"
    },
    {
      "id": "q_customer_outstanding",
      "name": "customer_outstanding",
      "purpose": "Total outstanding per customer",
      "query": "SELECT ...",
      "result_kind": "bar_chart"
    },
    {
      "id": "q_aging_bucket",
      "name": "aging_bucket",
      "purpose": "Distribusi aging piutang",
      "query": "SELECT ...",
      "result_kind": "stacked_bar_chart"
    }
  ],
  "visualizations": [
    {
      "id": "viz_invoice_table",
      "query_id": "q_invoice_list",
      "title": "Invoice Belum Lunas",
      "chart_type": "table"
    },
    {
      "id": "viz_customer_outstanding",
      "query_id": "q_customer_outstanding",
      "title": "Outstanding per Customer",
      "chart_type": "bar",
      "x_axis": "nama_customer",
      "y_axis": [
        "total_outstanding"
      ]
    },
    {
      "id": "viz_aging_bucket",
      "query_id": "q_aging_bucket",
      "title": "Aging Piutang",
      "chart_type": "stacked_bar",
      "x_axis": "bucket_umur",
      "y_axis": [
        "jumlah_invoice",
        "total_outstanding"
      ]
    }
  ],
  "error_message": null
}
```

## Aturan Validasi Output LLM

Mode multi-query hanya valid jika:

- `queries` adalah array dengan panjang `1..3`
- setiap item punya `id`, `purpose`, `query`
- semua `id` unik
- semua query adalah single statement read-only
- tidak ada query kosong
- `visualizations[*].query_id` harus merujuk ke query yang ada
- `chart_type` harus termasuk whitelist

Whitelist awal `chart_type`:

- `table`
- `bar`
- `line`
- `pie`
- `stacked_bar`

Jika `queries` tidak valid:

- downgrade ke `FAILED`
- atau fallback ke single-query bila hanya satu query valid

## Perubahan Model

Perlu ditambahkan di `sentient_factory_ai/models.py`:

- `GeneratedQuery`
- `VisualizationSpec`
- `PerQueryExecutionResult`
- `MultiQueryExecutionSummary`

Struktur yang disarankan:

```python
class GeneratedQuery(BaseModel):
    id: str
    name: str | None = None
    purpose: str
    query: str
    result_kind: str | None = None


class VisualizationSpec(BaseModel):
    id: str
    query_id: str
    title: str
    chart_type: Literal["table", "bar", "line", "pie", "stacked_bar"]
    x_axis: str | None = None
    y_axis: list[str] = Field(default_factory=list)


class PerQueryExecutionResult(BaseModel):
    query_id: str
    sql: str
    success: bool
    error_message: str | None = None
    row_count: int = 0
    columns: list[QueryResultColumn] = Field(default_factory=list)
    rows: list[dict[str, Any]] = Field(default_factory=list)
```

`ChatResponseData` perlu ditambah:

- `query_results: list[PerQueryExecutionResult]`
- `visualizations: list[VisualizationSpec]`
- `execution_status: "SUCCESS" | "PARTIAL_SUCCESS" | "FAILED"`

`query_result` lama tetap dipertahankan sementara untuk kompatibilitas.

## Perubahan Runtime

### Parser

Di `main.py`:

- tetap dukung mode lama `query`
- tambahkan parser `queries[]`
- tambahkan parser `visualizations[]`

Logika:

1. jika ada `queries[]`, masuk mode multi-query
2. jika hanya ada `query`, masuk mode lama
3. jika dua-duanya tidak ada, return failed

### Executor

Tambahkan wrapper baru di `mysql_client.py`:

- `execute_multiple_read_only_queries(database_url, queries, row_limit=200, max_queries=3)`

Aturan eksekusi:

- serial
- satu statement per query
- semua query tetap melewati validator SQL yang sama
- limit default tetap dipasang bila query tidak punya `LIMIT`
- stop policy fase pertama:
  - lanjut ke query berikutnya jika satu query gagal
  - simpan error per query

### Status Akhir

Status akhir request:

- `SUCCESS`: semua query sukses
- `PARTIAL_SUCCESS`: minimal satu sukses dan minimal satu gagal
- `FAILED`: semua gagal atau output generator tidak valid

## Multi-Chart Planning

LLM tidak boleh menyerahkan chart murni heuristik. Harus selalu eksplisit:

- chart memakai `query_id`
- chart menyebut `chart_type`
- chart menyebut field yang dipakai

Aturan chart:

- `table` tidak perlu `x_axis`
- `bar`, `line`, `pie`, `stacked_bar` wajib punya `x_axis`
- `bar`, `line`, `stacked_bar` wajib punya minimal satu `y_axis`
- `pie` wajib punya tepat satu `y_axis`

UI tidak perlu menebak chart dari kolom result set.

## Partial Failure Handling

Contoh kasus:

- `q1` sukses
- `q2` sukses
- `q3` gagal karena typo kolom

Response:

- `execution_status = "PARTIAL_SUCCESS"`
- hasil `q1` dan `q2` tetap dikirim
- visualization untuk `q3` di-drop atau diberi flag `disabled`
- error `q3` masuk ke `query_results`

Ini penting agar dashboard tetap berguna walau satu blok gagal.

## Audit dan History

`audit_store.py` perlu diperluas agar menyimpan:

- `generated_queries` JSONB
- `query_results` JSONB array
- `visualizations` JSONB
- `per_query_status` JSONB

Kolom lama seperti `query_result` tetap bisa dipertahankan selama masa transisi.

Minimal tambahan schema:

```sql
ALTER TABLE ai_chat_audit_logs
    ADD COLUMN IF NOT EXISTS generated_queries JSONB;

ALTER TABLE ai_chat_audit_logs
    ADD COLUMN IF NOT EXISTS query_results_v2 JSONB;

ALTER TABLE ai_chat_audit_logs
    ADD COLUMN IF NOT EXISTS visualizations JSONB;
```

Hal yang perlu bisa diaudit:

- query keberapa yang gagal
- chart mana yang mengacu ke query gagal
- apakah model memilih mode single atau multi
- total durasi per query

## Endpoint API

Ada dua opsi.

### Opsi A

Tetap pakai endpoint lama:

- `POST /api/chat/query`

Tambahkan field request:

```json
{
  "question": "...",
  "response_mode": "single|dashboard"
}
```

Kelebihan:

- satu endpoint

Kekurangan:

- perilaku lebih kompleks

### Opsi B

Buat endpoint baru:

- `POST /api/chat/dashboard-query`

Kelebihan:

- lebih jelas
- risiko regresi lebih kecil

Kekurangan:

- ada endpoint tambahan

Rekomendasi fase pertama: `Opsi B`.

## Guardrail Prompt

Prompt generator perlu diubah agar:

- mode multi-query hanya dipilih jika user meminta dashboard, ringkasan + detail, atau multi-visual
- maksimal `3` query
- query tidak saling duplikat
- jangan gunakan window function
- chart harus merujuk ke `query_id`
- pertanyaan sederhana tetap menghasilkan satu query

Contoh trigger multi-query:

- "dashboard"
- "ringkasan dan detail"
- "buatkan chart"
- "tampilkan tren + daftar detail + top customer"

Contoh non-trigger:

- "daftar invoice belum lunas"
- "jumlah invoice belum lunas"

## Web Dashboard

`apps/web-dashboard` perlu dukung:

- list of chart blocks
- list of table blocks
- partial error banner per blok
- graceful fallback ke mode lama

Kontrak UI yang disarankan:

- render berdasarkan `visualizations[]`
- lookup ke `query_results[]` via `query_id`
- jika tidak ada `visualizations[]`, fallback ke `query_result` lama

## Regression Test

Tambahkan suite baru:

- `sales_sql_readonly_generator.multi-query-regression-tests.json`

Kasus minimal:

1. invoice list + customer outstanding + aging bucket
2. SQ -> SO -> DO funnel
3. invoice + collection + payment
4. partial success satu query typo
5. query ke-4 harus ditolak
6. chart `query_id` invalid harus ditolak

Validator perlu mengecek:

- jumlah query <= 3
- semua query single statement
- tidak ada `OVER(...)`
- semua `visualizations.query_id` valid

## Rencana Implementasi

### Fase 1

- tambah model multi-query
- tambah parser multi-query
- tambah executor serial multi-query
- tambah response `query_results[]`
- tambah `visualizations[]`
- tambah audit log dasar

### Fase 2

- endpoint baru `dashboard-query`
- dukungan UI multi-chart
- insight generator lintas beberapa result set

### Fase 3

- feature flag rollout
- regression suite penuh
- observability dan quality metrics

## Rekomendasi Implementasi

Rute paling aman:

1. pertahankan endpoint lama
2. tambah endpoint baru khusus dashboard
3. batasi maksimal 3 query
4. jalankan serial
5. simpan audit per query
6. aktifkan lewat feature flag

## File yang Akan Tersentuh

Backend:

- `apps/ai-engine/sentient_factory_ai/models.py`
- `apps/ai-engine/sentient_factory_ai/main.py`
- `apps/ai-engine/sentient_factory_ai/mysql_client.py`
- `apps/ai-engine/sentient_factory_ai/audit_store.py`
- `apps/ai-engine/prompts/sales_sql_readonly_generator.prompt.md`

Testing:

- `apps/ai-engine/prompts/validate_multi_query_regression.py`
- `apps/ai-engine/prompts/sales_sql_readonly_generator.multi-query-regression-tests.json`

Frontend:

- `apps/web-dashboard/...` komponen chat result / chart renderer

## Keputusan yang Direkomendasikan

- gunakan endpoint baru `POST /api/chat/dashboard-query`
- gunakan kontrak `queries[]` + `visualizations[]`
- batasi `3` query
- serial execution
- partial success didukung
- feature flag untuk rollout awal

