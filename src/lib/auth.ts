export type AuthRole = "client" | "provider";

export type AuthSession = {
  isAuthenticated: boolean;
  role: AuthRole;
  email: string;
  firstName?: string;
  createdAt: string;
};

const AUTH_SESSION_KEY = "iciwork-auth-session";

export const getAuthSession = (): AuthSession | null => {
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.isAuthenticated) return null;
    return parsed;
  } catch {
    return null;
  }
};

export const isAuthenticated = (): boolean => Boolean(getAuthSession());

export const saveAuthSession = (session: AuthSession) => {
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearAuthSession = () => {
  localStorage.removeItem(AUTH_SESSION_KEY);
};

