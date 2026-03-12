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
    llm_api_base_url: str = Field(default="http://127.0.0.1:3206", alias="LLM_API_BASE_URL")
    llm_model: str = Field(default="model-default", alias="LLM_MODEL")
    llm_api_key: str | None = Field(default=None, alias="LLM_API_KEY")
    codex_config_path: Path = Field(default=Path.home() / ".codex" / "config.toml", alias="CODEX_CONFIG_PATH")
    semantic_schema_table_limit: int = Field(default=12, alias="SEMANTIC_SCHEMA_TABLE_LIMIT")
    semantic_schema_sample_limit: int = Field(default=3, alias="SEMANTIC_SCHEMA_SAMPLE_LIMIT")

    model_config = SettingsConfigDict(env_file=".env", extra="ignore", populate_by_name=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()

