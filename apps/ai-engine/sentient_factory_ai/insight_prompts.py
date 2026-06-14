from __future__ import annotations

import json

from .models import (
    PerQueryExecutionResult,
    QueryResultSet,
    VisualizationSpec,
)


def _build_query_result_insight_prompt(
    *,
    user_question: str,
    sql: str | None,
    query_result: QueryResultSet,
) -> str:
    result_payload = query_result.model_dump(mode="json")
    return (
        f"Pertanyaan user:\n{user_question}\n\n"
        f"SQL read-only yang dijalankan:\n{sql or query_result.sql}\n\n"
        f"Hasil query JSON:\n{json.dumps(result_payload, ensure_ascii=True)}\n\n"
        "Berikan insight singkat yang langsung menjawab pertanyaan user berdasarkan hasil query di atas."
    )


def _build_multi_query_result_insight_prompt(
    *,
    user_question: str,
    query_results: list[PerQueryExecutionResult],
    visualizations: list[VisualizationSpec],
) -> str:
    compact_results = []
    for item in query_results:
        compact_results.append(
            {
                "query_id": item.query_id,
                "success": item.success,
                "error_message": item.error_message,
                "row_count": item.row_count,
                "columns": [column.name for column in item.columns],
                "sample_rows": item.rows[:5],
            }
        )
    return (
        f"Pertanyaan user:\n{user_question}\n\n"
        f"Visualizations:\n{json.dumps([item.model_dump(mode='json') for item in visualizations], ensure_ascii=True)}\n\n"
        f"Hasil multi-query JSON:\n{json.dumps(compact_results, ensure_ascii=True)}\n\n"
        "Berikan insight singkat dalam Bahasa Indonesia yang merangkum hasil dashboard ini. "
        "Sebutkan jika ada blok/query yang gagal."
    )


def _build_query_result_insight_fallback(
    *,
    user_question: str,
    query_result: QueryResultSet,
) -> str:
    row_count = query_result.row_count
    columns = ", ".join(column.name for column in query_result.columns[:5]) or "kolom tidak diketahui"
    sample_rows = query_result.rows[:3]
    if sample_rows:
        return (
            f"Query untuk pertanyaan '{user_question}' berhasil dijalankan dan menghasilkan {row_count} baris. "
            f"Kolom utama yang tersedia adalah {columns}. "
            f"Tiga baris teratas menunjukkan: {json.dumps(sample_rows, ensure_ascii=False)}."
        )
    return (
        f"Query untuk pertanyaan '{user_question}' berhasil dijalankan dan menghasilkan {row_count} baris, "
        f"dengan kolom utama {columns}."
    )


def _build_multi_query_result_insight_fallback(
    *,
    user_question: str,
    query_results: list[PerQueryExecutionResult],
) -> str:
    success_count = sum(1 for item in query_results if item.success)
    failed_count = len(query_results) - success_count
    highlight_parts: list[str] = []
    for item in query_results[:3]:
        if item.success:
            highlight_parts.append(f"{item.query_id} menghasilkan {item.row_count} baris")
        else:
            highlight_parts.append(f"{item.query_id} gagal: {item.error_message or 'error tidak diketahui'}")
    highlight_text = "; ".join(highlight_parts)
    base = (
        f"Dashboard untuk pertanyaan '{user_question}' menjalankan {len(query_results)} query. "
        f"{success_count} query berhasil"
    )
    if failed_count:
        base += f" dan {failed_count} query gagal"
    base += "."
    if highlight_text:
        base += f" Ringkasan hasil: {highlight_text}."
    return base


def _normalize_question_for_response_mode(question: str, response_mode: str | None) -> str:
    if response_mode != "dashboard":
        return question
    return (
        f"{question}\n\n"
        "[SYSTEM HINT] Gunakan mode dashboard. Anda boleh menghasilkan maksimal 5 query read-only "
        "dan visualizations terkait jika memang diperlukan. Jika tidak perlu, tetap boleh hanya 1 query."
    )
