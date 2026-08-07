"""
Placement AI Engine Agent Sub-Graph Routines.
"""

import time
from schema.state import CampusAgentState
from tools.placement_tools import ResumeAnalyzer, EligibilityEngine, CareerGPSPlanner, DigitalTwinSimulator
from services.telemetry_broadcaster import telemetry_broadcaster
from schema.telemetry import TelemetryEvent

async def placement_agent_node(state: CampusAgentState) -> dict:
    start_time = time.time()
    query_lower = state.query.lower()
    profile = state.user_profile
    
    thought = "Executing Placement AI Engine micro-routines for student profile..."
    await telemetry_broadcaster.publish(TelemetryEvent(
        thread_id=state.thread_id,
        active_node="PlacementEngine",
        sub_agent_thought=thought,
        latency_ms=round((time.time() - start_time) * 1000, 2),
        confidence_score=0.96
    ))

    # Evaluate eligibility across drives
    eligibility_results = EligibilityEngine.evaluate(profile)

    # ATS Resume Evaluation
    resume_analysis = ResumeAnalyzer.analyze(profile.get("resume_text", ""), target_role="AI Engineer")

    # Career GPS Roadmap
    career_gps = CareerGPSPlanner.generate_plan(profile)

    # Digital Twin Simulator
    digital_twin = DigitalTwinSimulator.simulate_paths(profile)

    output_payload = {
        "engine": "Placement AI Engine",
        "ats_score": resume_analysis["ats_score"],
        "resume_analysis": resume_analysis,
        "eligibility": eligibility_results,
        "career_gps": career_gps,
        "digital_twin": digital_twin,
        "ui_card_type": "PLACEMENT_SUMMARY_CARD"
    }

    latency = round((time.time() - start_time) * 1000, 2)
    telemetry_log = {
        "node": "PlacementEngine",
        "latency_ms": latency,
        "thought": "Completed eligibility checks, ATS analysis, and digital twin simulation."
    }

    state.intermediate_outputs["placement"] = output_payload
    state.telemetry_logs.append(telemetry_log)
    return {"intermediate_outputs": state.intermediate_outputs, "telemetry_logs": state.telemetry_logs}
