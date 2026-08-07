"""
Academic Operating Engine Deterministic Tools & Sub-Agents.
"""

import math
from typing import Dict, Any, List
from services.mock_db import ELECTIVE_COURSES
from services.vector_db import vector_db

class AttendancePredictor:
    @staticmethod
    def calculate(total_conducted: int = 160, total_attended: int = 116, target_percentage: float = 75.0) -> Dict[str, Any]:
        current_pct = round((total_attended / total_conducted) * 100, 2)
        target_fraction = target_percentage / 100.0

        if current_pct >= target_percentage:
            # How many classes can be safely missed without dropping below target%
            # (attended) / (conducted + bunks) >= target_fraction => bunks <= (attended / target_fraction) - conducted
            max_bunks = math.floor((total_attended / target_fraction) - total_conducted)
            needed_classes = 0
            shortage = False
            message = f"Your attendance is currently {current_pct}%, which is above the mandatory threshold of {target_percentage}%."
        else:
            # Classes needed to reach target percentage:
            # (attended + needed) / (conducted + needed) >= target_fraction
            # => attended + needed >= target_fraction * conducted + target_fraction * needed
            # => needed * (1 - target_fraction) >= (target_fraction * conducted) - attended
            # => needed = ceil( (target_fraction * conducted - attended) / (1 - target_fraction) )
            needed_classes = math.ceil(((target_fraction * total_conducted) - total_attended) / (1.0 - target_fraction))
            max_bunks = 0
            shortage = True
            message = f"ATTENDANCE SHORTAGE! Current attendance is {current_pct}%. You must attend the next {needed_classes} consecutive classes to reach {target_percentage}%."

        # Estimate SGPA Impact
        sgpa_impact = "No Impact" if not shortage else f"High Risk: Shortage flag restricts hall ticket issuance unless {needed_classes} catch-up classes are attended."

        return {
            "current_attendance_pct": current_pct,
            "target_pct": target_percentage,
            "total_conducted": total_conducted,
            "total_attended": total_attended,
            "shortage": shortage,
            "consecutive_classes_needed": max(0, needed_classes),
            "safe_bunks_available": max(0, max_bunks),
            "sgpa_impact_warning": sgpa_impact,
            "explanation": message
        }

class ElectiveRecommender:
    @staticmethod
    def recommend(student_profile: Dict[str, Any]) -> List[Dict[str, Any]]:
        student_skills = [s.lower() for s in student_profile.get("skills", [])]
        recommendations = []

        for course in ELECTIVE_COURSES:
            match_count = sum(1 for kw in course["match_keywords"] if any(s in kw.lower() or kw.lower() in s for s in student_skills))
            match_score = min(98, 70 + (match_count * 10))
            
            recommendations.append({
                "code": course["code"],
                "title": course["title"],
                "workload": course["workload"],
                "historical_avg_grade": course["historical_avg_grade"],
                "ai_match_score": match_score,
                "reason": f"Matches {match_count} of your core technical skills ({', '.join(course['match_keywords'][:2])})."
            })

        # Sort by match score descending
        recommendations.sort(key=lambda x: x["ai_match_score"], reverse=True)
        return recommendations

class ResourceRAGSearch:
    @staticmethod
    def search(query: str) -> Dict[str, Any]:
        results = vector_db.search_knowledge(query, limit=2)
        citations = []
        snippets = []
        for r in results:
            citations.append(f"Source: {r['title']} (Confidence: {r['score']*100:.1f}%)")
            snippets.append(r['content'])

        return {
            "query": query,
            "answer": " ".join(snippets) if snippets else "No relevant syllabus or paper records found.",
            "citations": citations,
            "raw_results": results
        }
