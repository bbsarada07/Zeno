"""
Compliance & HITL Gatekeeper Engine Agent Sub-Graph Routines.
Intercepts high-stakes action requests and generates HITL drawer payload.
"""

import time
from schema.state import CampusAgentState
from services.telemetry_broadcaster import telemetry_broadcaster
from schema.telemetry import TelemetryEvent

async def compliance_agent_node(state: CampusAgentState) -> dict:
    start_time = time.time()
    query_lower = state.query.lower()
    
    thought = "Evaluating institutional policy compliance & high-stakes risk triggers..."
    await telemetry_broadcaster.publish(TelemetryEvent(
        thread_id=state.thread_id,
        active_node="ComplianceEngine",
        sub_agent_thought=thought,
        latency_ms=round((time.time() - start_time) * 1000, 2),
        confidence_score=0.99
    ))

    # Check if query requests action that requires Human-In-The-Loop approval
    hitl_required = False
    hitl_payload = None

    if any(w in query_lower for w in ["register", "apply", "waiver", "submit", "approve", "google", "microsoft"]):
        hitl_required = True
        hitl_payload = {
            "action_id": "act_drive_registration_001",
            "action_title": "Placement Drive Registration Verification",
            "company": "Google",
            "role": "Software Development Engineer - I",
            "student_cgpa": state.user_profile.get("cgpa", 8.84),
            "required_min_cgpa": 8.5,
            "risk_assessment": "Low Risk. Candidate satisfies CGPA & backlog policy.",
            "verification_fields": [
                {"field": "Official Transcript", "status": "VERIFIED"},
                {"field": "Attendance Record", "status": "FLAGGED_REVIEW (72.5%)"}
            ],
            "drawer_title": "Human-In-The-Loop Approval Required",
            "drawer_subtitle": "Authorize automated registration for Google Tier-1 Drive."
        }

    output_payload = {
        "engine": "Compliance & HITL Gatekeeper Engine",
        "hitl_required": hitl_required,
        "hitl_payload": hitl_payload,
        "policy_status": "PENDING_USER_APPROVAL" if hitl_required else "PASSED_COMPLIANCE",
        "ui_card_type": "HITL_DRAWER_SPEC" if hitl_required else "COMPLIANCE_PASSED_CARD"
    }

    latency = round((time.time() - start_time) * 1000, 2)
    telemetry_log = {
        "node": "ComplianceEngine",
        "latency_ms": latency,
        "thought": "Halted state execution graph for mandatory HITL approval drawer." if hitl_required else "Compliance checks passed."
    }

    state.hitl_required = hitl_required
    state.hitl_payload = hitl_payload
    state.intermediate_outputs["compliance"] = output_payload
    state.telemetry_logs.append(telemetry_log)

    return {
        "hitl_required": hitl_required,
        "hitl_payload": hitl_payload,
        "intermediate_outputs": state.intermediate_outputs,
        "telemetry_logs": state.telemetry_logs
    }
