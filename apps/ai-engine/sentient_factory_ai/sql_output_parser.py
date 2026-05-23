from __future__ import annotations

import json
import re


def _parse_sql_generator_output(answer: str) -> dict[str, object] | None:
    candidate = answer.strip()
    if not candidate:
        return None

    direct = _try_parse_json_object(candidate)
    if direct is not None:
        return direct

    fenced_match = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", candidate, flags=re.IGNORECASE | re.DOTALL)
    if fenced_match:
        fenced = _try_parse_json_object(fenced_match.group(1).strip())
        if fenced is not None:
            return fenced

    first_brace = candidate.find("{")
    if first_brace >= 0:
        depth = 0
        in_string = False
        escaped = False
        for index, char in enumerate(candidate[first_brace:], start=first_brace):
            if in_string:
                if escaped:
                    escaped = False
                elif char == "\\":
                    escaped = True
                elif char == '"':
                    in_string = False
                continue
            if char == '"':
                in_string = True
            elif char == "{":
                depth += 1
            elif char == "}":
                depth -= 1
                if depth == 0:
                    extracted = candidate[first_brace : index + 1]
                    parsed = _try_parse_json_object(extracted)
                    if parsed is not None:
                        return parsed
                    break

    return None


def _try_parse_json_object(text: str) -> dict[str, object] | None:
    try:
        payload = json.loads(text)
    except json.JSONDecodeError:
        return None

    if isinstance(payload, dict):
        return payload
    return None


def _build_deterministic_query_fallback(question: str, schema_key: str | None) -> dict[str, object] | None:
    normalized = question.strip().lower()
    if not normalized:
        return None

    sales_context = schema_key in {"sales", "all", None}

    if sales_context and (
        ("customer" in normalized and ("sales" in normalized or "penjualan" in normalized))
        and any(term in normalized for term in ("top", "terbanyak", "terbesar"))
    ):
        return {
            "status": "SUCCESS",
            "debug_info": {
                "intent_user": "Mencari customer dengan penjualan terbesar berdasarkan agregasi nilai sales line.",
                "tables_used": ["obt_sales_line_flow"],
                "tables_missing": [],
                "reasoning": "Menggunakan obt_sales_line_flow karena pertanyaan meminta ranking customer berdasarkan penjualan. Nilai penjualan diagregasi dari kolom amount pada grain sales line dan dikelompokkan per customer.",
                "ai_metrics": {
                    "confidence_score": 0.84,
                    "schema_version_used": "Semantic Query Schema OBT",
                },
            },
            "execution_context": {
                "is_syntax_valid_prediction": True,
                "linting_warnings": [],
            },
            "query": (
                "SELECT\n"
                "  contact_code AS customer_code,\n"
                "  contact_name AS customer_name,\n"
                "  COUNT(DISTINCT doc_no) AS sales_invoice_count,\n"
                "  SUM(amount) AS total_sales_amount,\n"
                "  SUM(qty) AS total_qty\n"
                "FROM public.obt_sales_line_flow\n"
                "WHERE COALESCE(contact_code, '') <> ''\n"
                "GROUP BY contact_code, contact_name\n"
                "ORDER BY total_sales_amount DESC, sales_invoice_count DESC\n"
                "LIMIT 100"
            ),
            "error_message": None,
        }

    if sales_context and (
        "penjualan terbaru" in normalized
        or "sales terbaru" in normalized
        or "latest sales" in normalized
        or normalized.startswith("10 penjualan terbaru")
    ):
        limit = 10 if normalized.startswith("10 ") else 100
        return {
            "status": "SUCCESS",
            "debug_info": {
                "intent_user": "Menampilkan daftar transaksi penjualan terbaru berdasarkan tanggal dokumen sales invoice line.",
                "tables_used": ["obt_sales_line_flow"],
                "tables_missing": [],
                "reasoning": "Menggunakan obt_sales_line_flow untuk mengambil dokumen penjualan terbaru beserta customer, item, qty, dan amount pada grain sales line.",
                "ai_metrics": {
                    "confidence_score": 0.82,
                    "schema_version_used": "Semantic Query Schema OBT",
                },
            },
            "execution_context": {
                "is_syntax_valid_prediction": True,
                "linting_warnings": [],
            },
            "query": (
                "SELECT\n"
                "  doc_no,\n"
                "  doc_date,\n"
                "  contact_code AS customer_code,\n"
                "  contact_name AS customer_name,\n"
                "  item_code,\n"
                "  item_name,\n"
                "  qty,\n"
                "  amount,\n"
                "  currency_code\n"
                "FROM public.obt_sales_line_flow\n"
                "ORDER BY doc_date DESC, doc_no DESC, source_detail_id DESC\n"
                f"LIMIT {limit}"
            ),
            "error_message": None,
        }

    return None


def _is_failed_sql_generator_output(payload: dict[str, object]) -> bool:
    success_value = payload.get("success")
    if success_value is False:
        return True

    status_value = payload.get("status")
    return isinstance(status_value, str) and status_value.strip().upper() == "FAILED"


def _format_user_friendly_failure_message(message: str) -> str:
    normalized = message.strip()
    if not normalized:
        return "Permintaan ini belum bisa dijawab dari schema yang tersedia."

    normalized = re.sub(r"^TIDAK_BISA_DIBUAT_DARI_SCHEMA:\s*", "", normalized, flags=re.IGNORECASE)
    normalized = normalized.rstrip(". ")

    if not normalized:
        return "Permintaan ini belum bisa dijawab dari schema yang tersedia."

    return f"Permintaan ini belum bisa dijawab dari schema yang tersedia karena {normalized}."


def _looks_like_general_non_data_question(question: str) -> bool:
    normalized = question.strip().lower()
    if not normalized:
        return False

    general_patterns = (
        "kamu siapa",
        "siapa kamu",
        "apa itu kamu",
        "apa yang bisa kamu bantu",
        "bisa bantu apa",
        "siapa dirimu",
        "perkenalkan diri",
        "kenalan",
    )
    return any(pattern in normalized for pattern in general_patterns)
