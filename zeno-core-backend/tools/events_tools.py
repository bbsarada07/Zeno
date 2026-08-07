"""
Events & Opportunity Engine Deterministic Tools & Sub-Agents.
"""

from typing import Dict, Any, List
from services.mock_db import STUDENT_DIRECTORY, CAMPUS_NOTICES, TIMETABLE_AND_GIS

class ConflictDetector:
    @staticmethod
    def check_conflicts(event_name: str, event_dates: str = "2026-08-28 to 2026-08-30") -> Dict[str, Any]:
        conflicts = []
        # Check against exam notice
        for notice in CAMPUS_NOTICES:
            if "exam" in notice["title"].lower() or "exam" in notice["content"].lower():
                if "august 28" in notice["content"].lower():
                    conflicts.append({
                        "source": notice["title"],
                        "type": "Exam Conflict",
                        "severity": "CRITICAL",
                        "details": "Practical examinations start on August 28, 2026."
                    })
        
        has_conflict = len(conflicts) > 0
        return {
            "event_name": event_name,
            "event_dates": event_dates,
            "has_conflict": has_conflict,
            "conflicts": conflicts,
            "recommendation": "DO NOT REGISTER without HOD permission due to practical exam overlap." if has_conflict else "Clear schedule! No conflicts detected."
        }

class TeamFinderEngine:
    @staticmethod
    def match_peers(student_profile: Dict[str, Any], needed_role: str = "Frontend") -> List[Dict[str, Any]]:
        matched = []
        student_skills = set(s.lower() for s in student_profile.get("skills", []))

        for peer in STUDENT_DIRECTORY:
            peer_skills = set(s.lower() for s in peer["skills"])
            # Complementary skills: skills peer has that student doesn't
            complementary = peer_skills - student_skills
            match_score = min(96, 75 + (len(complementary) * 6))

            matched.append({
                "student_id": peer["id"],
                "name": peer["name"],
                "role": peer["role"],
                "cgpa": peer["cgpa"],
                "skills": peer["skills"],
                "complementary_skills": list(complementary),
                "ai_compatibility_score": match_score,
                "availability": peer["availability"]
            })

        matched.sort(key=lambda x: x["ai_compatibility_score"], reverse=True)
        return matched
