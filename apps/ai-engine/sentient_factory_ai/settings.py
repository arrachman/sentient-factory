from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "sentient-factory-ai-engine"
    environment: str = Field(default="development", alias="NODE_ENV")
    host: str = Field(default="0.0.0.0", alias="AI_ENGINE_HOST")
    port: int = Field(default=8001, alias="AI_ENGINE_PORT")
    database_url: str = Field(alias="DATABASE_URL")
    audit_database_url: str | None = Field(default=None, alias="AI_AUDIT_DATABASE_URL")
    myerpplus_database_url: str | None = Field(default=None, alias="MYERPPLUS_DATABASE_URL")
    llm_api_base_url: str = Field(default="https://ai.patungin.id/v1", alias="LLM_API_BASE_URL")
    llm_model: str = Field(default="model-default", alias="LLM_MODEL")
    llm_fast_model: str | None = Field(default=None, alias="LLM_FAST_MODEL")
    llm_pro_model: str | None = Field(default=None, alias="LLM_PRO_MODEL")
    llm_api_key: str | None = Field(default=None, alias="LLM_API_KEY")
    codex_config_path: Path = Field(
        default=Path.home() / "apps" / "sentient-factory" / ".codex-cli" / "config.toml",
        alias="CODEX_CONFIG_PATH",
    )
    semantic_schema_table_limit: int = Field(default=12, alias="SEMANTIC_SCHEMA_TABLE_LIMIT")
    semantic_schema_sample_limit: int = Field(default=3, alias="SEMANTIC_SCHEMA_SAMPLE_LIMIT")
    semantic_schema_source: str = Field(default="myerpplus_file", alias="SEMANTIC_SCHEMA_SOURCE")
    semantic_schema_key: str = Field(default="all", alias="SEMANTIC_SCHEMA_KEY")
    semantic_schema_manifest_path: Path = Field(
        default=Path("apps/myerpplus-db-mapping/db/obt-agent-mapping.json"),
        alias="SEMANTIC_SCHEMA_MANIFEST_PATH",
    )
    semantic_query_schema_sales_path: Path = Field(
        default=Path("apps/myerpplus-db-mapping/db/semantic-query-schema-dashboard-obt.json"),
        alias="SEMANTIC_QUERY_SCHEMA_SALES_PATH",
    )
    ai_chat_workflow_mode: str = Field(default="agent", alias="AI_CHAT_WORKFLOW_MODE")
    agent_workflow_enabled: bool = Field(default=True, alias="AI_AGENT_WORKFLOW_ENABLED")
    agent_workflow_max_passes: int = Field(default=10, alias="AI_AGENT_WORKFLOW_MAX_PASSES")
    agent_workflow_first_prompt_path: Path = Field(
        default=Path("/app/prompts/sales_sql_readonly_generator.prompt.md"),
        alias="AI_AGENT_WORKFLOW_FIRST_PROMPT_PATH",
    )
    llm_request_timeout_seconds: float = Field(default=60.0, alias="LLM_REQUEST_TIMEOUT_SECONDS")
    llm_request_max_retries: int = Field(default=3, alias="LLM_REQUEST_MAX_RETRIES")
    dashboard_max_queries: int = Field(default=5, alias="AI_DASHBOARD_MAX_QUERIES")
    redis_url: str = Field(default="redis://redis:6379", alias="REDIS_URL")
    ai_workflow_queue_key: str = Field(default="ai:workflow:queue", alias="AI_WORKFLOW_QUEUE_KEY")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", populate_by_name=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()
