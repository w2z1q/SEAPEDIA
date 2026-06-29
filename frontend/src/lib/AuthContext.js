'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import api from './axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Memeriksa token dan data user yang ada di localStorage saat pertama kali load
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (err) {
        console.error('Failed to parse user data:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = (token, userData) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    window.location.href = '/login';
  };

  const switchRole = async (newRole) => {
    try {
      // Panggil endpoint backend untuk mengganti activeRole jika diperlukan
      const response = await api.post('/auth/switch-role', { role: newRole });
      if (response.data && response.data.user) {
        const updatedUser = response.data.user;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return true;
      }
    } catch (error) {
      console.error('Gagal mengganti role di backend, mengganti secara lokal:', error);
      // Fallback update lokal jika endpoint switch-role spesifik tidak tersedia
      const updatedUser = { ...user, activeRole: newRole };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return true;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
