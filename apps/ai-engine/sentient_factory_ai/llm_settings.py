from __future__ import annotations

from .codex_config import load_codex_config, resolve_model_settings
from .settings import get_settings

settings = get_settings()
codex_config = load_codex_config(settings.codex_config_path)
codex_model, codex_base_url, codex_api_key = resolve_model_settings(codex_config)


def resolve_llm_settings(model_profile: str | None = None) -> tuple[str | None, str | None, str | None]:
    # Environment overrides should win so the container can be pointed at a
    # specific provider without inheriting the local Codex desktop config.
    if model_profile == "pro":
        model = settings.llm_pro_model or settings.llm_model or codex_model
    else:
        model = settings.llm_fast_model or settings.llm_model or codex_model
    api_base_url = settings.llm_api_base_url or codex_base_url
    api_key = settings.llm_api_key or codex_api_key
    return model, api_base_url, api_key
