/**
 * Centralized Resilient API Client for Zeno Autonomous Campus Platform
 * Primary Live Backend: https://zeno-k3k0.onrender.com
 */

export const API_BASE_URL =
  (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_API_BASE_URL) ||
  (typeof process !== 'undefined' && process.env && process.env.NEXT_PUBLIC_API_BASE_URL) ||
  'https://zeno-k3k0.onrender.com';

interface RequestOptions extends RequestInit {
  timeoutMs?: number;
  fallbackData?: any;
}

class ResilientApiClient {
  private getHeaders(customHeaders: HeadersInit = {}): Headers {
    const headers = new Headers(customHeaders);

    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    // Dynamic JWT Token Injection
    const token = localStorage.getItem('zeno_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }

    // Dynamic Tenant ID Injection
    const tenant = localStorage.getItem('zeno_tenant') || localStorage.getItem('Zeno_Auth_Vault');
    if (tenant) {
      try {
        const parsed = JSON.parse(tenant);
        const tenantCode = parsed.tenantCode || parsed.code || 'VCE-HDO-500031';
        headers.set('X-Tenant-ID', tenantCode);
      } catch (e) {
        headers.set('X-Tenant-ID', tenant);
      }
    } else {
      headers.set('X-Tenant-ID', 'VCE-HDO-500031');
    }

    return headers;
  }

  public async request<T = any>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { timeoutMs = 6000, fallbackData, headers: customHeaders, ...fetchOptions } = options;
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        ...fetchOptions,
        headers: this.getHeaders(customHeaders),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        console.warn(`[ZENO API WARNING] ${url} returned HTTP ${response.status}. Executing Local Memory Enclave Fallback.`);
        return (fallbackData ?? null) as T;
      }

      const data = await response.json();
      return data as T;
    } catch (error: any) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        console.warn(`[ZENO API TIMEOUT] ${url} timed out after ${timeoutMs}ms. EXECUTING LOCAL MEMORY ENCLAVE FALLBACK.`);
      } else {
        console.warn(`[ZENO API ERROR] Connection to ${url} failed. EXECUTING LOCAL MEMORY ENCLAVE FALLBACK.`, error);
      }
      return (fallbackData ?? null) as T;
    }
  }

  public async get<T = any>(endpoint: string, fallbackData?: T, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', fallbackData, ...options });
  }

  public async post<T = any>(endpoint: string, body?: any, fallbackData?: T, options: RequestOptions = {}): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
      fallbackData,
      ...options,
    });
  }

  public async uploadFile<T = any>(endpoint: string, formData: FormData, fallbackData?: T, options: RequestOptions = {}): Promise<T> {
    const headers = new Headers();
    const token = localStorage.getItem('zeno_token');
    if (token) headers.set('Authorization', `Bearer ${token}`);

    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL.replace(/\/$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeoutMs || 8000);

    try {
      const response = await fetch(url, {
        method: 'POST',
        body: formData,
        headers,
        signal: controller.signal,
        ...options,
      });
      clearTimeout(timeoutId);
      if (!response.ok) return (fallbackData ?? null) as T;
      return (await response.json()) as T;
    } catch (e) {
      clearTimeout(timeoutId);
      console.warn(`[ZENO API UPLOAD FALLBACK] ${url} upload timed out or failed. Returning local fallback.`);
      return (fallbackData ?? null) as T;
    }
  }

  public async checkHealth(): Promise<boolean> {
    try {
      const data = await this.get<any>('/health', null, { timeoutMs: 3500 });
      if (data && (data.status === 'ok' || data.status === 'healthy' || data.healthy === true)) {
        return true;
      }
      const docsResp = await fetch(`${API_BASE_URL.replace(/\/$/, '')}/docs`, { method: 'HEAD', signal: AbortSignal.timeout(3500) });
      return docsResp.status < 500;
    } catch (e) {
      return false;
    }
  }
}

export const apiClient = new ResilientApiClient();
