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
    execute_read_only_query: bool = False
    schema_key: str | None = None
    request_id: str | None = None


class ModelTestRequest(BaseModel):
    prompt: str = Field(min_length=1)
    request_id: str | None = None


class QueryResultColumn(BaseModel):
    name: str


class QueryResultSet(BaseModel):
    sql: str
    row_count: int
    columns: list[QueryResultColumn] = Field(default_factory=list)
    rows: list[dict[str, Any]] = Field(default_factory=list)


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
    schema_name: str = Field(default="myerpplus", alias="schema")
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
    request_id: str | None = None
    answer: str
    model: str
    provider: str
    data_source: str | None = None
    semantic_schema: SemanticSchemaResponse | None = None
    query_result: QueryResultSet | None = None
    suggested_queries: list[SuggestedQuery] = Field(default_factory=list)
    workflow_mode: str | None = None
    workflow_passes: int | None = None
    schema_key: str | None = None
    schema_source: str | None = None


class ModelTestResponseData(BaseModel):
    request_id: str | None = None
    prompt: str
    answer: str
    model: str
    provider: str
