"""
Spatial Campus GIS Engine Deterministic Tool.
Resolves timetable/classroom queries into indoor coordinates and SVG floorplan node paths.
"""

from typing import Dict, Any
from services.mock_db import TIMETABLE_AND_GIS

class SpatialGISResolver:
    @staticmethod
    def resolve_location(query: str) -> Dict[str, Any]:
        query_lower = query.lower()
        matched_class = None

        for class_name, data in TIMETABLE_AND_GIS.items():
            if (class_name.lower() in query_lower or 
                data["building"].lower() in query_lower or 
                data["room"].lower() in query_lower or
                "os" in query_lower or "lab" in query_lower):
                matched_class = (class_name, data)
                break
        
        if not matched_class:
            # Default fallback to OS Lab
            matched_class = ("OS Lab", TIMETABLE_AND_GIS["OS Lab"])

        class_name, data = matched_class

        return {
            "query": query,
            "target_session": class_name,
            "building": data["building"],
            "floor": data["floor"],
            "room": data["room"],
            "coordinates": data["coordinates"],
            "floorplan_path": data["floorplan_path"],
            "svg_nodes": data["svg_nodes"],
            "class_time": data["time"],
            "formatted_location": f"{data['building']}, {data['floor']}, {data['room']}"
        }
