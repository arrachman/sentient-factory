from __future__ import annotations


def _extract_event_response(event_history: list[dict[str, object]] | None, event_name: str) -> str | None:
    for event in reversed(event_history or []):
        if event.get("event") != event_name:
            continue
        response = event.get("response")
        if isinstance(response, str) and response.strip():
            return response.strip()
    return None


def _serialize_rows(rows: list[dict[str, object]]) -> list[dict[str, object]]:
    return [
        {
            key: value.isoformat() if hasattr(value, "isoformat") else str(value) if hasattr(value, "hex") and not isinstance(value, str) else value
            for key, value in row.items()
        }
        for row in rows
    ]
