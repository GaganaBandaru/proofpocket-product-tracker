import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { signup as apiSignup, login as apiLogin, getMe as apiGetMe } from '../api/auth';
import { TOKEN_STORAGE_KEY } from '../api/products';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Clear session locally
  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  // Check and restore session on mount
  useEffect(() => {
    let isMounted = true;

    async function initAuth() {
      const storedToken = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (!storedToken) {
        if (isMounted) setLoading(false);
        return;
      }

      try {
        const data = await apiGetMe(storedToken);
        if (isMounted) {
          setUser(data.user);
          setToken(storedToken);
        }
      } catch {
        // Expired or invalid token
        if (isMounted) {
          logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    initAuth();

    // Listen for global auth expiration events from API layer
    function handleAuthExpired() {
      logout();
    }

    window.addEventListener('proofpocket-auth-expired', handleAuthExpired);
    return () => {
      isMounted = false;
      window.removeEventListener('proofpocket-auth-expired', handleAuthExpired);
    };
  }, [logout]);

  // Login handler
  const login = useCallback(async (email, password) => {
    const data = await apiLogin({ email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  // Signup handler
  const signup = useCallback(async (name, email, password) => {
    const data = await apiSignup({ name, email, password });
    localStorage.setItem(TOKEN_STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
    return data.user;
  }, []);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    loading,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export default AuthProvider;
