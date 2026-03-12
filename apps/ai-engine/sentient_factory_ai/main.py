from __future__ import annotations

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from .codex_config import load_codex_config, resolve_model_settings
from .llm import generate_answer, schema_to_prompt_text
from .models import ChatRequest, ChatResponseData, SemanticSchemaResponse
from .semantic_schema import build_semantic_schema
from .settings import get_settings

settings = get_settings()
codex_config = load_codex_config(settings.codex_config_path)
codex_model, codex_base_url, codex_api_key = resolve_model_settings(codex_config)

app = FastAPI(title="Sentient Factory AI Engine", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def healthcheck() -> dict[str, object]:
    return {
        "status": "ok",
        "service": settings.app_name,
        "provider": codex_base_url or settings.llm_api_base_url,
        "model": settings.llm_model if settings.llm_model else codex_model,
    }


@app.get("/api/schema/semantic")
def get_semantic_schema(
    include_samples: bool = False,
    schema_key: str | None = None,
    query: str | None = None,
) -> dict[str, object]:
    schema = build_semantic_schema(
        database_url=settings.database_url,
        table_limit=settings.semantic_schema_table_limit,
        sample_limit=settings.semantic_schema_sample_limit,
        include_samples=include_samples,
        schema_source=settings.semantic_schema_source,
        schema_key=schema_key or settings.semantic_schema_key,
        manifest_path=settings.semantic_schema_manifest_path,
        query_text=query,
    )
    return {"success": True, "data": schema.model_dump(mode="json")}


@app.post("/api/chat/query")
async def chat_query(payload: ChatRequest) -> dict[str, object]:
    try:
        schema: SemanticSchemaResponse | None = None
        schema_prompt = "{}"
        if payload.include_schema:
            schema = build_semantic_schema(
                database_url=settings.database_url,
                table_limit=settings.semantic_schema_table_limit,
                sample_limit=settings.semantic_schema_sample_limit,
                include_samples=payload.include_samples,
                schema_source=settings.semantic_schema_source,
                schema_key=payload.schema_key or settings.semantic_schema_key,
                manifest_path=settings.semantic_schema_manifest_path,
                query_text=payload.question,
            )
            schema_prompt = schema_to_prompt_text(schema.model_dump(mode="json"))

        model = codex_model or settings.llm_model
        api_base_url = codex_base_url or settings.llm_api_base_url
        api_key = settings.llm_api_key or codex_api_key

        if not model or not api_base_url:
            raise HTTPException(status_code=500, detail="LLM configuration is incomplete.")

        answer, suggested_queries, resolved_model = await generate_answer(
            api_base_url=api_base_url,
            model=model,
            api_key=api_key,
            question=payload.question,
            messages=payload.messages,
            semantic_schema_text=schema_prompt,
        )
    except HTTPException:
        raise
    except Exception as error:  # pragma: no cover
        print(f"[ai-engine] chat_query failed: {error!r}")
        raise HTTPException(status_code=502, detail=f"AI engine failed: {error}") from error

    data = ChatResponseData(
        answer=answer,
        model=resolved_model,
        provider=api_base_url,
        semantic_schema=schema,
        suggested_queries=suggested_queries,
    )
    return {"success": True, "data": data.model_dump(mode="json")}


def run() -> None:
    uvicorn.run(
        "sentient_factory_ai.main:app",
        host=settings.host,
        port=settings.port,
        reload=settings.environment == "development",
    )
