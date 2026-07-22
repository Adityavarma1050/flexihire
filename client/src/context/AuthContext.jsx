import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = sessionStorage.getItem('flexihire_user') || localStorage.getItem('flexihire_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [token, setToken] = useState(() => {
    return sessionStorage.getItem('flexihire_token') || localStorage.getItem('flexihire_token') || null;
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuthStatus = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            sessionStorage.setItem('flexihire_user', JSON.stringify(res.data.user));
          }
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          logout();
        }
      }
      setLoading(false);
    };

    checkAuthStatus();
  }, [token]);

  const saveAuthSession = (newToken, newUser) => {
    setToken(newToken);
    setUser(newUser);
    // Tab-isolated storage
    sessionStorage.setItem('flexihire_token', newToken);
    sessionStorage.setItem('flexihire_user', JSON.stringify(newUser));
  };

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user);
    }
    return res.data;
  };

  const register = async (formData) => {
    const res = await API.post('/auth/register', formData);
    if (res.data.success) {
      saveAuthSession(res.data.token, res.data.user);
    }
    return res.data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('flexihire_token');
    sessionStorage.removeItem('flexihire_user');
    localStorage.removeItem('flexihire_token');
    localStorage.removeItem('flexihire_user');
    API.post('/auth/logout').catch(() => {});
  };

  const updateUser = (updatedFields) => {
    setUser((prev) => {
      const newUser = { ...prev, ...updatedFields };
      sessionStorage.setItem('flexihire_user', JSON.stringify(newUser));
      return newUser;
    });
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!user && !!token,
    isSeeker: user?.role === 'job_seeker',
    isEmployer: user?.role === 'employer',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
