import { apiGet, apiPost } from './client';

export interface LoginResponse {
  success: boolean;
  expiresAt?: string;
}

export interface AuthStatus {
  authenticated: boolean;
  expiresAt?: string;
}

export async function login(password: string, rememberMe = false): Promise<LoginResponse> {
  return apiPost<LoginResponse>('/api/auth/login', { password, rememberMe });
}

export async function logout(): Promise<void> {
  await apiPost('/api/auth/logout', {});
}

export async function checkAuth(): Promise<AuthStatus> {
  try {
    const data = await apiGet<AuthStatus>('/api/auth/me');
    return { authenticated: true, expiresAt: data.expiresAt };
  } catch {
    return { authenticated: false };
  }
}
