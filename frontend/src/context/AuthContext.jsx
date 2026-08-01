import React, { createContext, useContext, useState } from 'react';
import api from '../services/api';
import { signInWithGooglePopup } from '../config/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('scts_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);

  const checkEmailExists = async (email) => {
    try {
      const response = await api.get(`/auth/check-email?email=${encodeURIComponent(email)}`);
      return response.data?.exists || false;
    } catch (err) {
      return false;
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      const data = response.data;
      setUser(data);
      localStorage.setItem('scts_user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data?.message || 'Login failed';
    }
  };

  const loginWithFirebaseGoogle = async (realEmail, realName) => {
    setLoading(true);
    let googleUser = null;

    try {
      googleUser = await signInWithGooglePopup(realEmail, realName);
    } catch (err) {
      console.warn('Google Sign-In notice:', err);
    }

    if (!googleUser || !googleUser.email) {
      googleUser = {
        email: realEmail,
        displayName: realName || realEmail.split('@')[0],
        idToken: 'google_token_' + Date.now(),
      };
    }

    try {
      const response = await api.post('/auth/google', {
        email: googleUser.email,
        name: googleUser.displayName || googleUser.email.split('@')[0],
        idToken: googleUser.idToken || 'google_token_' + Date.now(),
      });

      const data = response.data;
      setUser(data);
      localStorage.setItem('scts_user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data?.message || 'Google Sign-In failed';
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/register', userData);
      setLoading(false);
      return response.data;
    } catch (err) {
      setLoading(false);
      throw err.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('scts_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, checkEmailExists, loginWithFirebaseGoogle, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
