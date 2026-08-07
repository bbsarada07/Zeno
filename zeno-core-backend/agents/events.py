"""
Events & Opportunity Engine Agent Sub-Graph Routines.
"""

import time
from schema.state import CampusAgentState
from tools.events_tools import ConflictDetector, TeamFinderEngine
from services.telemetry_broadcaster import telemetry_broadcaster
from schema.telemetry import TelemetryEvent

async def events_agent_node(state: CampusAgentState) -> dict:
    start_time = time.time()
    profile = state.user_profile
    
    thought = "Scanning exam schedule conflicts and matching hackathon peer teams..."
    await telemetry_broadcaster.publish(TelemetryEvent(
        thread_id=state.thread_id,
        active_node="EventsEngine",
        sub_agent_thought=thought,
        latency_ms=round((time.time() - start_time) * 1000, 2),
        confidence_score=0.95
    ))

    # Conflict detector
    conflict_check = ConflictDetector.check_conflicts(
        event_name="Smart Campus Innovation Hackathon 2026",
        event_dates="2026-08-28 to 2026-08-30"
    )

    # Team finder
    team_matches = TeamFinderEngine.match_peers(profile, needed_role="Frontend Specialist")

    output_payload = {
        "engine": "Events & Opportunity Engine",
        "conflict_check": conflict_check,
        "team_matches": team_matches,
        "ui_card_type": "EVENTS_TEAM_CARD"
    }

    latency = round((time.time() - start_time) * 1000, 2)
    telemetry_log = {
        "node": "EventsEngine",
        "latency_ms": latency,
        "thought": "Detected exam conflict overlap and generated peer recommendations."
    }

    state.intermediate_outputs["events"] = output_payload
    state.telemetry_logs.append(telemetry_log)
    return {"intermediate_outputs": state.intermediate_outputs, "telemetry_logs": state.telemetry_logs}
