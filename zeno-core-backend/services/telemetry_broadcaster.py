import asyncio
import json
import logging
from typing import AsyncGenerator
from schema.telemetry import TelemetryEvent

logger = logging.getLogger("zeno.telemetry")

class TelemetryBroadcaster:
    def __init__(self):
        self._subscribers: set[asyncio.Queue] = set()

    def subscribe(self) -> asyncio.Queue:
        queue = asyncio.Queue()
        self._subscribers.add(queue)
        return queue

    def unsubscribe(self, queue: asyncio.Queue):
        self._subscribers.discard(queue)

    async def publish(self, event: TelemetryEvent):
        data = event.model_dump_json()
        dead_queues = []
        for queue in list(self._subscribers):
            try:
                queue.put_nowait(data)
            except Exception:
                dead_queues.append(queue)
        for dq in dead_queues:
            self.unsubscribe(dq)

    async def event_generator(self, queue: asyncio.Queue) -> AsyncGenerator[str, None]:
        try:
            while True:
                data = await queue.get()
                yield f"data: {data}\n\n"
        except asyncio.CancelledError:
            self.unsubscribe(queue)

# Singleton instance
telemetry_broadcaster = TelemetryBroadcaster()
