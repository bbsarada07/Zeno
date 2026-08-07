"""
Placement AI Engine Deterministic Tools & Sub-Agents.
"""

from typing import Dict, Any, List
from services.mock_db import PLACEMENT_DRIVES

class ResumeAnalyzer:
    @staticmethod
    def analyze(resume_text: str, target_role: str = "AI Engineer") -> Dict[str, Any]:
        text_lower = resume_text.lower()
        keywords_required = ["python", "fastapi", "react", "pytorch", "docker", "git", "langchain", "data structures"]
        found_keywords = [kw for kw in keywords_required if kw in text_lower]
        missing_keywords = [kw for kw in keywords_required if kw not in text_lower]
        
        # Calculate ATS score
        base_score = int((len(found_keywords) / len(keywords_required)) * 75)
        if "education" in text_lower:
            base_score += 10
        if "projects" in text_lower:
            base_score += 15
        
        ats_score = min(100, max(40, base_score))
        
        improvements = []
        if "docker" in missing_keywords:
            improvements.append("Add containerization experience (Docker/Kubernetes) under Technical Skills.")
        if "pytorch" in missing_keywords:
            improvements.append("Include deep learning framework projects (PyTorch/TensorFlow).")
        if len(missing_keywords) > 0:
            improvements.append(f"Incorporate missing target keywords: {', '.join(missing_keywords[:3])}.")
        improvements.append("Quantify impact in project section (e.g. 'Improved latency by 35%').")

        return {
            "ats_score": ats_score,
            "target_role": target_role,
            "found_keywords": found_keywords,
            "missing_keywords": missing_keywords,
            "section_improvements": improvements
        }

class EligibilityEngine:
    @staticmethod
    def evaluate(student_profile: Dict[str, Any], company_name: str = None) -> List[Dict[str, Any]]:
        cgpa = student_profile.get("cgpa", 0.0)
        backlogs = student_profile.get("active_backlogs", 0)
        branch = student_profile.get("department", "CSE")

        results = []
        drives = PLACEMENT_DRIVES
        if company_name:
            drives = [d for d in drives if d["company"].lower() == company_name.lower()]

        for drive in drives:
            reasons = []
            eligible = True

            if cgpa < drive["min_cgpa"]:
                eligible = False
                reasons.append(f"CGPA {cgpa} is below required threshold {drive['min_cgpa']}")
            if backlogs > drive["max_backlogs"]:
                eligible = False
                reasons.append(f"Active backlogs ({backlogs}) exceed allowed maximum ({drive['max_backlogs']})")
            if branch not in drive["allowed_branches"]:
                eligible = False
                reasons.append(f"Branch {branch} not in allowed list: {', '.join(drive['allowed_branches'])}")

            if eligible:
                status = "ELIGIBLE"
                explanation = f"Congratulations! You satisfy all requirements (CGPA >= {drive['min_cgpa']}, 0 Backlogs)."
            else:
                status = "INELIGIBLE"
                explanation = f"Not eligible due to: {'; '.join(reasons)}."

            results.append({
                "drive_id": drive["id"],
                "company": drive["company"],
                "role": drive["role"],
                "ctc_lpa": drive["ctc_lpa"],
                "status": status,
                "explanation": explanation,
                "min_cgpa": drive["min_cgpa"],
                "allowed_branches": drive["allowed_branches"]
            })
        return results

class CareerGPSPlanner:
    @staticmethod
    def generate_plan(student_profile: Dict[str, Any], goal_role: str = "AI Engineer") -> Dict[str, Any]:
        milestones = [
            {
                "phase": 1,
                "title": "Core Foundations & DSA",
                "duration": "Weeks 1-4",
                "actions": ["Solve 75 LeetCode Medium DSA problems", "Master Graph & Dynamic Programming algorithms"],
                "status": "In Progress"
            },
            {
                "phase": 2,
                "title": "Domain Mastery & Projects",
                "duration": "Weeks 5-8",
                "actions": ["Build an End-to-End LLM Multi-Agent System with FastAPI & Qdrant", "Deploy on AWS Cloud"],
                "status": "Next"
            },
            {
                "phase": 3,
                "title": "Certifications & Resume Polish",
                "duration": "Weeks 9-10",
                "actions": ["Complete AWS Cloud Practitioner certification", "Optimize ATS score above 85%"],
                "status": "Upcoming"
            },
            {
                "phase": 4,
                "title": "Mock Interviews & Campus Drives",
                "duration": "Weeks 11-12",
                "actions": ["Conduct 5 system design mock interviews", "Apply for Google & Microsoft Tier-1 drives"],
                "status": "Upcoming"
            }
        ]
        return {
            "goal_role": goal_role,
            "estimated_timeframe": "12 Weeks",
            "readiness_score": 82,
            "milestones": milestones
        }

class DigitalTwinSimulator:
    @staticmethod
    def simulate_paths(student_profile: Dict[str, Any]) -> Dict[str, Any]:
        return {
            "path_a": {
                "role": "AI / ML Engineer",
                "expected_salary_range": "₹22 LPA - ₹34 LPA",
                "hiring_demand": "Very High (+42% YoY)",
                "growth_vectors": ["Generative AI Systems", "LLM Orchestration", "Vector Databases", "Model Fine-tuning"],
                "skill_alignment_pct": 88
            },
            "path_b": {
                "role": "Backend Systems Engineer",
                "expected_salary_range": "₹16 LPA - ₹26 LPA",
                "hiring_demand": "High (+25% YoY)",
                "growth_vectors": ["Microservices Architecture", "Distributed Caching", "PostgreSQL Optimization", "gRPC"],
                "skill_alignment_pct": 92
            },
            "recommendation": "Path A (AI / ML Engineer) aligns best with your target salary potential and current research projects."
        }
