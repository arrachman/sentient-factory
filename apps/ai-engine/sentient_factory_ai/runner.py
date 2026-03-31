from __future__ import annotations

import os

import uvicorn


def main() -> None:
    uvicorn.run(
        "sentient_factory_ai.main:app",
        host="0.0.0.0",
        port=8001,
        reload=os.getenv("AI_ENGINE_RELOAD", "false").lower() == "true",
    )
