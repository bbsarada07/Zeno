"""
Spatial Campus GIS Engine Agent Sub-Graph Routines.
"""

import time
from schema.state import CampusAgentState
from tools.spatial_tools import SpatialGISResolver
from services.telemetry_broadcaster import telemetry_broadcaster
from schema.telemetry import TelemetryEvent

async def spatial_agent_node(state: CampusAgentState) -> dict:
    start_time = time.time()
    
    thought = "Resolving campus classroom coordinates and generating indoor floorplan SVG path..."
    await telemetry_broadcaster.publish(TelemetryEvent(
        thread_id=state.thread_id,
        active_node="SpatialEngine",
        sub_agent_thought=thought,
        latency_ms=round((time.time() - start_time) * 1000, 2),
        confidence_score=0.99
    ))

    # Resolve location
    gis_location = SpatialGISResolver.resolve_location(state.query)

    output_payload = {
        "engine": "Spatial Campus GIS Engine",
        "gis_location": gis_location,
        "ui_card_type": "SPATIAL_FLOORPLAN_CARD"
    }

    latency = round((time.time() - start_time) * 1000, 2)
    telemetry_log = {
        "node": "SpatialEngine",
        "latency_ms": latency,
        "thought": "Resolved building coordinates and rendered SVG node map."
    }

    state.intermediate_outputs["spatial"] = output_payload
    state.telemetry_logs.append(telemetry_log)
    return {"intermediate_outputs": state.intermediate_outputs, "telemetry_logs": state.telemetry_logs}
