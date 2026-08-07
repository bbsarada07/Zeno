from typing import Optional, Dict, Any
from pydantic import BaseModel, Field
import time

class TelemetryEvent(BaseModel):
    timestamp: float = Field(default_factory=time.time)
    thread_id: str
    active_node: str
    sub_agent_thought: str
    latency_ms: float
    token_usage: int = 0
    confidence_score: float = 0.95
    extra: Optional[Dict[str, Any]] = None
