/**
 * Zeno Autonomous Campus Governance Engine - API Sync Service
 * Dynamic resolution of backend URL for Vercel/Render dual deployment
 */

const getBackendBaseUrl = (): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) {
    return import.meta.env.VITE_API_BASE_URL;
  }
  if (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) {
    return process.env.NEXT_PUBLIC_API_BASE_URL;
  }
  return 'http://localhost:8000';
};

export const BACKEND_BASE_URL = getBackendBaseUrl();

export interface ExecuteAgentPayload {
  user_id?: string;
  tenant_id?: string;
  message: string;
  context_overrides?: Record<string, any>;
}

export interface AgentExecutionResponse {
  status: string;
  data: {
    thread_id: string;
    final_response?: {
      message: string;
      agent_path?: string[];
      hitl_required?: boolean;
      hitl_payload?: any;
    };
    telemetry_logs?: any[];
    [key: string]: any;
  };
}

/**
 * Check health status of Zeno FastAPI backend
 */
export async function checkBackendHealth(): Promise<{ healthy: boolean; service?: string }> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    if (res.ok) {
      const data = await res.json();
      return { healthy: data.status === 'HEALTHY', service: data.service };
    }
  } catch (err) {
    // Backend offline or unreachable, fallback to simulation mode
  }
  return { healthy: false };
}

/**
 * Execute Multi-Agent Graph via /api/v1/agent/execute or /api/v1/tenant/{tenant_id}/agent/execute
 */
export async function executeAgentGraph(payload: ExecuteAgentPayload): Promise<AgentExecutionResponse | null> {
  const tenantId = payload.tenant_id || 'vce_dept';
  const endpoint = `${BACKEND_BASE_URL}/api/v1/tenant/${tenantId}/agent/execute`;

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: payload.user_id || '2451-22-733-001',
        tenant_id: tenantId,
        message: payload.message,
        context_overrides: payload.context_overrides || {},
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Fallback to standard agent execute endpoint
    try {
      const fallbackRes = await fetch(`${BACKEND_BASE_URL}/api/v1/agent/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: payload.user_id || '2451-22-733-001',
          tenant_id: tenantId,
          message: payload.message,
          context_overrides: payload.context_overrides || {},
        }),
      });
      if (fallbackRes.ok) return await fallbackRes.json();
    } catch (fallbackErr) {
      console.warn('FastAPI backend connection error, using local agent engine fallback.', fallbackErr);
    }
  }
  return null;
}

/**
 * Approve or Reject Human-In-The-Loop (HITL) action via /api/v1/agent/hitl-approve
 */
export async function approveHitlBackend(
  threadId: string,
  actionId: string,
  approved: boolean,
  userInput?: string
): Promise<any> {
  try {
    const res = await fetch(`${BACKEND_BASE_URL}/api/v1/agent/hitl-approve`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        thread_id: threadId,
        action_id: actionId,
        approved,
        user_input: userInput || '',
      }),
    });

    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    console.warn('HITL approval API call error:', err);
  }
  return null;
}

/**
 * Subscribe to real-time telemetry EventSource stream at /api/v1/telemetry/stream
 */
export function subscribeTelemetryStream(onMessage: (event: MessageEvent) => void): EventSource | null {
  try {
    const eventSource = new EventSource(`${BACKEND_BASE_URL}/api/v1/telemetry/stream`);
    eventSource.onmessage = onMessage;
    eventSource.onerror = (err) => {
      console.warn('Telemetry EventSource disconnected:', err);
      eventSource.close();
    };
    return eventSource;
  } catch (err) {
    console.warn('Could not initialize EventSource stream:', err);
    return null;
  }
}
