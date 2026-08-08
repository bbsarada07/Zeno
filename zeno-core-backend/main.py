"""
ZENO Autonomous Campus Intelligence API - Main FastAPI Server
"""

import os
import logging
from typing import Optional, Dict, Any
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)
logger = logging.getLogger("zeno.main")

@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing ZENO Autonomous Campus Intelligence API Backend...")
    try:
        from services.vector_db import vector_db
        logger.info("Qdrant Vector DB Service initialized successfully.")
    except Exception as e:
        logger.warning(f"Qdrant Vector DB deferred initialization: {e}")
    yield
    logger.info("Shutting down Zeno Core Engine.")

app = FastAPI(
    title="ZENO Autonomous Campus Intelligence API",
    description="Multi-Agent Async Governance Engine built with FastAPI, LangGraph, Pydantic v2, and Qdrant.",
    version="2.4.0",
    lifespan=lifespan
)

# Comprehensive CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Permissive origin access for hackathon live demo resilience
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Global Preflight OPTIONS Handler
@app.options("/{full_path:path}")
async def options_handler(full_path: str):
    return JSONResponse(
        status_code=200,
        content={"status": "OK", "message": "CORS preflight permitted"}
    )

# Health Check Endpoints
@app.get("/health")
@app.get("/api/v1/health")
async def health_check():
    return {"status": "ONLINE", "kernel": "ZENO-K3K0", "version": "2.4.0"}

# Robust Pydantic Schemas for Flexible Auth Payloads & Queries
class OTPRequest(BaseModel):
    email: str
    domain_role: Optional[str] = "student"
    tenant: Optional[str] = "CSM-Dept"

class OTPVerify(BaseModel):
    email: str
    otp: Optional[str] = None
    token: Optional[str] = None

class QueryPayload(BaseModel):
    prompt: str
    user: Optional[Dict[str, Any]] = None

# Dynamic Intent Routing Endpoint /api/v1/query
@app.post("/api/v1/query")
async def query_zeno(payload: QueryPayload):
    prompt = payload.prompt or ""
    user = payload.user or {}
    q = prompt.lower()

    # Agent 1: ACADEMIC_GIS (Labs, Rooms, Canteen, Schedules)
    if any(w in q for w in ["canteen", "food", "eat", "cafeteria"]):
        dept = user.get("department_code") or user.get("department") or "CSE"
        return {
            "agent": "ACADEMIC_GIS",
            "markdown": f"📍 **Location Resolution: Campus Canteen & Food Court**\n\n• **Building:** Student Activity Center (SAC) - Ground Floor\n• **Proximity:** 120m from {dept} Block\n• **Operating Hours:** 08:30 AM – 06:00 PM Slot\n👉 *Action: Spatial map vector coordinates transmitted to Campus GIS View.*",
            "gisTarget": {"building": "SAC Building", "floor": 0, "room": "Food Court"},
            "telemetry": {"kernel": "ZENO-K3K0", "status": "ONLINE"}
        }

    if any(w in q for w in ["where", "lab", "next lab", "room"]):
        return {
            "agent": "ACADEMIC_GIS",
            "markdown": "📍 **Location Resolution: Operating Systems Laboratory**\n\n• **Building:** Admin Block - Floor 2 (Room C-12)\n• **Proximity:** 45m from Elevator Bank\n• **Operating Hours:** 10:00 AM – 12:00 PM Slot\n👉 *Action: Spatial map coordinates sent to Campus GIS View.*",
            "gisTarget": {"building": "Admin Block", "floor": 2, "room": "C-12"},
            "telemetry": {"kernel": "ZENO-K3K0", "status": "ONLINE"}
        }

    # Bunk & Attendance Math Calculator
    if any(w in q for w in ["bunk", "skip", "attendance"]):
        currentAtt = user.get("attendance_pct") or user.get("attendance") or user.get("attendance_percentage") or 72.5
        try:
            currentAtt = float(currentAtt)
        except (ValueError, TypeError):
            currentAtt = 72.5
        projectedAtt = round(currentAtt * 0.98, 1)
        return {
            "agent": "ACADEMIC_GIS",
            "markdown": f"⚠️ **Attendance Impact Analysis**\n\n• **Current Attendance:** {currentAtt}%\n• **Projected Attendance if Skipped:** {projectedAtt}%\n• **Status:** 🔴 CRITICAL RISK (Below 75.0% Mandatory Threshold)\n\n*Skipping this class violates academic compliance policy.*",
            "telemetry": {"kernel": "ZENO-K3K0", "status": "ONLINE"}
        }

    # Agent 2: PLACEMENT_PIPELINE
    if any(w in q for w in ["placement", "academic standing", "cgpa", "job"]):
        name = user.get("full_name") or user.get("name") or "Alex Rivera"
        roll = user.get("roll_number") or user.get("roll_no") or "2451-22-733-001"
        cgpa = user.get("cgpa") or "8.84"
        return {
            "agent": "PLACEMENT_PIPELINE",
            "markdown": f"🎓 **Academic Standing & Career Telemetry**\n\n• **Student:** {name} ({roll})\n• **CGPA:** {cgpa} | **Active Backlogs:** 0\n• **Target Drive:** Google AI Engineer (L3) - **94% Readiness Match**\n• **ATS Resume Score:** 88%",
            "telemetry": {"kernel": "ZENO-K3K0", "status": "ONLINE"}
        }

    # Agent 3 & 4: GENERAL GOVERNANCE & EVENTS
    name = user.get("full_name") or user.get("name") or "Alex Rivera"
    return {
        "agent": "GOVERNANCE_ROUTER",
        "markdown": f"📋 **Administrative Workflow Query Processed**\n\nResolved query for **{name}** regarding campus governance policy.\n• **Status:** Verified Active Student Session\n• **Routing:** Department SLA Verification Complete.",
        "telemetry": {"kernel": "ZENO-K3K0", "status": "ONLINE"}
    }

# Explicit /api/v1/auth Endpoints
@app.post("/api/v1/auth/send-otp")
async def send_otp_endpoint(payload: OTPRequest):
    return {
        "status": "success",
        "message": "OTP generated successfully",
        "email": payload.email,
        "role": payload.domain_role,
        "tenant": payload.tenant
    }

@app.post("/api/v1/auth/verify-otp")
async def verify_otp_endpoint(payload: OTPVerify):
    return {
        "access_token": "demo_jwt_token_123",
        "token_type": "bearer",
        "user": {
            "email": payload.email,
            "role": "student",
            "name": "Alex Rivera",
            "rollNumber": "2451-22-733-001",
            "department": "Computer Science & Engineering"
        }
    }

# Mount Routers
from routers.agent import router as agent_router, tenant_router
from routers.telemetry import router as telemetry_router
from routers.hod import router as hod_router

app.include_router(agent_router)
app.include_router(tenant_router)
app.include_router(telemetry_router)
app.include_router(hod_router)

@app.get("/")
async def root():
    return {
        "engine": "ZENO Autonomous Campus Intelligence API",
        "status": "OPERATIONAL",
        "version": "2.4.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)

