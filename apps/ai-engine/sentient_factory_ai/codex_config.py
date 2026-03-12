from __future__ import annotations

from pathlib import Path
from typing import Any

import tomli


def load_codex_config(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}

    with path.open("rb") as file:
        return tomli.load(file)


def resolve_model_settings(config: dict[str, Any]) -> tuple[str | None, str | None, str | None]:
    model = config.get("model")
    provider_key = config.get("model_provider")
    providers = config.get("model_providers", {})
    provider = providers.get(provider_key or "", {}) if isinstance(providers, dict) else {}
    return model, provider.get("base_url"), provider.get("experimental_bearer_token")

