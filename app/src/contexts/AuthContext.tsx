import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import * as authApi from '@/api/auth';
import { ApiRequestError } from '@/api/client';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  expiresAt: string | null;
  authenticate: (password: string, rememberMe?: boolean) => Promise<boolean>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt).getTime() <= Date.now();
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expiresAt, setExpiresAt] = useState<string | null>(null);

  const handleLogout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors; clear local state regardless.
    }
    setIsAuthenticated(false);
    setExpiresAt(null);
  }, []);

  const checkAuth = useCallback(async () => {
    try {
      const result = await authApi.checkAuth();
      if (result.authenticated && result.expiresAt && isExpired(result.expiresAt)) {
        await handleLogout();
      } else {
        setIsAuthenticated(result.authenticated);
        setExpiresAt(result.expiresAt ?? null);
      }
    } catch {
      setIsAuthenticated(false);
      setExpiresAt(null);
    } finally {
      setIsLoading(false);
    }
  }, [handleLogout]);

  useEffect(() => {
    // Defer to the next tick so the state update does not happen
    // synchronously inside the effect body.
    const timer = setTimeout(() => {
      checkAuth();
    }, 0);
    return () => clearTimeout(timer);
  }, [checkAuth]);

  // Auto-logout when the current session reaches its expiry time.
  useEffect(() => {
    if (!expiresAt) return;

    const expiryTime = new Date(expiresAt).getTime();
    const msUntilExpiry = expiryTime - Date.now();

    if (msUntilExpiry <= 0) {
      // Defer logout to the next tick to avoid a synchronous setState
      // inside the effect body.
      const timer = setTimeout(() => {
        handleLogout();
      }, 0);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      handleLogout();
    }, msUntilExpiry);

    return () => clearTimeout(timer);
  }, [expiresAt, handleLogout]);

  const authenticate = async (
    password: string,
    rememberMe = false
  ): Promise<boolean> => {
    try {
      const data = await authApi.login(password, rememberMe);
      setIsAuthenticated(true);
      setExpiresAt(data.expiresAt ?? null);
      return true;
    } catch (error) {
      if (error instanceof ApiRequestError && error.statusCode === 401) {
        return false;
      }
      throw error;
    }
  };

  const logout = async () => {
    await handleLogout();
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, expiresAt, authenticate, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
