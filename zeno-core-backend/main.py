"""
Zeno Autonomous Multi-Agent Smart Campus Governance Engine - Main FastAPI Server
"""

import os
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
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
    logger.info("Initializing Zeno Autonomous Campus Governance Engine Backend...")
    try:
        from services.vector_db import vector_db
        logger.info("Qdrant Vector DB Service initialized successfully.")
    except Exception as e:
        logger.warning(f"Qdrant Vector DB deferred initialization: {e}")
    yield
    logger.info("Shutting down Zeno Core Engine.")

app = FastAPI(
    title="Zeno Autonomous Campus Governance Engine",
    description="Multi-Agent Async Governance Engine built with FastAPI, LangGraph, Pydantic v2, and Qdrant.",
    version="1.4.0",
    lifespan=lifespan
)

# CORS Configuration with Explicit Origins & Wildcard Fallback
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://zeno1.vercel.app",
    "https://zeno1-xi.vercel.app",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Health Check Endpoints
@app.get("/health")
@app.get("/api/v1/health")
async def health_check():
    return {
        "status": "online",
        "kernel": "Zeno v1.4 active",
        "tenant": "CSM-Dept",
        "engine": "Zeno Autonomous Multi-Agent Smart Campus Governance Engine"
    }

# Mount Routers
from routers.agent import router as agent_router, tenant_router
from routers.telemetry import router as telemetry_router
from routers.auth import router as auth_router
from routers.hod import router as hod_router

app.include_router(agent_router)
app.include_router(tenant_router)
app.include_router(telemetry_router)
app.include_router(auth_router)
app.include_router(hod_router)

@app.get("/")
async def root():
    return {
        "engine": "Zeno Autonomous Multi-Agent Smart Campus Governance Engine",
        "status": "OPERATIONAL",
        "version": "1.4.0",
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
