from __future__ import annotations

import uvicorn


def main() -> None:
    uvicorn.run("sentient_factory_ai.main:app", host="0.0.0.0", port=8001, reload=False)
