"""
Communication & Grievance Engine Agent Sub-Graph Routines.
"""

import time
from schema.state import CampusAgentState
from tools.comms_tools import AnnouncementSummarizer, GrievanceRouter
from services.telemetry_broadcaster import telemetry_broadcaster
from schema.telemetry import TelemetryEvent

async def comms_agent_node(state: CampusAgentState) -> dict:
    start_time = time.time()
    profile = state.user_profile
    
    thought = "Summarizing raw campus notice board texts and classifying grievance ticket..."
    await telemetry_broadcaster.publish(TelemetryEvent(
        thread_id=state.thread_id,
        active_node="CommunicationEngine",
        sub_agent_thought=thought,
        latency_ms=round((time.time() - start_time) * 1000, 2),
        confidence_score=0.97
    ))

    # Summarize announcements
    notices_summary = AnnouncementSummarizer.summarize()

    # Route grievance if query looks like a complaint/request
    grievance_ticket = None
    query_lower = state.query.lower()
    if any(w in query_lower for w in ["complain", "issue", "broken", "ticket", "grievance", "not working", "wifi"]):
        grievance_ticket = GrievanceRouter.route_complaint(state.query, profile)

    output_payload = {
        "engine": "Communication & Grievance Engine",
        "notice_summaries": notices_summary,
        "grievance_ticket": grievance_ticket,
        "ui_card_type": "COMMUNICATION_GRIEVANCE_CARD"
    }

    latency = round((time.time() - start_time) * 1000, 2)
    telemetry_log = {
        "node": "CommunicationEngine",
        "latency_ms": latency,
        "thought": "Summarized official announcements and dispatched institutional ticket."
    }

    state.intermediate_outputs["comms"] = output_payload
    state.telemetry_logs.append(telemetry_log)
    return {"intermediate_outputs": state.intermediate_outputs, "telemetry_logs": state.telemetry_logs}
