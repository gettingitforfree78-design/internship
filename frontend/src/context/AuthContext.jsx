import { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getProfile, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.warn('Logout API failed, continuing client logout');
    }
    localStorage.removeItem('launchpad_user');
    localStorage.removeItem('launchpad_token');
    setUser(null);
  };

  // Helper to clear everything (Dev Reset)
  const resetSession = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  useEffect(() => {
    const initAuth = async () => {
      const stored = localStorage.getItem('launchpad_user');
      const token = localStorage.getItem('launchpad_token');

      // 1. Check for manual reset param in URL: ?dev_reset=true
      if (window.location.search.includes('dev_reset=true')) {
        resetSession();
        return;
      }

      // If we have a stored user, attempt to verify session with backend
      if (stored) {
        try {
          setUser(JSON.parse(stored));
          // 2. Verify HttpOnly cookie or Bearer token with server
          const res = await getProfile();
          setUser(res.data.user);
          localStorage.setItem('launchpad_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.warn('Session expired or invalid cookie/token. Logging out...');
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await loginUser({ email, password });
    const { user: userData, token } = res.data;
    localStorage.setItem('launchpad_user', JSON.stringify(userData));
    if (token) localStorage.setItem('launchpad_token', token);
    setUser(userData);
    return res.data;
  };

  const register = async (formData) => {
    const res = await registerUser(formData);
    const { user: userData, token } = res.data;
    localStorage.setItem('launchpad_user', JSON.stringify(userData));
    if (token) localStorage.setItem('launchpad_token', token);
    setUser(userData);
    return res.data;
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, isAdmin: user?.role === 'admin', login, register, logout, resetSession }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
