import asyncio
from fastapi.testclient import TestClient
from main import app

def test_api():
    client = TestClient(app)
    
    # 1. Health check
    response = client.get("/health")
    assert response.status_code == 200
    print("Health Check Response:", response.json())
    
    # 2. Root check
    root_res = client.get("/")
    assert root_res.status_code == 200
    print("Root Endpoint Response:", root_res.json())
    
    # 3. Agent Execute Endpoint
    exec_payload = {
        "user_id": "2451-22-733-001",
        "tenant_id": "cse_dept",
        "message": "I want to apply for Google drive and check my safe bunks for attendance"
    }
    exec_res = client.post("/api/v1/agent/execute", json=exec_payload)
    assert exec_res.status_code == 200
    data = exec_res.json()["data"]
    print("Execute Endpoint Success! Thread ID:", data["thread_id"])
    print("HITL Required:", data["hitl_required"])
    
    # 4. HITL Approve Endpoint
    hitl_payload = {
        "thread_id": data["thread_id"],
        "action_id": "act_drive_registration_001",
        "approved": True,
        "user_input": {"verified_by": "Alex"}
    }
    hitl_res = client.post("/api/v1/agent/hitl-approve", json=hitl_payload)
    assert hitl_res.status_code == 200
    print("HITL Approve Endpoint Success!", hitl_res.json()["message"])

if __name__ == "__main__":
    test_api()
    print("\nALL FASTAPI ROUTER ENDPOINT TESTS PASSED SUCCESSFULLY!")
