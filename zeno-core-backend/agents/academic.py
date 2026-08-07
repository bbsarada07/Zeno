"""
Academic Operating Engine Agent Sub-Graph Routines.
"""

import time
from schema.state import CampusAgentState
from tools.academic_tools import AttendancePredictor, ElectiveRecommender, ResourceRAGSearch
from services.telemetry_broadcaster import telemetry_broadcaster
from schema.telemetry import TelemetryEvent

async def academic_agent_node(state: CampusAgentState) -> dict:
    start_time = time.time()
    profile = state.user_profile
    
    thought = "Calculating attendance predictions, ranking electives, and querying vector RAG..."
    await telemetry_broadcaster.publish(TelemetryEvent(
        thread_id=state.thread_id,
        active_node="AcademicEngine",
        sub_agent_thought=thought,
        latency_ms=round((time.time() - start_time) * 1000, 2),
        confidence_score=0.98
    ))

    # Attendance predictor
    conducted = profile.get("total_classes_conducted", 160)
    attended = profile.get("total_classes_attended", 116)
    attendance_calc = AttendancePredictor.calculate(conducted, attended)

    # Elective recommendations
    elective_recs = ElectiveRecommender.recommend(profile)

    # Resource RAG Search
    rag_result = ResourceRAGSearch.search(state.query)

    output_payload = {
        "engine": "Academic Operating Engine",
        "attendance": attendance_calc,
        "elective_recommendations": elective_recs,
        "rag_knowledge": rag_result,
        "ui_card_type": "ACADEMIC_DASHBOARD_CARD"
    }

    latency = round((time.time() - start_time) * 1000, 2)
    telemetry_log = {
        "node": "AcademicEngine",
        "latency_ms": latency,
        "thought": "Deterministic bunk calculation and vector syllabus retrieval complete."
    }

    state.intermediate_outputs["academic"] = output_payload
    state.telemetry_logs.append(telemetry_log)
    return {"intermediate_outputs": state.intermediate_outputs, "telemetry_logs": state.telemetry_logs}
