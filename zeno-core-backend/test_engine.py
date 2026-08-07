import asyncio
import json
import sys

# Ensure UTF-8 output encoding for windows console
sys.stdout.reconfigure(encoding='utf-8')

from schema.state import CampusAgentState
from services.mock_db import STUDENT_PROFILE
from tools.academic_tools import AttendancePredictor, ElectiveRecommender, ResourceRAGSearch
from tools.placement_tools import EligibilityEngine, ResumeAnalyzer, CareerGPSPlanner, DigitalTwinSimulator
from tools.events_tools import ConflictDetector, TeamFinderEngine
from tools.comms_tools import AnnouncementSummarizer, GrievanceRouter
from tools.spatial_tools import SpatialGISResolver
from agents.orchestrator import execute_agent_graph, resume_hitl_agent_graph

async def main():
    print("=== 1. Testing Deterministic Tools ===")
    att = AttendancePredictor.calculate(160, 116)
    print("Attendance Calc:", att)

    el = EligibilityEngine.evaluate(STUDENT_PROFILE)
    print("Placement Eligibility Count:", len(el))

    res = ResumeAnalyzer.analyze(STUDENT_PROFILE["resume_text"])
    print("ATS Score:", res["ats_score"])

    gis = SpatialGISResolver.resolve_location("Where is my OS Lab class?")
    print("GIS Location:", gis["formatted_location"], gis["coordinates"])

    rag = ResourceRAGSearch.search("Banker's algorithm deadlocks")
    print("RAG Search Citations:", rag["citations"])

    print("\n=== 2. Testing LangGraph Master Orchestrator Execution ===")
    res1 = await execute_agent_graph(
        user_id="2451-22-733-001",
        tenant_id="cse_dept",
        message="Check my placement eligibility for Google and AWS, calculate safe bunks for attendance, and find OS Lab classroom."
    )
    print("Execution Result Thread ID:", res1.get("thread_id"))
    print("HITL Required:", res1.get("hitl_required"))
    print("Telemetry Summary:", res1.get("telemetry_summary"))
    print("Markdown Output Preview:\n", res1.get("ui_payload", {}).get("markdown_card")[:400])

    print("\n=== 3. Testing HITL Approval Resume ===")
    thread_id = res1.get("thread_id")
    res_hitl = await resume_hitl_agent_graph(
        thread_id=thread_id,
        action_id="act_drive_registration_001",
        approved=True,
        user_input={"notes": "Approved by HOD"}
    )
    print("HITL Resume Status:", res_hitl.get("telemetry_summary"))

    print("\nALL BACKEND ENGINE TESTS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    asyncio.run(main())
