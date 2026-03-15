from __future__ import annotations

import asyncio
from collections import defaultdict
from datetime import datetime, timezone
from typing import Any


class ProgressStreamBroker:
    def __init__(self) -> None:
        self._listeners: dict[str, list[asyncio.Queue[dict[str, Any]]]] = defaultdict(list)

    def subscribe(self, request_id: str) -> asyncio.Queue[dict[str, Any]]:
        queue: asyncio.Queue[dict[str, Any]] = asyncio.Queue()
        self._listeners[request_id].append(queue)
        return queue

    def unsubscribe(self, request_id: str, queue: asyncio.Queue[dict[str, Any]]) -> None:
        listeners = self._listeners.get(request_id, [])
        if queue in listeners:
            listeners.remove(queue)
        if not listeners and request_id in self._listeners:
            del self._listeners[request_id]

    async def publish(self, request_id: str, event: str, payload: dict[str, Any]) -> None:
        message = {
            "event": event,
            "request_id": request_id,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            **payload,
        }
        for queue in list(self._listeners.get(request_id, [])):
            await queue.put(message)


broker = ProgressStreamBroker()
