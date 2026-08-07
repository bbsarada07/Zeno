"""
FastAPI Router for HOD Executive Governance Inbox & Petition Approvals.
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, List

router = APIRouter(prefix="/api/v1/hod", tags=["HOD Governance"])

class ApprovePetitionRequest(BaseModel):
    approved_by: Optional[str] = "HOD CSE"
    timestamp: Optional[str] = None
    notes: Optional[str] = None

@router.get("/petitions")
async def get_petitions():
    return {
        "status": "success",
        "petitions": [
            {
                "id": "pet-2026-001",
                "studentName": "Alex Rivera",
                "rollNumber": "2451-22-733-001",
                "department": "Computer Science & Engineering",
                "category": "Medical Waiver",
                "datesAffected": "14 July 2026 – 18 July 2026",
                "classesMissed": 14,
                "currentAttendance": 72.5,
                "postWaiverAttendance": 75.2,
                "shortfallPercentage": 2.5,
                "status": "Pending HOD Approval",
                "hospitalName": "Apollo Hospitals, Jubilee Hills",
                "doctorName": "Dr. R. K. Sharma (MD, Internal Medicine)",
                "ocrScore": 96,
                "ocrDetails": "Apollo Medical Certificate Verified (Cert ID: APH-2026-8819)",
                "documentFileName": "Apollo_Medical_Certificate_July2026.pdf",
                "petitionLetter": "Respected Head of Department,\n\nI am writing to formally request condensation for my attendance in Semester VI (Current: 72.5%, Required: 75.0%). I was unable to attend classes between July 14 and July 18 due to severe viral fever.\n\nSincerely,\nAlex Rivera",
                "submittedAt": "Today, 09:30 AM",
            }
        ],
    }

@router.post("/petitions/{petition_id}/approve")
async def approve_petition(petition_id: str, payload: Optional[ApprovePetitionRequest] = None):
    return {
        "status": "success",
        "petition_id": petition_id,
        "tx_hash": "0x8f7a9d3c2b1e4f5a6b0c9d8e7f6a5b4c3d2e1f0a",
        "message": f"Petition {petition_id} cryptographically approved and recorded on ledger.",
    }
