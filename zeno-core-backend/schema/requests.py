from typing import Dict, Any, Optional
from pydantic import BaseModel, Field

class ExecuteRequest(BaseModel):
    user_id: str = Field(..., example="2451-22-733-001")
    tenant_id: str = Field(default="cse_dept", example="cse_dept")
    message: str = Field(..., example="Check my placement eligibility for Google and AWS")
    context_overrides: Dict[str, Any] = Field(default_factory=dict)

class HITLApproveRequest(BaseModel):
    thread_id: str = Field(..., example="2451-22-733-001_cse_dept")
    action_id: str = Field(..., example="drive_registration_google")
    approved: bool = Field(..., example=True)
    user_input: Dict[str, Any] = Field(default_factory=dict)
