import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { fetchMe, login as loginRequest } from '@/lib/api';
import { readStoredToken, setAuthToken } from '@/lib/session';
import type { Account } from '@/lib/types';

type SessionValue = {
  user: Account | null;
  ready: boolean;
  login: (email: string, password: string) => Promise<Account>;
  logout: () => void;
  refresh: () => Promise<Account | null>;
};

const SessionContext = createContext<SessionValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Account | null>(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    if (!readStoredToken()) {
      setUser(null);
      return null;
    }
    try {
      const account = await fetchMe();
      setUser(account);
      return account;
    } catch {
      setAuthToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    void refresh().finally(() => setReady(true));
  }, [refresh]);

  const login = useCallback(async (email: string, password: string) => {
    const response = await loginRequest(email.trim(), password);
    setAuthToken(response.token);
    const account = await fetchMe();
    setUser(account);
    return account;
  }, []);

  const logout = useCallback(() => {
    setAuthToken(null);
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, ready, login, logout, refresh }), [user, ready, login, logout, refresh]);
  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) {
    throw new Error('useSession tiene que usarse dentro de SessionProvider');
  }
  return value;
}
