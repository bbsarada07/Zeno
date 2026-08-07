from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class CampusAgentState(BaseModel):
    user_id: str = "2451-22-733-001"
    tenant_id: str = "cse_dept"
    thread_id: str = "2451-22-733-001_cse_dept"
    user_profile: Dict[str, Any] = Field(default_factory=dict)
    query: str = ""
    target_agents: List[str] = Field(default_factory=list)
    context_overrides: Dict[str, Any] = Field(default_factory=dict)
    intermediate_outputs: Dict[str, Any] = Field(default_factory=dict)
    telemetry_logs: List[Dict[str, Any]] = Field(default_factory=list)
    hitl_required: bool = False
    hitl_payload: Optional[Dict[str, Any]] = None
    final_response: Optional[Dict[str, Any]] = None
