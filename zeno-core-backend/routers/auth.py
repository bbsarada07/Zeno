"""
FastAPI Router for Auth Vault & OTP Verification.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional

router = APIRouter(prefix="/api/v1/auth", tags=["Auth Vault"])

class OTPRequest(BaseModel):
    email: str
    domain_role: Optional[str] = "student"
    tenant: Optional[str] = "CSM-Dept"

class OTPVerify(BaseModel):
    email: str
    otp: Optional[str] = None
    token: Optional[str] = None

@router.post("/send-otp")
async def send_otp(payload: OTPRequest):
    return {
        "status": "success",
        "message": "OTP generated successfully",
        "email": payload.email,
        "role": payload.domain_role,
        "tenant": payload.tenant,
    }

@router.post("/verify-otp")
async def verify_otp(payload: OTPVerify):
    return {
        "access_token": "demo_jwt_token_123",
        "token_type": "bearer",
        "user": {
            "email": payload.email,
            "role": "student",
            "name": "Alex Rivera",
            "rollNumber": "2451-22-733-001",
            "department": "Computer Science & Engineering",
        },
    }
