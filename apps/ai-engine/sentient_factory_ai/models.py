from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1)


class ChatRequest(BaseModel):
    question: str = Field(min_length=1)
    messages: list[ChatMessage] = Field(default_factory=list)
    include_schema: bool = True
    include_samples: bool = False
    schema_key: str | None = None


class SuggestedQuery(BaseModel):
    sql: str
    rationale: str
    safety: Literal["read_only"] = "read_only"


class SemanticColumn(BaseModel):
    name: str
    data_type: str = "unknown"
    nullable: bool = True
    description: str | None = None


class SemanticTable(BaseModel):
    schema: str = "myerpplus"
    name: str
    columns: list[SemanticColumn]
    primary_key: list[str] = Field(default_factory=list)
    row_count_estimate: int | None = None
    sample_rows: list[dict[str, Any]] = Field(default_factory=list)
    alias: str | None = None
    table_description: str | None = None
    synonyms: list[str] = Field(default_factory=list)
    always_apply_filters: str | None = None
    metrics: dict[str, str] = Field(default_factory=dict)
    relationships: list[dict[str, str]] = Field(default_factory=list)


class SemanticSchemaResponse(BaseModel):
    generated_at: str
    source: str
    tables: list[SemanticTable]


class ChatResponseData(BaseModel):
    answer: str
    model: str
    provider: str
    semantic_schema: SemanticSchemaResponse | None = None
    suggested_queries: list[SuggestedQuery] = Field(default_factory=list)
