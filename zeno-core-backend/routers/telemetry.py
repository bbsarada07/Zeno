"""
FastAPI Router for Real-Time SSE Telemetry Stream with SSE Buffering Prevention.
"""

from fastapi import APIRouter
from sse_starlette.sse import EventSourceResponse
from services.telemetry_broadcaster import telemetry_broadcaster

router = APIRouter(prefix="/api/v1/telemetry", tags=["Telemetry Stream"])

@router.get("/stream")
async def stream_telemetry():
    queue = telemetry_broadcaster.subscribe()
    headers = {
        "Cache-Control": "no-cache, no-transform",
        "X-Accel-Buffering": "no",
        "Connection": "keep-alive",
    }
    return EventSourceResponse(
        telemetry_broadcaster.event_generator(queue),
        media_type="text/event-stream",
        headers=headers
    )
