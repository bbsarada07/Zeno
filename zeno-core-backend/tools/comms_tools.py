"""
Communication & Grievance Engine Deterministic Tools & Sub-Agents.
"""

from typing import Dict, Any, List
from services.mock_db import CAMPUS_NOTICES

class AnnouncementSummarizer:
    @staticmethod
    def summarize(notice_id: str = None) -> Dict[str, Any]:
        notices = CAMPUS_NOTICES
        if notice_id:
            notices = [n for n in notices if n["id"] == notice_id]
        
        summaries = []
        for n in notices:
            bullets = [
                f"Topic: {n['title']}",
                f"Key Action: {n['content'][:120]}...",
                f"Issued Date: {n['date']} | Mandatory Action Required."
            ]
            summaries.append({
                "notice_id": n["id"],
                "title": n["title"],
                "priority_badge": n["priority"],
                "bullet_points": bullets
            })
        return {
            "total_notices": len(summaries),
            "summaries": summaries
        }

class GrievanceRouter:
    @staticmethod
    def route_complaint(complaint_text: str, student_profile: Dict[str, Any]) -> Dict[str, Any]:
        text_lower = complaint_text.lower()
        
        if any(w in text_lower for w in ["wifi", "water", "electricity", "fan", "ac", "lab", "computer"]):
            dept = "Facilities & Infrastructure"
            priority = "HIGH"
        elif any(w in text_lower for w in ["room", "hostel", "mess", "food", "bed"]):
            dept = "Hostel Administration"
            priority = "MEDIUM"
        elif any(w in text_lower for w in ["fee", "scholarship", "receipt", "dues", "payment"]):
            dept = "Finance & Accounts"
            priority = "HIGH"
        else:
            dept = "Academic Affairs"
            priority = "NORMAL"

        import uuid
        ticket_id = f"TICK-{uuid.uuid4().hex[:6].upper()}"

        return {
            "ticket_id": ticket_id,
            "complainant": student_profile.get("name", "Alex Rivera"),
            "student_id": student_profile.get("user_id", "2451-22-733-001"),
            "predicted_department": dept,
            "priority": priority,
            "status": "QUEUED_FOR_DISPATCH",
            "summary_snippet": complaint_text[:100] + ("..." if len(complaint_text) > 100 else ""),
            "estimated_sla_resolution": "24 to 48 Hours"
        }
