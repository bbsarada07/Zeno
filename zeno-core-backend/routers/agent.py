"""
FastAPI Router for Agent Execution & HITL Approval.
"""

from fastapi import APIRouter, HTTPException
from schema.requests import ExecuteRequest, HITLApproveRequest
from agents.orchestrator import execute_agent_graph, resume_hitl_agent_graph

router = APIRouter(prefix="/api/v1/agent", tags=["Agent Governance Engine"])

@router.post("/execute")
async def execute_agent(payload: ExecuteRequest):
    try:
        result = await execute_agent_graph(
            user_id=payload.user_id,
            tenant_id=payload.tenant_id,
            message=payload.message,
            context_overrides=payload.context_overrides
        )
        return {
            "status": "success",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Agent graph execution error: {str(e)}")

@router.post("/hitl-approve")
async def hitl_approve(payload: HITLApproveRequest):
    try:
        result = await resume_hitl_agent_graph(
            thread_id=payload.thread_id,
            action_id=payload.action_id,
            approved=payload.approved,
            user_input=payload.user_input
        )
        return {
            "status": "success",
            "message": f"HITL action {payload.action_id} {'approved' if payload.approved else 'rejected'} successfully.",
            "data": result
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"HITL resume error: {str(e)}")
