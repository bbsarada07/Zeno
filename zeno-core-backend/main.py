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
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration with Dynamic Origin Matching
frontend_url = os.getenv("FRONTEND_URL", "https://zeno-governance.vercel.app")
origins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    frontend_url,
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Routers
from routers.agent import router as agent_router, tenant_router
from routers.telemetry import router as telemetry_router

app.include_router(agent_router)
app.include_router(tenant_router)
app.include_router(telemetry_router)

@app.get("/")
async def root():
    return {
        "engine": "Zeno Autonomous Multi-Agent Smart Campus Governance Engine",
        "status": "OPERATIONAL",
        "version": "1.0.0",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health():
    return {"status": "HEALTHY", "service": "zeno-core-backend"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
