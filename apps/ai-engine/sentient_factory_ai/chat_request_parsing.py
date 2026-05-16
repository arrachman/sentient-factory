from __future__ import annotations

from fastapi import Request, UploadFile
from starlette.datastructures import UploadFile as StarletteUploadFile

from .attachment_parser import parse_upload_attachment
from .llm_settings import settings
from .models import ChatAttachment, ChatRequest


def resolve_workflow_mode(payload: ChatRequest) -> str:
    if payload.attachments:
        return "attachment"
    if payload.response_mode == "dashboard" or payload.ui_mode == "transform":
        return "dashboard"
    if payload.execute_read_only_query:
        return "query"
    return settings.ai_chat_workflow_mode


def _build_effective_question(payload: ChatRequest) -> str:
    context_sections: list[str] = []
    attachment_context = (payload.attachment_context or "").strip()
    if attachment_context:
        context_sections.append(attachment_context)
    if payload.attachments:
        sections: list[str] = []
        for index, attachment in enumerate(payload.attachments, start=1):
            lines = [
                f"Lampiran {index}: {attachment.name}",
                f"Tipe: {attachment.media_type or attachment.extension or 'unknown'}",
                f"Status ekstraksi: {attachment.extraction_status or 'unknown'}",
            ]
            if attachment.warning:
                lines.append(f"Warning: {attachment.warning}")
            if attachment.metadata:
                lines.extend(
                    f"- {key}: {value}" for key, value in attachment.metadata.items()
                )
            if attachment.content:
                lines.append(f"Konten:\n{attachment.content}")
            elif attachment.preview:
                lines.append(f"Ringkasan:\n{attachment.preview}")
            sections.append("\n".join(lines))
        if sections:
            context_sections.append("\n\n".join(sections).strip())

    attachment_context = "\n\n".join(section for section in context_sections if section).strip()
    if not attachment_context:
        return payload.question

    return (
        f"{payload.question.strip()}\n\n"
        "Gunakan konteks lampiran berikut sebagai data tambahan untuk menjawab pertanyaan user.\n"
        "Jika isi lampiran parsial atau metadata-only, sebutkan keterbatasannya secara singkat.\n\n"
        f"{attachment_context}"
    ).strip()


async def _parse_chat_request_from_http(
    request: Request,
    *,
    default_response_mode: str | None = None,
) -> ChatRequest:
    content_type = request.headers.get("content-type", "")
    if "multipart/form-data" not in content_type.lower():
        payload = await request.json()
        if default_response_mode and isinstance(payload, dict) and not payload.get("response_mode"):
            payload["response_mode"] = default_response_mode
        return ChatRequest.model_validate(payload)

    form = await request.form()
    upload_values = form.getlist("files")
    uploads: list[UploadFile | StarletteUploadFile] = [
        value
        for value in upload_values
        if isinstance(value, (UploadFile, StarletteUploadFile))
    ]
    parsed_attachments: list[ChatAttachment] = []
    if uploads:
        parsed_attachments = [await parse_upload_attachment(upload) for upload in uploads[:5]]

    bool_fields = {"include_schema", "include_samples", "execute_read_only_query"}
    normalized_payload: dict[str, object] = {}
    for key in form.keys():
        values = form.getlist(key)
        if key == "files":
            continue
        value = values[-1]
        if key in bool_fields:
            normalized_payload[key] = str(value).lower() == "true"
        elif value is not None:
            normalized_payload[key] = str(value)

    normalized_payload["attachments"] = parsed_attachments
    if default_response_mode and not normalized_payload.get("response_mode"):
        normalized_payload["response_mode"] = default_response_mode
    return ChatRequest.model_validate(normalized_payload)
